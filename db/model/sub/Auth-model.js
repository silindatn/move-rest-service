'use strict'

const Sequelize = require('sequelize');
const db = require('./../../_db');

const AuthDetail = db.define('authHistory',{
    previousHash: { type: Sequelize.STRING,allowNull: true },
    change_date: { type: Sequelize.STRING,allowNull: true },
    reason: { type: Sequelize.STRING,allowNull: true },
    channel: { type: Sequelize.STRING,allowNull: true },
    status: { type: Sequelize.STRING,allowNull: true},
    device: { type: Sequelize.JSON, defaultValue: {} },
});
module.exports = AuthDetail;
