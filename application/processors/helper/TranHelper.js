
var TransactionHelper = function () {};

TransactionHelper.prototype.processStep = function (endPoint, action, payload, callback) {
    return callback(null, {code: '00', message: 'success', data: {message: 'no default implementation'}});
};

module.exports = exports = TransactionHelper;
