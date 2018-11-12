'use strict'

const Sequelize = require('sequelize');
const db = require('../_db.js');
var sequelizeTransforms = require('sequelize-transforms');

const Permission = db.define('permissions', {
    id: {type: Sequelize.BIGINT,autoIncrement: true,primaryKey: true},
    code: {type: Sequelize.STRING, uppercase: true,unique: true,allowNull: false, validate: {notEmpty: true}},
    category: {type: Sequelize.STRING, uppercase: true,allowNull: false, validate: {notEmpty: true}},
    type: {type: Sequelize.STRING, uppercase: true,allowNull: false, validate: {notEmpty: true}},
    menu: {type: Sequelize.STRING, uppercase: true,allowNull: false, validate: {notEmpty: true}},
    channel: {type: Sequelize.STRING, uppercase: true,allowNull: false, validate: {notEmpty: true}},
    system: { type: Sequelize.STRING, uppercase: true, enum: ['YES','NO','BOTH'], allowNull: false, default: 'NO'}
});

sequelizeTransforms(Permission);

module.exports = Permission;
