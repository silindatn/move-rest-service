'use strict'

const Sequelize = require('sequelize');
const db = require('../_db.js');
const UserSession = require('./Session-model');
var SequelizeTokenify = require('sequelize-tokenify');

let Transaction = db.define('transactionLogs',{
    id: {type: Sequelize.BIGINT,autoIncrement: true,primaryKey: true},
    server_ref: {type: Sequelize.STRING, uppercase: true, unique: true,allowNull: true},
    transaction_type: {type: Sequelize.STRING, uppercase: true,allowNull: false, validate: {notEmpty: true}},
    status: { type: Sequelize.ENUM, values: ['PROCESSING', 'PENDING','FAILED', 'SUCCESS','ERROR','STEP_TIMEOUT', 'PROCESS_TIMEOUT'], defaultValue: 'PROCESSING'},
    channel: {type: Sequelize.ENUM, values: ['APP','PORTAL','WEBSERVICE','WEB-API'], allowNull: false, validate: {notEmpty: true}},
    application: {type: Sequelize.STRING, uppercase: true,allowNull: true},
    response_code: {type: Sequelize.STRING, uppercase: true,allowNull: true},
    response: {type: Sequelize.JSON, allowNull: true},
    request: {type: Sequelize.JSON, allowNull: true},
    date_time: {type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
},
{
    defaultScope: {
        include: [
            {model: UserSession, as: 'session'}
        ]
    }
});
SequelizeTokenify.tokenify(Transaction, {
    field: 'server_ref'
});

Transaction.belongsTo(UserSession, {as: 'session'});

module.exports = Transaction;
