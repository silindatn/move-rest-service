let express = require('express')
let router = express.Router()
let handler = express()
let bodyParser = require('body-parser').json()
let User = require('./../../db/model/User-model');
let UserRole = require('./../../db/model/UserRole-model');
let Language = require('./../../db/model/Language-model');
let AuthDetail = require('./../../db/model/AuthDetail-model')
let service = require('./../../engine/HashService')
let userHelper = require('./helper/user_helper')
let Configurations = require('./../../engine/ConfigService');
let config = new Configurations()
let Notification = require('./../../db/model/Notification-model')
let Branch = require('./../../db/model/Branch-model')
let Device = require('./../../db/model/sub/Device-model');
let passwordSheriff = require('password-sheriff')
let PasswordPolicy = passwordSheriff.PasswordPolicy
let async = require('async')
let Chance = require('chance')
let chance = new Chance()
let randomize = require('randomatic')
let _ = require('lodash');
let charsets = passwordSheriff.charsets
let log4js = require('log4js')
let logger = log4js.getLogger('USER-API')
logger.level = 'debug'

router.post('/create', bodyParser, function (req, res) {
    let data = req.body
    let admin = data.user
    async.waterfall([
        function doValidate (next) {
            userHelper.validateCreateRequest(data.userAdd, function (err) {
                if (err) {
                    next(err, null)
                } else {
                    next(null, data.userAdd)
                }
            })
        },
        function doPassword (payload, next) {
            let password = '1'
            if (payload && payload.platform && payload.platform === 'WEB-API') {
                password = randomize('Aa0!', 16)
            } else {
                password = randomize('A', 3) + randomize('a', 4) + randomize('0', 2) + '!'
            }
            data['successText'] = 'Welcome Move Portal. Your Password is ' + password + ', please change immediatley.If you did not make this request,contact Move at +27000000000.'
            next(null, password, payload)
        },
        function doSecurity (password, payload, next) {
            const channel = payload.channel !== undefined && payload.channel !== '' ? payload.channel : data.channel;
            console.log(channel, payload.channel, data.channel);
            config.locate('PASSWORDRULES_' + channel, function (err, info) {
                let expressionsArr = []
                if (err) {
                    next('config.password.rules.ntf', null)
                } else {
                    Object.keys(info.value).forEach(function (key, index) {
                        if (info.value[key]) {
                            switch (key) {
                            case 'digits':
                                expressionsArr.push(charsets.numbers)
                                break
                            case 'lowercase':
                                expressionsArr.push(charsets.lowerCase)
                                break
                            case 'uppercase':
                                expressionsArr.push(charsets.upperCase)
                                break
                            case 'symbols':
                                expressionsArr.push(charsets.specialCharacters)
                                break
                            default:
                                logger.fatal(index + ' has a problem')

                            }
                        }
                    })
                    let policy = new PasswordPolicy({
                        length: {
                            minLength: info.value.length
                        },
                        containsAtLeast: {
                            atLeast: info.value.atLeast,
                            expressions: expressionsArr
                        }
                    })
                    if (policy.check(password)) {
                        service.encrypt(password, function (err, hash) {
                            if (!err && hash) {
                                data['password'] = {
                                    hash: hash
                                }
                                next(null, payload)
                            } else {
                                next(err, null)
                            }
                        })
                    } else {
                        next('Password not valid', null)
                    }
                }
            })
        },
        function getLanguage (payload, next) {
            Language.findOne({
                where: { system_default: true },
            }).then((default_language) => {
                payload['languageId'] = default_language.id
                next(null, payload)
            }).catch((err) => {
                next(null, payload)
            })
        },
        function doCreateUser (payload, next) {
            userHelper.createUser(payload, admin, function (err, user) {
                if (!err && user) {
                    next(null, user, payload)
                } else {
                    next(err, null)
                }
            })
        },
        function DoAuth (user, payload, next) {
            let expiryDate = new Date()
            expiryDate.setDate(expiryDate.getDate() + 30);
            AuthDetail.create({
                userId: user.id,
                channel: 'PORTAL',
                uuid: user.email,
                status: 'ACTIVE',
                device: {
                    token: '',
                    status: 'NEW',
                    deviceId: user.email,
                    platform: 'PORTAL'
                },
                hash: data.password.hash,
                expiry_date: expiryDate
            }).then((authData) => {
                Notification.create({
                    message: data.successText,
                    server_ref: chance.zip(), // / this is for testing
                    type: 'SMS',
                    channel: authData.channel,
                    owner: user.id,
                    msisdn: payload.msisdn
                }).then((notification) => {
                    logger.info('notification ' + notification.id + ' has been sent')
                })
                next(null, user)
            }).catch((err) => {
                next(err, null)
            });
        },
    ],
    function done (err, result) {
        if (!err) {
            res.send({code: '00', message: 'success', data: result})
        } else {
            res.send({code: '06', message: err})
        }
    })
})
router.post('/list_all', bodyParser, function (req, res) {
    const query = req.body.query || {}
    if (query !== {} && query.hasOwnProperty('name')) {
        async.waterfall([
            function getBranches (next) {
                Branch.findAll({
                    where: query
                }).then((branches) => {
                    let branch_ids = [];
                    async.forEachOf(branches, function (branch, i, sb) {
                        branch_ids.push(branch.id)
                        sb()
                    },
                    function close () {
                        next(null, branch_ids)
                    })
                }).catch((err) => {
                    next('#branch.list_by_id.ntf', null)
                });
            },
            function getUsers (branch_ids, next) {
                User.findAll({
                    where: {branchId: branch_ids}
                }).then((users) => {
                    next(null, users);
                }).catch((err) => {
                    next(err)
                });
            }
        ],
        function done (err, result) {
            if (!err) {
                res.send({code: '00', message: 'success', data: result})
            } else {
                res.send({code: '06', message: '#permission.list_all.refused'})
            }
        })
    } else {
        User.findAll({
            where: query
        }).then((users) => {
            res.send({code: '00', message: 'success', data: users})
        }).catch((err) => {
            res.send({code: '06', message: err.message || err})
        });
    }
})
router.post('/list_all_not', bodyParser, function (req, res) {
    const query = req.body.query || {};
    Notification.findAll({
        where: query,
    }).then((notifications) => {
        res.send({code: '00', message: 'success', data: notifications})
    }).catch((err) => {
        res.send({code: '06', message: err.message || err})
    });
});
router.post('/reissue_user_password', bodyParser, function (req, res) {
    let data = req.body
    let admin = data.user
    async.waterfall([
        function doPassword (next) {
            let password = randomize('Aa0!', 16)
            let p_password = randomize('A', 1) + randomize('a', 4) + randomize('0', 2) + '!'
            data['p_successText'] = 'Move Portal. Your Password is ' + p_password + ', please change immediatley.If you did not make this request,contact Move at +27000000000.'
            data['successText'] = 'Move Web-API. Your Password has been reset to ' + password + ', please change immediatley.If you did not make this request,contact Move at +27000000000.'
            next(null, password, p_password, data)
        },
        function doSecurity (password, p_password, payload, next) {
            config.locate('PASSWORDRULES_' + payload.channel, function (err, info) {
                let expressionsArr = []
                Object.keys(info.value).forEach(function (key, index) {
                    if (info.value[key]) {
                        switch (key) {
                        case 'digits':
                            expressionsArr.push(charsets.numbers)
                            break
                        case 'lowercase':
                            expressionsArr.push(charsets.lowerCase)
                            break
                        case 'uppercase':
                            expressionsArr.push(charsets.upperCase)
                            break
                        case 'symbols':
                            expressionsArr.push(charsets.specialCharacters)
                            break
                        default:
                            logger.fatal(index + ' has a problem')
                        }
                    }
                })
                let policy = new PasswordPolicy({
                    length: {
                        minLength: info.value.length
                    },
                    containsAtLeast: {
                        atLeast: info.value.atLeast,
                        expressions: expressionsArr
                    }
                })
                if (policy.check(password)) {
                    service.encrypt(password, function (err, hash) {
                        if (!err && hash) {
                            data['password'] = {
                                hash: hash
                            }
                            next(null, p_password, payload)
                        } else {
                            next(err, null)
                        }
                    })
                } else {
                    next('Password not valid', null)
                }
            })
        },
        function doSecurity (p_password, payload, next) {
            config.locate('PASSWORDRULES_' + payload.channel, function (err, info) {
                let expressionsArr = []
                Object.keys(info.value).forEach(function (key, index) {
                    if (info.value[key]) {
                        switch (key) {
                        case 'digits':
                            expressionsArr.push(charsets.numbers)
                            break
                        case 'lowercase':
                            expressionsArr.push(charsets.lowerCase)
                            break
                        case 'uppercase':
                            expressionsArr.push(charsets.upperCase)
                            break
                        case 'symbols':
                            expressionsArr.push(charsets.specialCharacters)
                            break
                        default:
                            logger.fatal(index + ' has a problem')
                        }
                    }
                })
                let policy = new PasswordPolicy({
                    length: {
                        minLength: info.value.length
                    },
                    containsAtLeast: {
                        atLeast: info.value.atLeast,
                        expressions: expressionsArr
                    }
                })
                if (policy.check(p_password)) {
                    service.encrypt(p_password, function (err, hash) {
                        if (!err && hash) {
                            data['p_password'] = {
                                hash: hash
                            }
                            next(null, payload)
                        } else {
                            next(err, null)
                        }
                    })
                } else {
                    next('Password not valid', null)
                }
            })
        },
        function getUser (payload, next) {
            User.findAll({
                where: payload.query
            }).then((user_doc) => {
                next(null, user_doc, payload)
            }).catch((err) => {
                next('user.reissue.ntf', null)
            });
        },
        function DoAuth (user, payload, next) {
            let expiry_date = new Date()
            expiry_date.setDate(expiry_date.getDate() + 30)
            AuthDetail.findOne({
                where: {user: user.id, channel: 'portal'}
            }).then((auth) => {
                return auth.updateAttributes({
                    status: 'REISSUE',
                    hash: data.p_password.hash,
                    expiry_date: expiry_date})
            }).then((updatedAuth) => {
                Notification.create({
                    message: data.successText,
                    server_ref: chance.zip(), // / this is for testing
                    type: 'SMS',
                    channel: authData.channel,
                    owner: user.id,
                    msisdn: payload.msisdn
                }).then((notification) => {
                    logger.info('notification ' + notification.id + ' has been sent')
                })
                next(null, user)
            }).catch((err) => {
                AuthDetail.findOne({
                    where: {user: user.id, channel: 'web-api'}
                }).then((auth) => {
                    return auth.updateAttributes({
                        hash: data.p_password.hash,
                        expiry_date: expiry_date
                    })
                }).then((updatedAuth) => {
                    Notification.create({
                        message: data.successText,
                        server_ref: chance.zip(), // / this is for testing
                        type: 'SMS',
                        channel: authData.channel,
                        owner: user.id,
                        msisdn: payload.msisdn
                    }).then((notification) => {
                        logger.info('notification ' + notification.id + ' has been sent')
                    })
                    next(null, user)
                }).catch((err) => {
                    next(err, null)
                });
            });
        }],
    function done (err, result) {
        if (!err) {
            res.send({code: '00', message: 'success', data: result})
        } else {
            res.send({code: '06', message: err})
        }
    })
})
router.post('/list_config', bodyParser, function (req, res) {
    let config_name = req.body.config_name
    if (Array.isArray(config_name)) {
        let result = {}
        async.forEachOf(config_name, function (_config_name, index, callback) {
            config.locate(_config_name, function (err, info) {
                if (!err && info) {
                    result[_config_name] = info.value.items
                    callback()
                } else {
                    logger.fatal(err.message || err)
                    callback()
                }
            })
        }, function close () {
            res.send({code: '00', message: 'success', data: result})
        })
    } else {
        config.locate(config_name, function (err, info) {
            if (!err && info) {
                res.send({code: '00', message: 'success', data: info})
            } else {
                res.send({code: '06', message: '#user.list.config.ntf'})
            }
        })
    }
})
router.post('/deactivate', bodyParser, function (req, res) {
    const data = req.body
    let update_user_id = data.update_user_id
    let admin = data.user
    async.waterfall([
        function getUser (next) {
            User.findOne({
                where: {id: update_user_id}
            }).then((user_doc) => {
                return user_doc.updateAttributes({
                    status: 'INACTIVE',
                })
            }).then((uodatedUser) => {
                next(null, uodatedUser)
            }).catch((err) => {
                next('user.deactivate.failed', null)
            });
        },
        function DoAuth (user, next) {
            AuthDetail.findAll({
                where: {userId: user.id}
            }).then((auths) => {
                async.forEachOf(auths, function (auth, index, cb) {
                    auth.updateAttributes({
                        status: 'INACTIVE',
                    }).then((updatedAuth) => {
                        logger.info('auth.' + index + '.updated.successfully');
                        cb();
                    }).catch((err) => {
                        logger.fatal('auth.' + index + ' update.failed');
                        cb();
                    })
                }, function close () {
                    next(null, user)
                })
            }).catch((err) => {
                next(err, null);
            })
        }],
    function done (err, result) {
        if (!err && result) {
            res.send({code: '00', message: 'success', data: result})
        } else {
            res.send({code: '06', message: err.message || err})
        }
    })
})
router.post('/activate', bodyParser, function (req, res) {
    const data = req.body
    let update_user_id = data.update_user_id
    let admin = data.user
    async.waterfall([
        function getUser (next) {
            User.findOne({
                where: {id: update_user_id}
            }).then((user_doc) => {
                return user_doc.updateAttributes({
                    status: 'ACTIVE',
                })
            }).then((uodatedUser) => {
                next(null, uodatedUser)
            }).catch((err) => {
                next('user.activate.failed', null)
            });
        },
        function DoAuth (user, next) {
            AuthDetail.findAll({
                where: {userId: user.id}
            }).then((auths) => {
                async.forEachOf(auths, function (auth, index, cb) {
                    auth.updateAttributes({
                        status: 'ACTIVE',
                    }).then((updatedAuth) => {
                        logger.info('auth.' + index + '.updated.successfully');
                        cb();
                    }).catch((err) => {
                        logger.fatal('auth.' + index + ' update.failed');
                        cb();
                    })
                }, function close () {
                    next(null, user)
                })
            }).catch((err) => {
                next(err, null);
            })
        }],
    function done (err, result) {
        if (!err && result) {
            res.send({code: '00', message: 'success', data: result})
        } else {
            res.send({code: '06', message: err})
        }
    })
})
router.post('/updated_user_role', bodyParser, function (req, res) {
    const data = req.body
    let update_user = data.update_user
    let admin = data.user
    UserRole.findAll({
        where: {userId: update_user.id}
    }).then((userRoles) => {
        async.forEachOf(update_user.roles, (role, index, cb) => {
            UserRole.findOne({
                where: { userId: update_user.id, roleId: role.id },
            }).then((userRole_exist) => {
                if (userRole_exist) {
                    cb();
                } else {
                    UserRole.create({userId: update_user.id, roleId: role.id})
                        .then((userRole) => {
                            cb();
                        })
                        .catch((err) => {
                            cb();
                        })
                }
            })
                .catch((err) => {
                    cb();
                })
        }, () => {
            async.forEachOf(userRoles, (userRole, index, cb) => {
                const found = _.findIndex(update_user.roles, {id: userRole.roleId});
                logger.info(found, userRole.userId, userRole.roleId);
                if (found < 0) {
                    UserRole.destroy({where: {userId: userRole.userId, roleId: userRole.roleId}})
                        .then((destroyed) => {
                            logger.info('Destroyed no:  ' + destroyed);
                            cb();
                        })
                        .catch((err) => {
                            logger.info('Destroyed Error:  ' + err);
                            cb();
                        })
                } else {
                    cb();
                }
            }, () => {
                res.send({code: '00', message: 'success'})
            })
        });
    }).catch((err) => {
        res.send({code: '06', message: err.message || err})
    });
})
router.post('/updated_user', bodyParser, function (req, res) {
    const data = req.body
    let update_user = data.update_user
    let admin = data.user
    User.findOne({
        where: {id: update_user.id}
    }).then((user_doc) => {
        return user_doc.updateAttributes(update_user)
    }).then((updatedUser) => {
        res.send({code: '00', message: 'success', data: updatedUser})
    }).catch((err) => {
        res.send({code: '06', message: err.message || err})
    });
})

handler.use('/user', router)
module.exports = handler
