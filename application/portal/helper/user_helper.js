
var User = require('./../../../db/model/User-model');
var UserRole = require('./../../../db/model/UserRole-model');
let async = require('async');
var helper = exports = module.exports = {}

helper.validateCreateRequest = function (payload, callback) {
    if (!payload.msisdn) {
        return callback('user.create.msisdn.required')
    } else if (!payload.firstName) {
        return callback('user.create.firstname.required')
    } else if (!payload.lastName) {
        return callback('user.create.lastname.required')
    } else {
        callback(null);
    }
}
helper.createUser = function (data, admin, callback) {
    User.findOne({
        where: { msisdn: data.msisdn},
    }).then((user_exist) => {
        if (user_exist) {
            callback('user.create.msisdn.exist');
        } else {
            User.create(data)
                .then((user) => {
                    async.forEachOf(data.roles, (role, index, cb) => {
                        UserRole.findOne({
                            where: { userId: user.id, roleId: role.id },
                        }).then((userRole_exist) => {
                            if (userRole_exist) {
                                cb();
                            } else {
                                UserRole.create({userId: user.id, roleId: role.id})
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
                        callback(null, user);
                    });
                })
                .catch((err) => {
                    callback(err);
                })
        }
    })
}
module.exports = helper
