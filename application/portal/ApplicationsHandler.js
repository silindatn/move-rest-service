let express = require('express');
let router = express.Router();
let handler = express();
let bodyParser = require('body-parser').json();
let Application = require('./../../db/model/Application-model');
let ApplicationPermission = require('./../../db/model/ApplicationPermission-model');
let Permission = require('./../../db/model/Permission-model');
let _ = require('lodash');
let log4js = require('log4js');
let async = require('async');
let logger = log4js.getLogger('APPLICATIONHANDLER');
// let _ = require('lodash');
logger.level = 'debug';

router.post('/create', bodyParser, function (req, res) {
    let data = req.body;
    let user = data.user;
    try {
        Application.findOne({
            where: { name: data.application.name, code: data.application.code },
        }).then((application_exist) =>
        {
            if (application_exist) {
                res.send({code: '06', message: '#application.create.name,code.exist'});
            } else {
                async.waterfall([
                    function createApplication (next) {
                        Application.create(data.application).then((application) => {
                            next(null, application);
                        }).catch((err) => {
                            next(err);
                        });
                    },
                    function createApplicationPermission (application, next) {
                        async.forEachOf(data.application.permissions, (permission, index, callback) => {
                            ApplicationPermission.findOne({
                                where: { applicationId: application.id, permissionId: permission.id },
                            }).then((applicationPermission_exist) => {
                                if (applicationPermission_exist) {
                                    callback();
                                } else {
                                    ApplicationPermission.create({applicationId: application.id, permissionId: permission.id})
                                        .then((applicationPermission) => {
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
                            next(null, application);
                        });
                    }
                ],
                function done (err, application) {
                    if (!err && application) {
                        res.send({code: '00', message: 'success', data: application})
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
    Application.findAll({
        where: query,
    }).then((applications) => {
        res.send({code: '00', message: 'success', data: applications})
    }).catch((err) => {
        res.send({code: '06', message: err.message || err})
    });
});
router.post('/edit', function (req, res) {
    const data = req.body;
    const user = data.user;
    const id = data.applications._id;
    Application.findOne({
        where: { id: id },
    })
        .then(application => {
            return application.updateAttributes(data.applications)
        })
        .then(updatedApplication => {
            res.send({code: '00', message: 'success', data: updatedApplication});
        }).catch((err) => {
            res.send({code: '06', message: err.message || err});
        });
});
router.post('/updated_application_permission', bodyParser, function (req, res) {
    const data = req.body;
    let application = data.applications;
    let admin = data.user;
    ApplicationPermission.findAll({
        where: {applicationId: application.id}
    }).then((applicationPermissions) =>
    {
        async.forEachOf(application.permissions, (permission, index, cb) => {
            ApplicationPermission.findOne({
                where: { applicationId: application.id, permissionId: permission.id },
            }).then((applicationPermission_exist) => {
                if (applicationPermission_exist) {
                    cb();
                } else {
                    ApplicationPermission.create({applicationId: application.id, permissionId: permission.id})
                        .then((applicationPermission) => {
                            cb();
                        })
                        .catch((err) => {
                            cb();
                        })
                }
            })
        }, () => {
            async.forEachOf(applicationPermissions, (applicationPermission, index, _cb) => {
                const found = _.findIndex(application.permissions, {id: applicationPermission.permissionId});
                logger.info(found, applicationPermission.applicationId, applicationPermission.permissionId);
                if (found < 0) {
                    ApplicationPermission.destroy({where: {applicationId: applicationPermission.applicationId, permissionId: applicationPermission.permissionId}})
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
handler.use('/application', router);
module.exports = handler;
