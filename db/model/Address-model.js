'use strict'

const Sequelize = require('sequelize');
const db = require('../_db.js');
const Branch = require('./Branch-model');
var sequelizeTransforms = require('sequelize-transforms');

const Address = db.define('addresses',{
    id: {type: Sequelize.BIGINT,autoIncrement: true,primaryKey: true},
    streetAddress: {type: Sequelize.STRING,allowNull: false, validate: {notEmpty: true}},
    city: {type: Sequelize.STRING,allowNull: false, validate: {notEmpty: true}},
    province: {type: Sequelize.STRING,allowNull: true},
    postalCode: {type: Sequelize.STRING,allowNull: true}
});

sequelizeTransforms(Address);
// Address.belongsTo(Branch, {as: 'address'});
// BranchSchema.plugin(auditor);
// BranchSchema.plugin(base);
// BranchSchema.index({ NAME: 1}, { unique: true });
module.exports = Address;