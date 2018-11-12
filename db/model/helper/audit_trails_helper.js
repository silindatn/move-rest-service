let helper = module.exports = {};
let Changes = null;

helper.createLogger = function (logModel, model, type, callback) {
    if (logModel === 'PARTS_MASTER') {
        Changes = require('../Parts_Change_Log-model');
    } else {
        Changes = require('../Changes-model');
    }
    if (type === 'CREATE') {
        create(logModel, model, callback);
    } else if (type === 'UPDATE') {
        update(logModel, model, callback);
    } else {
        remove(logModel, model, callback);
    }
};
helper.failedLogger = function (logModel,change,failure_reason, callback) {
    if (logModel === 'PARTS_MASTER') {
        Changes = require('../Parts_Change_Log-model');
    } else {
        Changes = require('../Changes-model');
    }
    Changes.findOne({_id: change}, function (err, doc) {
        if (doc) {
            doc.status = 'FAILED';
            doc.failure_reason = failure_reason;
            doc.save(function () {
                return callback(null, null);
            });
        } else {
            return callback(null, null);
        }
    });
};
let create = function (logModel, self, callback) {
    let changes = new Changes();
    changes.model = logModel || self.modelName();
    changes.typeOfChange = 'CREATE';
    changes.newObject = self;
    changes.oldObject = null;
    changes.dateOfChange = Date.now();
    changes.createdBy = self.CREATED_BY || self.createdBy;
    changes.updatedBy = self.UPDATED_BY || self.updatedBy;
    changes.save(function (err, change) {
        return callback(err, change);
    });
};
let update = function (logModel, self, callback) {
    let changes = new Changes();
    changes.model = logModel || self.model.modelName || self.modelName();
    changes.typeOfChange = 'UPDATE';
    changes.newObject = self;
    changes.dateOfChange = Date.now();
    changes.createdBy = self.CREATED_BY || self.createdBy;
    changes.updatedBy = self.UPDATED_BY || self.updatedBy;
    self.findOne({_id: self._id}, function (err, doc) {
        if (!err && doc) {
            changes.oldObject = doc;
            changes.save(function (err, change) {
                return callback(err, change);
            });
        } else {
            return callback('Invalid Update');
        }
    })

};
let remove = function (logModel, self, callback) {
    let changes = new Changes();
    changes.model = logModel || self.model.modelName || self.modelName();
    changes.typeOfChange = 'DELETE';
    changes.newObject = null;
    changes.oldObject = self;
    changes.dateOfChange = Date.now();
    changes.createdBy = self.CREATED_BY || self.createdBy;
    changes.updatedBy = self.UPDATED_BY || self.updatedBy;
    changes.save(function (err, change) {
        return callback(err, change);
    });
};
