function DeviceHook () {

}
DeviceHook.prototype.validate = function (did, callback) {
    callback();
};
module.exports = new DeviceHook();
