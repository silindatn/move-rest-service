let mongoose = require('mongoose');
let async = require('async');
let ModelState = require('../types/ModelState');
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;


module.exports = function UpperCaseName (schema, options) {
    let fields = [
        {STATUS: {type: ModelState, default: 'ACTIVE'}},
        {CREATE_DATE: {type: Date, default: new Date()}},
        {UPDATED_DATE: {type: Date, default: new Date()}},
        {CREATED_BY: {type: ObjectId, required: true, ref: 'User'}},
        {UPDATED_BY: {type: ObjectId, required: false, ref: 'User'}},
    ];
    for (i = 0; i < fields.length; i++) {
        schema.add(fields[i]);
    }
    let currentModel;
    schema.on('init', init);
    function init (model) {
        currentModel = model;
    }
    schema.methods.modelName = function () {
        return (currentModel.modelName);
    };
    schema.methods.find = function (options, callback) {
        currentModel.find(options, function (err, data) {
            return callback(err, data);
        });
    };
    schema.methods.findOne = function (options, callback) {
        currentModel.findOne(options, function (err, data) {
            return callback(err, data);
        });
    };
    schema.methods.bindUser = function (user) {
        let self = this;
        if (user && user !== undefined && user._id) {
            self.UPDATED_BY = user._id;
            if (self.isNew || self.CREATED_BY === undefined) {
                self.CREATED_BY = user._id;
            }
        } else {
            throw new Error('#persist.user.' + self.modelName() + '.invalid');
        }
    };
    if (options && options.duplicate) {
        schema.pre('save', function (next) {
            let self = this;
            if (self.isNew) {
                let errors = [];
                let msg = '#' + self.modelName().toLowerCase() + '.create.exist.';
                async.eachSeries(options.duplicate,function iterator (param, callback) {
                    let options = {};
                    options[param] = self[param];
                    self.findOne(options, function (err, doc) {
                        if (!err && doc) {
                            errors.push(msg + param);
                        }
                        callback();
                    });
                },function done () {
                    if (errors.length > 0) {
                        return next(new Error(errors[0]));
                    } else {
                        return next();
                    }
                });
            } else {
                self.updated = Date.now();
                return next();
            }
        });
    }
    schema.pre('find', function (next) {
        let self = this;
        deletionHook(self, function () {
            return next();
        });
    });
    schema.pre('findOne', function (next) {
        let self = this;
        deletionHook(self, function () {
            return next();
        });
    });
    let deletionHook = function (self, callback) {
        let isOverride = (self._conditions['override'] && self._conditions['override'] === true);
        async.waterfall([
            function _override (next) {
                if (isOverride === true) {
                    self._conditions['override'] = null;
                } else {
                    self._conditions['status'] = {$ne: 'DELETED'};
                }
                next();
            }
        ],
        function done () {
            callback();
        });
    }
};
