'use strict'

const Sequelize = require('sequelize');
const db = require('../_db.js');
let log4js = require('log4js');
let logger = log4js.getLogger('SESSIONS');
logger.level = 'debug';
var randomize = require('randomatic');
let async = require('async');
let helper = require('./../../engine/HashService');
let User = require('./User-model');
let Application = require('./Application-model');
let Language = require('./Language-model');
let Permission = require('./Permission-model');
let moment = require('moment');
let TTL = '480m';

const UserSession = db.define('usersessions', {
    id: {type: Sequelize.BIGINT,autoIncrement: true,primaryKey: true},
    token: {type: Sequelize.STRING},
    token_ref: {type: Sequelize.STRING, unique: true},
    startTime: {type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW')},
    lastAccess: {type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW')},
    deviceId: {type: Sequelize.STRING,allowNull: true},
    authenticated: {type: Sequelize.BOOLEAN,allowNull: true, defaultValue: false},
    channel: {type: Sequelize.ENUM, values: ['APP','PORTAL','WEBSERVICE','WEB-API'], allowNull: false, validate: {notEmpty: true}},
    // permissions: [{type: Sequelize.STRING,allowNull: true}],
    // session_actions: [{
    //     action_date: {type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW')},
    //     action: {type: Sequelize.STRING,allowNull: true},
    // }],
    token_expire: {type: Sequelize.DATE, defaultValue: moment(new Date()).add(8, 'hours')}
    // transaction: {type: Schema.ObjectId, required: false, ref: 'Transaction'},
},
{
    setterMethods: {
    },
    getterMethods: {
    },
    defaultScope: {
        include: [
            {model: User, as: 'user'},
            {model: Language, as: 'language'},
            {model: Application, as: 'application'}
        ]
    }
});
UserSession.prototype.validateUser = (user, callback) => {
    User.findOne({where: {id: user.id}}).then((userDoc) => {
        if (userDoc.id !== undefined) {
            return callback(null);
        } else {
            return callback('user.ntf');
        }
    }).catch((err) => {
        return callback(err.message || arr || 'user.ntf');
    })
}
UserSession.prototype.updateTTL = (session) => {
    let self = {
        lastAccess: getNextTick()
    };
    session.updateAttributes(self);
}
UserSession.prototype.linkUser = (session, user,application, callback) => {
    let self = {};
    session.validateUser(user, function (err) {
        if (err === null) {
            session.getUserRoles(session, user, application, function (err, permissions) {
                if (err === null) {
                    self['permissions'] = permissions;
                    self['userId'] = user.id;
                    self['applicationId'] = application.id;
                    self['authenticated'] = true;
                    session.updateAttributes(self);
                    return callback(err, permissions);
                } else {
                    return callback(err);
                }
            });
        } else {
            if (callback) {
                return callback(err);
            }
        }
    });
}
// UserSession.prototype.pushAction(action, callback) {
//     let self = this;
//     let sessions = this.session_actions;
//     sessions.push({action_date: Sequelize.fn('NOW'), action: action});
//     self.setDataValue('session_actions', sessions);
//     callback(null, self);
// }
UserSession.prototype.getUserRoles = (session, user, application, callback) => {
    let permissions = [];
    if (user.roles && user.roles.length > 0) {
        async.eachSeries(user.roles, function iterator (role, next) {
            let common_persm = [];
            let app_perms = [];
            async.eachSeries(application.permissions, function iterator (p, cb) {
                app_perms.push(p.id.toString());
                cb();
            }, function _done () {
                async.eachSeries(role.permissions, function iterator (pp, _cb) {
                    if (app_perms.indexOf(pp.id.toString()) >= 0) {
                        common_persm.push(pp.id);
                    }
                    _cb();
                }, function __done () {
                    let query = {id: common_persm,channel: application.channel};
                    Permission.findAll({
                        where: query
                    }).then((perms) => {
                        async.eachSeries(perms, function iterator (x, d) {
                            permissions.push(x);
                            d();
                        }, function f () {
                            next();
                        });
                    })
                });
            });
        }, function done () {
            if (permissions.length < 1) {
                return callback('#login.permissions.invalid');
            } else {
                return callback(null, permissions);
            }
        });
    } else {
        return callback('#login.roles.invalid');
    }
}
// UserSession.belongsToMany()
UserSession.belongsTo(User);
UserSession.belongsTo(Language);
UserSession.belongsTo(Application);
// UserSe/ssion.
// SessionSchema.plugin(ttl, { ttl: TTL, interval: '30000',reap: true});
// SessionSchema.virtual('isAuthenticated').get(function () {
//     return (this.user && this.authenticated);
// });
// SessionSchema.virtual('hasPermission').get(function (currentPermission) {
//     let self = this;
//     if (!self.permissions) {
//         return (false);
//     }
//     self.permissions.forEach(function (permission) {
//         if (permission === currentPermission) {
//             return (true);
//         }
//     });
//     return (false);
// });
UserSession.beforeCreate('create', (data) => {
    if (data.isNewRecord) {
        let date = new Date();
        let expire = moment(date).add(8, 'hours');
        data.token_ref = date.getFullYear().toString() + (date.getMonth() + 1).toString() + date.getDate().toString() + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString() + date.getMilliseconds() + randomize('Aa0', 15);
        helper.createToken(data.token_ref, function (err, token) {
            if (!err && token) {
                data.token = token;
                data.token_expire = expire;
            } else {
                data.token = token;
                data.token_expire = expire;
            }
        })
    }
})

let getNextTick = function () {
    let nextTick = new Date();
    nextTick.setMinutes(nextTick.getMinutes() + TTL);
    return (nextTick);
};
// UserSession.hasPaperTrail();
module.exports = UserSession;
