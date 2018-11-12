let mongoose = require('mongoose');
let log4js = require('log4js');
let helper = require('../helper/audit_trails_helper');
let logger = log4js.getLogger('TRAILSLOGGER');
// logger.level = 'debug';
module.exports = function TrailsLogger (schema) {
    schema.pre('save', function (next, done) {
        let self = this;
        logger.info(done);
        helper.createLogger(schema.options.collection, self,(self.isNew) ? 'CREATE' : 'UPDATE', function (err, change) {
            if (!err && change) {
                self.lastChange = change._id;
                next();
            } else {
                next(new Error(err));
            }
        });
    });
    schema.pre('update', function (next) {
        let self = this;
        helper.createLogger(schema.options.collection, self,'UPDATE', function (err, change) {
            if (!err && change) {
                self.lastChange = change._id;
                next();
            } else {
                next(new Error(err));
            }
        });
    });
    schema.pre('remove', function (next) {
        let self = this;
        helper.createLogger(schema.options.collection, self,'DELETE', function (err, change) {
            if (!err && change) {
                self.lastChange = change._id;
                next();
            } else {
                next(new Error(err));
            }
        });
    });

    schema.methods.persist = function () {
        let self = this;
        let args = Array.prototype.slice.call(arguments, 0);
        let callback = args.pop();
        let user = args.shift();
        if (user) {
            self.bindUser(user);
            self.save(function (err, doc) {
                if (err) {
                    helper.failedLogger(schema.options.collection, self.lastChange,err, function () {
                        return callback(err, doc);
                    })
                } else {
                    return callback(err, doc);
                }
            });
        } else {
            return callback(new Error('#model.create.user.required'));
        }
    };

    schema.methods.delete = schema['remove'];
    schema.methods.remove = function () {
        let self = this;
        let args = Array.prototype.slice.call(arguments, 0);
        let user = args.shift();
        let callback = args.pop();
        let conditions = args.shift();
        if (!user) {
            throw new Error('#model.remove.user.require.' + self.modelName());
        }
        if (conditions && conditions.override && conditions.override === true) {
            try
            {
                mongoose.model(self.modelName(), schema).findByIdAndRemove(self._id,function (err, doc) {
                    return callback(err, doc);
                });
            } catch (e)
            {
                return callback(e);
            }

        } else {
            self.deleted = true;
            self.status = 'DELETED';
            self.persist(user, function (err, doc) {
                if (callback) {
                    return callback(err, doc);
                }
            });
        }
    }
};
