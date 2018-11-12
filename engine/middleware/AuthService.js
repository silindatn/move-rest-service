var express = require('express')
var async = require('async')
var S = require('string')
var User = require('./../../db/model/User-model')
var Session = require('./../../db/model/Session-model')
var helper = require('./../HashService');
var moment = require('moment');
var sanitizer = require('sanitizer')
var engine = exports = module.exports = {}

var openPaths = [ '/service', '/endSession',
    '/createOTP', '/validateOTP', '/send', '/endSession',
    '/user/create'
]
var noSessionPaths = [
    '/createSession',
    'Token',
    '/application/portal/tmp/file.pdf'
]

engine.init = function (server) {
    server.all('*', function (req, res, handle) {
        var path = req.path
        var body = req.body || {}
        async.waterfall([
            function doHeaders (next) {
                res.header('Access-Control-Allow-Credentials', 'true')
                res.header('Access-Control-Allow-Origin', '*')
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
                res.header('Access-Control-Allow-Headers', 'X-Requested-With, content-type, x-access-token')// Authorization
                next()
            },
            function doPath (next) {
                async.parallel({
                    open: function (cb) {
                        var open = false
                        async.forEachOf(openPaths, function (uri, i, _next) {
                            if (S(path).contains(uri)) {
                                open = true
                            }
                            _next()
                        }, function _done () {
                            cb(null, open)
                        })
                    },
                    no_session: function (cb) {
                        var open = false
                        async.forEachOf(noSessionPaths, function (uri, i, _next) {
                            if (S(path).contains(uri)) {
                                open = true
                            }
                            _next()
                        }, function _done () {
                            cb(null, open)
                        })
                    }
                },
                function __done (err, result) {
                    next(err, result.open, result.no_session)
                })
            },
            function doSession (open, no_session, next) {
                if (no_session) {
                    next()
                } else {
                    helper.verify(req.headers['x-access-token'], function (err, token) {
                        if (!err && token) {
                            Session.findOne({
                                where: {token_ref: token}
                            }).then((session) => {
                                try {
                                    const date = new Date();
                                    if (moment(date).isAfter(moment(session.token_expire))) {
                                        console.log(moment(date).isAfter(moment(session.token_expire)), moment(date).format('YYYY-MM-DD HH:mm:ss'), moment(session.token_expire).format('YYYY-MM-DD HH:mm:ss'))
                                        next(new Error('#server.session.expired'))
                                    } else {
                                        // session._modelOptions.setterMethods.updateTTL(1);
                                        body['session'] = session;
                                        if (session.authenticated || open) {
                                            if (session.authenticated) {
                                                if (session.user) {
                                                    body['user'] = session.user
                                                    next()
                                                } else {
                                                    next(new Error('#server.session.user.missing'))
                                                }
                                            } else {
                                                next()
                                            }
                                        } else {
                                            next(new Error('#server.session.unauthorized'))
                                        }
                                    }
                                } catch (e) {
                                    next(new Error('#server.session.token.invalid'))
                                }
                            }).catch((err) => {
                                next(new Error(err.message || '#server.session.token.invalid'))
                            })
                        } else {
                            next(new Error(err.message || '#server.session.token.invalid'))
                        }
                    })
                }
            }
        ],
        function done (err, result) {
            if (!err) {
                if (!body.session) {
                    body['session'] = {channel: body.channel, application: body.application}
                }
                req.body = body;
                handle()
            } else {
                res.json({code: '49', message: err.message, data: {path: sanitizer.sanitize(path)}})// '#server.session.expired'
            }
        })
    })
}
module.exports = engine
