'use strict'

const Sequelize = require('sequelize');
const db = require('../_db.js');

// emailObject: {
//     toEmailAddress: {type: Sequelize.STRING,allowNull: true},
//     fromEmailAddress: {type: Sequelize.STRING,allowNull: true},
// },
let Notification = db.define('notifications',{
    id: {type: Sequelize.BIGINT,autoIncrement: true,primaryKey: true},
    msisdn: {type: Sequelize.STRING,allowNull: true},
    type: {type: Sequelize.ENUM, values: ['SMS','IN-APP','EMAIL','PUSH'], defaultValue: 'SMS'},
    status: {type: Sequelize.ENUM, values: ['PENDING','SENT','FAILED','LOCKED'], defaultValue: 'PENDING'},
    message: {type: Sequelize.STRING,allowNull: true},
    subject: {type: Sequelize.STRING,allowNull: true},
    server_ref: {type: Sequelize.STRING,allowNull: true, defaultValue: ''},
    emailObject: {type: Sequelize.JSON, allowNull: true},
    responseCode: {type: Sequelize.STRING,allowNull: true},
    responseMessage: {type: Sequelize.STRING,allowNull: true},
    responseRef: {type: Sequelize.STRING,allowNull: true},
    deviceId: {type: Sequelize.STRING,allowNull: true},
    token: {type: Sequelize.STRING,allowNull: true},
});

module.exports = Notification;
