let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let S = require('string');
let array = require('array');

let base = require('./plugins/BaseModel');
let auditor = require('./plugins/TrailsLogger');

let MessageSchema = new Schema({
    code: { type: String, required: true},
    description: { type: String, required: false, default: ''},
    organizationID: { type: String, required: false},
    message: [ {
        language: {type: Schema.ObjectId, required: true, ref: 'Language'},
        text: { type: String, required: true}
    }]
},{collection: 'MESSAGES'});
MessageSchema.plugin(auditor);
MessageSchema.plugin(base);
MessageSchema.pre('save', function (next) {
    let self = this;
    if (self.code) {
        self.code = S(self.code).collapseWhitespace().s;
        self.code = S(self.code).replaceAll(' ', '.').s;
        self.code = self.code.toLowerCase();
        let langs = array();
        for (i = 0; i < self.message.length; i++) {
            let msg = self.message[i];
            if (langs.has(msg.language)) {
                return next(new Error('messages.language.duplicate'));
            }
            langs.push(msg.language);
        }
        return next();
    } else {
        next(new Error('messages.code.required'));
    }
});
MessageSchema.index({ code: 1, organizationID: 1}, { unique: true });
module.exports = mongoose.model('Messages', MessageSchema);
