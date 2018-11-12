'use strict'

const Sequelize = require('sequelize');
const db = require('../_db.js');

const User = db.define('users', {
    uuid: {type: Sequelize.UUID, primaryKey: true },
    msisdn: {type: Sequelize.STRING,unique: true,allowNull: false, validate: {notEmpty: true}},
    username: {type: Sequelize.STRING,unique: true,allowNull: false, validate: {notEmpty: true}},
    firstName: {type: Sequelize.STRING,allowNull: false, validate: {notEmpty: true}},
    lastName: {type: Sequelize.STRING,allowNull: false, validate: {notEmpty: true}},
    status: {String, enum: ['ACTIVE','INACTIVE','BLOCKED','NEW','REGISTRATION','REISSUE','EXPIRED','REGISTERED','NOT_REGISTERED','REMOVED','EXISTS']},
    roles: [{type: Schema.Types.ObjectId, ref: 'Role'}],
    language: {type: Schema.Types.ObjectId, ref: 'Language'},
    branch: {type: Schema.Types.ObjectId, ref: 'Branch'},
    email: {type: Sequelize.STRING,unique: true,allowNull: false, validate: {notEmpty: true,isEmail: true}},
}, {
    getterMethods: {
        fullName: function () {
            const first = this.firstName[0].toUpperCase() + this.firstName.slice(1, this.firstName.length);
            const last = this.lastName[0].toUpperCase() + this.lastName.slice(1, this.lastName.length);
            return first + ' ' + last;
        }
    }
});

// Methods Sequelize v4
User.prototype.example = function () {
    return 'Example instance method';
}

module.exports = User;
