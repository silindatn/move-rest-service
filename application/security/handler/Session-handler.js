var async = require('async')
var Application = require('./../../../db/model/Application-model')
var helper = require('../helper/AUTH-helper')
var Language = require('./../../../db/model/Language-model');

module.exports = function (req, res) {
    var data = req.body
    // ------- required for create session----
    var channel = data.channel
    var deviceId = data.deviceId
    var applicationCode = data.application
    console.log('creatig session')
    // --------- end required-----------
    var query = {channel: channel}
    // =============== VALIDATION ==============//
    async.waterfall([
        function doValidations (next) {
            if (!channel) {
                next('#session.channel.missing')
            } else {
                if (channel === 'APP' && !deviceId) {
                    next('#session.device.missing')
                } else {
                    next()
                }
            }
        },
        function doLanguages (next) {
            Language.findAll({
                where: {system_default: true}
            }).then((languages) => {
                next(null, languages);
            }).catch((err) => {
                next(err.message);
            });
        },
        function doChannel (languages, next) {
            query['code'] = applicationCode
            if (channel === 'APP' && deviceId) {
                helper.locateDeviceId(deviceId, function (err, deviceUser) {
                    if (!err && deviceUser) {
                        next(null, 'ACTIVE', languages)
                    } else {
                        next(null, 'INACTIVE', languages)
                    }
                })
            } else {
                next(null, 'ACTIVE', languages)
            }
        },
        function doApplication (status, languages, next) {
            Application.findOne({
                where: {code: applicationCode}
            }).then((application) => {
                next(null, status, application, languages);
            }).catch((err) => {
                next(err.message || '#session.application.invalid');
            })
        },
        function doCreateSession (status, application, languages, next) {
            helper.createSession(channel, deviceId, application, function (err, token) {
                if (!err && token) {
                    next(null, {code: '00', message: 'success', token: token, status: status, languages: languages})
                } else {
                    next(err)
                }
            })
        }
    ],
    function done (err, result) {
        if (!err && result) {
            res.send(result)
        } else {
            res.send({code: '06', message: err})
        }
    })
}
