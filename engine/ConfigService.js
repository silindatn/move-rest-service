var Config = require('./../db/model/Configuration-model');
var async = require('async');

function ConfigService () {

}

ConfigService.prototype.locate = function (name, callback) {
    Config.findOne({
        where: {name: name}
    }).then((config) => {
        callback(null, {name: config.name, value: config.value})
    }).catch((err) => {
        callback(err.message || '#config.locate.ntf');
    });
}

ConfigService.prototype.locateupdate = function (name,user, callback) {
    Config.findOne({name: name}, function (err, doc) {
        if (!err && doc) {
            if (doc.refCount && doc.refCount >= 1 && user) {
                doc.persist(user, function (err, doc) {
                    if (!err) {
                        callback(null, {name: doc.name, value: doc.value, refcount: doc.refCount})
                    } else {
                        callback('#config.save.' + name + '.error')
                    }
                });
            }
            else {
                callback(null, {name: doc.name, value: doc.value, refcount: -1})
            }
        } else {
            callback('#config.locate.' + name + '.nft');
        }
    });
}
ConfigService.prototype.locateSync = function (name, callback) {
    Config.findOne({
        where: {name: name}
    }).then((config) => {
        callback(null, config)
    }).catch((err) => {
        callback(err.message || '#config.locate.ntf');
    });
}

module.exports = ConfigService;