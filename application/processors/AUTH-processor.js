var async = require('async')
var TranHelper = require('./helper/TranHelper')
var User = require('./../../db/model/User-model')
var Session = require('./../../db/model/Session-model')
var AuthDetail = require('./../../db/model/AuthDetail-model')
var Application = require('./../../db/model/Application-model')
var helper = require('./../../engine/HashService');
// var serverHelper = require('./helper/serverHelper')
var handler = new TranHelper()
var moment = require('moment')
var S = require('string')
var Chance = require('chance')
var chance = new Chance()

handler.processStep = function (uri, action, payload, callback) {
    action = payload.action
    async.waterfall([
        function doSession (next) {
            if (payload.session) {
                next(null, payload.session)
            } else {
                next('#auth_handler.session.invalid')
            }
        },
        function doAuth (session, next) {
            var query = {channel: session.channel, uuid: payload.username}
            if (session.channel === 'APP' && action === 'OTP-CHECK') {
                query = {channel: 'OTP', uuid: payload.uuid}
                AuthDetail.findOne({
                    where: query
                }).then((auth) => {
                    helper.compare(payload.otp, auth.hash, function (err, isMatch) {
                        if (!err && isMatch === true) {
                            next(null, auth, session)
                        } else {
                            next('#auth_handler.credentials.invalid1')
                        }
                    })
                }).catch((err) => {
                    next('#auth_handler.authdetail.ntf')
                })
            } else {
                AuthDetail.findOne({
                    where: query
                }).then((auth) => {
                    next(null, auth, session)
                }).catch((err) => {
                    // console.log(err)
                    next('#auth_handler.credentials.invalid2')
                })
            }
        },
        function doUser (auth, session, next) {
            if (auth.user) {
                next(null, auth.user, auth, session)
            } else {
                next('#auth_handler.user.invalid')
            }
        },
        function doApplication (user, auth, session, next) {
            if (session.application) {
                next(null, session.application, user, auth, session)
            } else {
                next('#auth_handler.application.invalid')
            }
        },
        function doValidate (application, user, auth, session, next) {
            if (user.status === 'ACTIVE' || user.status === 'NEW' || user.status === 'REISSUE') {
                if (auth.channel === 'APP') {
                    var device = auth.device
                    if (device && device.deviceId === auth.uuid) {
                        if (device.status === 'ACTIVE') {
                            next(null, org, application, user, auth, session)
                        } else {
                            helper.compare(payload.password, auth.hash, function (err, isMatch) {
                                if (!err && isMatch === true) {
                                    next({code: '06', message: '#auth_handler.device.status.' + device.status, data: {}})
                                } else {
                                    var result = {}
                                    auth.incrementAttempts(user, function () {
                                        if (auth.status === 'BLOCKED') {
                                            result = {code: '06', message: '#auth_handler.auth.status.' + auth.status, data: {}}
                                        } else {
                                            result = {code: '06', message: '#auth_handler.password.invalid', data: {}}
                                        }
                                        next(result)
                                    })
                                }
                            })
                        }
                    } else {
                        next('#auth_handler.auth.device.corrupt')
                    }
                } else {
                    if (user.workshop !== null && user.workshop.status !== 'ACTIVE') {
                        next('#auth_handler.workshop.status.' + user.workshop.status)
                    } else if (user.supplier !== null && user.supplier.status !== 'ACTIVE') {
                        next('#auth_handler.supplier.status.' + user.supplier.status)
                    } else if (user.branch !== null && user.branch.status !== 'ACTIVE') {
                        next('#auth_handler.branch.status.' + user.branch.status)
                    } else {
                        next(null, application, user, auth, session)
                    }
                }
            } else {
                next('#auth_handler.user.status.' + user.status)
            }
        },
        function doHash (application, user, auth, session, next) {
            if (action === 'APP-REG') {
                next(null, {code: '00', message: 'success'})
            }
            if (action === 'OTP-CHECK') {
                next(null, {code: '00', message: 'success'})
            } else {
                helper.compare(payload.password, auth.hash, function (err, isMatch) {
                    if (!err && isMatch === true) {
                        if (auth.status === 'NEW' || auth.status === 'REISSUE' || auth.status === 'BLOCKED') {
                            var result = {code: '06', message: '#auth_handler.auth.status.' + auth.status, data: {}}
                            next(err, result)
                        } else {
                            auth.resetAttempts(auth, function () {
                                session.linkUser(session, user, application, function (err, permissions) {
                                    var result = {
                                        code: '00',
                                        message: 'success',
                                        data: {user: user, permissions: permissions}
                                    }
                                    next(err, result)
                                })
                            })
                        }
                    } else {
                        if (isMatch === false) {
                            auth.incrementAttempts(auth, function () {
                                if (auth.status === 'BLOCKED') {
                                    result = {code: '06', message: '#auth_handler.auth.status.' + auth.status, data: {}}
                                } else {
                                    result = {code: '06', message: '#auth_handler.password.invalid', data: {}}
                                }
                                next(err, result)
                            })
                        } else {
                            auth.incrementAttempts(auth, function () {
                                if (auth.status === 'BLOCKED') {
                                    result = {code: '06', message: '#auth_handler.auth.status.' + auth.status, data: {}}
                                } else {
                                    result = {code: '06', message: '#auth_handler.action.failed', data: {}}
                                }
                                next(err, result)
                            })
                        }
                    }
                })
            }
        }
    ],
    function done (err, result) {
        if (!err && result) {
            callback(null, result)
        } else if (err.code && err.code === '06') {
            callback(null, err)
        } else {
            callback(err)
        }
    })
}
module.exports = handler
