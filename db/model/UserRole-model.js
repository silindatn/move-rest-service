'use strict'

const Sequelize = require('sequelize');
const db = require('../_db.js');

const UserRole = db.define('userRoles', {
    status: {type: Sequelize.ENUM, values: ['ACTIVE','SUSPENDED'], defaultValue: 'ACTIVE'},
});

module.exports = UserRole;

