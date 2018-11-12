
var async = require('async');
var Transaction = require('./../../../db/model/Transaction-model');
var authProcessor = require('./../../processors/AUTH-processor');


function ServiceHandler () {

}
ServiceHandler.prototype.handleAction = function (user, data, session, application, res) {
    async.waterfall([
        function doTransaction (next) {
            Transaction.create({
                channel: application.channel,
                application: application.code,
                sessionId: session.id,
                transaction_type: 'login',
                request: data
            }).then((transaction) => {
                next(null, transaction);
            }).catch((err) => {
                console.log(err.message);
                next('#service.trans.init.failed');
            })
        },
        function handleTransaction (transaction, next) {
            authProcessor.processStep(null, transaction.transaction_type, data, (err, response) => {
                if (!err && response) {
                    transaction.updateAttributes({
                        response_code: response.code,
                        response: response
                    }).then((doc) => {
                        next(null, response);
                    })
                } else {
                    transaction.updateAttributes({
                        response_code: err.code,
                        response: err
                    }).then((doc) => {
                        next(err);
                    })
                }
            })
        },
    ],
    function done (err, result) {
        if (!err && result) {
            res.send(result);
        } else {
            if (err) {
                if (err.data) {
                    res.send({code: '06', message: err.message || '#service.message.empty', data: err.data || {} });
                } else {
                    res.send({code: '06', message: err.message || '#service.message.empty', data: {}, error: err});
                }
            } else {
                res.send({code: '06', message: err.message || '#service.message.empty', data: {}});
            }
        }
    });
}
module.exports = new ServiceHandler();
