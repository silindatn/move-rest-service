'use strict'

const Sequelize = require('sequelize');
const db = require('../_db.js');
var sequelizeTransforms = require('sequelize-transforms');

let Configuration = db.define('configurations',{
    id: {type: Sequelize.BIGINT,autoIncrement: true,primaryKey: true},
    name: {type: Sequelize.STRING, uppercase: true,unique: true,allowNull: false, validate: {notEmpty: true}},
    value: {type: Sequelize.JSON,allowNull: false, validate: {notEmpty: true}},
    refCount: {type: Sequelize.BIGINT, defaultValue: 0},
    status: {type: Sequelize.ENUM, values: ['ACTIVE','INACTIVE'], defaultValue: 'ACTIVE'},
});

sequelizeTransforms(Configuration);

module.exports = Configuration;

