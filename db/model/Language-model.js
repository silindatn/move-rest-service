'use strict'

const Sequelize = require('sequelize');
const db = require('../_db.js');

const Language = db.define('languages',{
    id: {type: Sequelize.BIGINT,autoIncrement: true,primaryKey: true},
    code: {type: Sequelize.STRING,unique: true,allowNull: false, validate: {notEmpty: true}},
    name: {type: Sequelize.STRING,unique: true,allowNull: false, validate: {notEmpty: true}},
    system_default: {type: Sequelize.BOOLEAN,allowNull: false, validate: {notEmpty: true}}
});

module.exports = Language;
