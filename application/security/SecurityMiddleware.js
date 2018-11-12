
var express = require('express');
var async = require('async');
var Session = require('./../../db/model/Session-model');
var Application = require('./../../db/model/Application-model');
var User = require('./../../db/model/User-model');
var serviceHandler = require('./handler/Service-handler');
// var serviceEqHandler    =   require('./handler/ServiceEnquiry-handler');
var router = express.Router();

router.post('/createSession', require('./handler/Session-handler'));
// router.post('/Token',    require('./handler/WepApi-Session-handler'));
// router.post('/endSession',    require('./handler/Cleanup-handler'));
// -----  SERVICE API -------//
router.post('/service', function (req, res) {
    var _session = req.body.session;
    var data = req.body;
    var action = data.action;
    // --------------------ROUTE SERVICES--------------//
    async.waterfall([
        function loadSession (next) {
            Session.findOne({
                where: {id: _session.id}
            }).then((session) => {
                next(null, session)
            }).catch((err) => {
                next('#service.session.invalid');
            })
        },
        function loadApplication (session, next) {
            if (session.application) {
                next(null, session.application, session);
            } else {
                next('#service.session.application.invalid');
            }
        },
    ],
    function done (err, session, apllication) {
        if (!err && session && apllication) {
            serviceHandler.handleAction(session.user, data, session, apllication, res);
        } else {
            res.send({code: '06', message: err});
        }
    });
    // ---------------------- END ENQUIRY--------------//
});
module.exports = router;
