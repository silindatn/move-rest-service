
var AuthDetail = require('./../../../db/model/AuthDetail-model');
var Session = require('./../../../db/model/Session-model');
var Device = require('./../../../db/model/sub/Device-model');

function AUTHHelper () {

}
AUTHHelper.prototype.createSession = function (channel, deviceId, application, callback) {
    Session.create({
        channel: channel,
        deviceId: deviceId,
        applicationId: application.id
    }).then((session) => {
        callback(null, session.token)
    }).catch((err) => {
        callback(err.message || '#session.create.error')
    })
}
AUTHHelper.prototype.locateDeviceId = function (did, callback) {
    Device.findOne({
        where: {deviceId: did}
    }).then((device) => {
        return callback(null, device)
    }).catch((err) => {
        return callback(err.message || '#did.ntf')
    })
}
module.exports = new AUTHHelper()
