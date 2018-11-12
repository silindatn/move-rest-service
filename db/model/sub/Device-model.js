'use strict'

const Sequelize = require('sequelize');
const db = require('./../../_db');

const Device = db.define('device',{
    deviceId: { type: Sequelize.STRING,allowNull: false, validate: {notEmpty: true}},
    platform: { type: Sequelize.ENUM, values: ['ANDROID', 'IOS','WINDOWS', 'AMAZON','NONE'], defaultValue: 'NONE'},
    token: { type: Sequelize.STRING, allowNull: true},
    status: {type: Sequelize.ENUM, values: ['ACTIVE','INACTIVE','BLOCKED','NEW','REISSUE','EXPIRED','REGISTRATION'], defaultValue: 'NEW'}
});
module.exports = Device;
