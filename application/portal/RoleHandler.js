const express = require('express');
const router = express.Router();
const handler = express();
let bodyParser = require('body-parser').json();
const Role = require('./../../db/model/Role-model');
const RolePermission = require('./../../db/model/RolePermission-model');
const Permission = require('./../../db/model/Permission-model');
let log4js = require('log4js');
let _ = require('lodash');
let async = require('async');
let logger = log4js.getLogger('ROLE-HANDLER');
logger.level = 'debug';

router.post('/create', bodyParser, function (req, res) {
    let data = req.body;
    let user = data.user;
    try {
        Role.findOne({
            where: { name: data.role.name },
        }).then((role_exist) => {
            if (role_exist) {
                res.send({code: '06', message: '#role.create.name.exist'});
            } else {
                async.waterfall([
                    function createRole (next) {
                        Role.create(data.role).then((role) => {
                            next(null, role);
                        }).catch((err) => {
                            next(err);
                        });
                    },
                    function createRolePermission (role, next) {
                        async.forEachOf(data.role.permissions, (permission, index, callback) => {
                            RolePermission.findOne({
                                where: { roleId: role.id, permissionId: permission.id },
                            }).then((rolePermission_exist) => {
                                if (rolePermission_exist) {
                                    callback();
                                } else {
                                    RolePermission.create({roleId: role.id, permissionId: permission.id})
                                        .then((rolePermission) => {
                                            callback();
                                        })
                                        .catch((err) => {
                                            callback();
                                        })
                                }
                            })
                                .catch((err) => {
                                    callback();
                                })
                        }, () => {
                            next(null, role);
                        });
                    }
                ],
                function done (err, role) {
                    if (!err && role) {
                        res.send({code: '00', message: 'success', data: role})
                    } else {
                        res.send({code: '06', message: err.message || err});
                    }
                });
            }
        });
    } catch (error) {
        res.send({code: '06', message: error.message || error});
    }
});
router.post('/list_all', bodyParser, function (req, res) {
    const query = req.body.query || {};
    Role.findAll({
        where: query,
    }).then((roles) => {
        res.send({code: '00', message: 'success', data: roles})
    }).catch((err) => {
        res.send({code: '06', message: err.message || err})
    });
});
router.post('/edit', function (req, res) {
    const data = req.body;
    const user = data.user;
    const id = data.roles._id;
    Role.findOne({
        where: { id: id },
    })
        .then(role => {
            return role.updateAttributes(data.role)
        })
        .then(updatedRole => {
            res.send({code: '00', message: 'success', data: updatedRole});
        }).catch((err) => {
            res.send({code: '06', message: err.message || err});
        });
});
router.post('/updated_role_permission', bodyParser, function (req, res) {
    const data = req.body;
    let role = data.role;
    let admin = data.user;
    RolePermission.findAll({
        where: {roleId: role.id}
    }).then((rolePermissions) => {
        async.forEachOf(role.permissions, (permission, index, cb) => {
            RolePermission.findOne({
                where: { roleId: role.id, permissionId: permission.id },
            }).then((rolePermission_exist) => {
                if (rolePermission_exist) {
                    cb();
                } else {
                    RolePermission.create({roleId: role.id, permissionId: permission.id})
                        .then((rolePermission) => {
                            cb();
                        })
                        .catch((err) => {
                            cb();
                        })
                }
            })
        }, () => {
            async.forEachOf(rolePermissions, (rolePermission, index, _cb) => {
                const found = _.findIndex(role.permissions, {id: rolePermission.permissionId});
                logger.info(found, rolePermission.roleId, rolePermission.permissionId);
                if (found < 0) {
                    RolePermission.destroy({where: {roleId: rolePermission.roleId, permissionId: rolePermission.permissionId}})
                        .then((destroyed) => {
                            logger.info('Destroyed no:  ' + destroyed);
                            _cb();
                        })
                        .catch((err) => {
                            logger.info('Destroyed Error:  ' + err);
                            _cb();
                        })
                } else {
                    _cb();
                }
            }, () => {
                res.send({code: '00', message: 'success'})
            })
        });
    }).catch((err) => {
        res.send({code: '06', message: err.message || err})
    });
});

handler.use('/role', router);
module.exports = handler;
