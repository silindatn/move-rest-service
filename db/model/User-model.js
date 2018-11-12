'use strict'

const Sequelize = require('sequelize');
const db = require('../_db.js');
const Branch = require('./Branch-model');
const WorkShop = require('./WorkShop-model');
const Supplier = require('./Supplier-model');
const Language = require('./Language-model');
const Role = require('./Role-model');
const UserRole = require('./UserRole-model');
var sequelizeTransforms = require('sequelize-transforms');


const User = db.define('users', {
    id: {type: Sequelize.BIGINT,autoIncrement: true,primaryKey: true},
    msisdn: {type: Sequelize.STRING, uppercase: true, unique: true,allowNull: false, validate: {notEmpty: true}},
    username: {type: Sequelize.STRING,unique: true,allowNull: false, validate: {notEmpty: true}},
    firstName: {type: Sequelize.STRING, uppercase: true,allowNull: false, validate: {notEmpty: true}},
    lastName: {type: Sequelize.STRING, uppercase: true,allowNull: false, validate: {notEmpty: true}},
    status: {type: Sequelize.ENUM, values: ['ACTIVE','INACTIVE','BLOCKED','NEW','REGISTRATION','REISSUE','EXPIRED','REGISTERED','NOT_REGISTERED','REMOVED','EXISTS'], defaultValue: 'ACTIVE'},
    email: {type: Sequelize.STRING,unique: true,allowNull: false, validate: {notEmpty: true,isEmail: true}},
}, {
    getterMethods: {
        fullName: function () {
            const first = this.firstName[0].toUpperCase() + this.firstName.slice(1, this.firstName.length).toLowerCase();
            const last = this.lastName[0].toUpperCase() + this.lastName.slice(1, this.lastName.length).toLowerCase();
            return first + ' ' + last;
        }
    },
    defaultScope: {
        include: [
            {model: Branch, as: 'branch'},
            {model: WorkShop, as: 'workshop'},
            {model: Supplier, as: 'supplier'},
            {model: Language, as: 'language'},
            {model: Role, as: 'roles'}
        ]
    }
});
User.belongsTo(Branch, {as: 'branch'});
User.belongsTo(Supplier, {as: 'supplier'});
User.belongsTo(WorkShop, {as: 'workshop'});
User.belongsTo(Language, {as: 'language'});
User.belongsToMany(Role, {through: UserRole});
// Methods Sequelize v4
User.prototype.example = function () {
    return 'Example instance method';
}

// User.hasPaperTrail();
sequelizeTransforms(User);
module.exports = User;
