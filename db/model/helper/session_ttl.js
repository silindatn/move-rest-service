let ms = require('ms');

/**
* Exports.
*/

module.exports = exports = ttl;

/**
* Mongoose-TTL Plugin
*
* Provides timespan support for documents.
*
* Options:
*   ttl: the time each doc should live in the db (default 60 seconds)
*   interval: how often the expired doc reaper runs (default 5 mins)
*   reap: enable the expired doc reaper (default true)
*   onReap: callback passed to reaper execution
*
* Example:
*
*    let schema = new Schema({..});
*    schema.plugin(ttl, { ttl: 5000 });
*
*  The ttl option supports the ms module by @guille meaning
*  we can specify ttls with friendlier syntax. Example:
*
*    value     milliseconds
*   ========================
*    '2d'      172800000
*    '1.5h'    5400000
*    '1h'      3600000
*    '1m'      60000
*    '5s'      5000
*    '500ms'   500
*    100       100
*
* The expired document reaper can be disabled by passing `reap: false`.
* Useful when working in multi-core environments when we only want one
* process executing it.
*
*    let schema = new Schema({..});
*    schema.plugin(ttl, { ttl: 5000, reap: false });
*    let Cache = db.model('Cache', schema);
*    if (isMyWorker) Cache.startTTLReaper();
*
*  The reaper can also be stopped.
*
*    Cache.stopTTLReaper();
*
*  Time-to-live is specified at the collection level, however
*  it can also be overridden for a given document.
*
*    let cache = new Cache;
*    cache.ttl = '2m' // lives for two minutes
*    cache.save();
*
*  We can also reset the ttl for a given document to its
*  default plugin state.
*
*    cache.resetTTL();
*
* @param {Schema} schema
* @param {Object} options
*/

function ttl (schema, options) {
    options || (options = {});

    let key = '__ttl'
        , overridden = '__ttlOverride'
        , ttl = options.ttl || 60000
        , interval = options.interval || 60000 * 5
        , reap = false !== options.reap;
        // , onReap = 'function' === typeof options.onReap ? options.onReap : undefined;

    let o = {};
    o[key] = Date;
    schema.add(o);

    schema.index(key, { background: true });

    schema.pre('save', function (next) {
        if (overridden in this) {
        // nothing to do
        } else {
            this[key] = fromNow();
        }
        next();
    });

    /**
 * startTTLReaper
 *
 * Starts reaping expired docs from the db.
 */

    schema.statics.startTTLReaper = function startTTLReaper () {
        if (key in this) {
            return;
        }

        let self = this;
        self[key] = setInterval((function remove () {
            self.processExpiredSessions();
            return remove;
        })(), interval);
    };

    /**
 * stopTTLReaper
 *
 * Stops removing expired docs from the db.
 */

    schema.statics.stopTTLReaper = function stopTTLReapter () {
        clearInterval(this[key]);
        delete this[key];
    };

    /**
 * Listen to Model.init.
 */

    schema.on('init', init);

    /**
 * init
 *
 * Hook into all model queries to include the TTL
 * filter and kick off the expired doc reaper if
 * enabled.
 * @private
 */

    function init (model) {
        if (model.__ttl) {
            return;
        }

        let distinct_ = model.distinct;
        model.distinct = function distinct (field, cond, cb) {
            applyTTL(cond);
            return distinct_.call(model, field, cond, cb);
        };

        'findOne find count'.split(' ').forEach(function (method) {
            let fn = model[method];

            model[method] = function (cond, fields, opts, cb) {
                if (!cond) {
                    cond = {};
                } else if ('function' === typeof cond) {
                    cb = cond;
                    cond = {};
                }

                applyTTL(cond);
                return fn.call(model, cond, fields, opts, cb);
            }
        });

        'where $where'.split(' ').forEach(function (method) {
            let fn = model[method];
            model[method] = function () {
                let query = fn.apply(this, arguments)
                    , cond = {};
                applyTTL(cond);
                return query.find(cond);
            }
        });

        if (reap) {
            model.startTTLReaper();
        }
    }

    /**
 * Getters/setters
 */

    let virt = schema.virtual('ttl');

    virt.get(function () {
        if (this[key]) {
            return this[key];
        }
        this.ttl = ttl;
        return this.ttl;
    });

    virt.set(function (val) {
        if ('reset' === val) {
            return this.resetTTL();
        }
        this[overridden] = arguments.length ? val : ttl;
        return this[key] = fromNow(this[overridden]);
    });

    /**
 * resetTTL
 *
 * Resets this documents ttl to the default specified
 * in the plugin options or plugin default.
 */

    schema.methods.resetTTL = function resetTTL () {
        delete this._doc[key];
        delete this[overridden];
    };

    /**
 * fromNow
 * @private
 */

    function fromNow (val) {
        let v = arguments.length ? val : ttl;
        return new Date(Date.now() + ms(v));
    }

    /**
 * Applies ttl to query conditions.
 * @private
 */
    function applyTTL (cond) {
        if (cond[key]) {
            cond.$and || (cond.$and = []);
            let a = {};
            a[key] = cond[key];
            cond.$and.push(a);
            let b = {};
            b[key] = { $gt: new Date };
            cond.$and.push(b);
            delete cond[key];
        } else {
            cond[key] = { $gt: new Date };
        }
    }
}
