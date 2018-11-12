'use strict'

const Sequelize = require('sequelize');
const db = require('../_db.js');

const ApplicationPermission = db.define('applicationPermissions', {
    status: {type: Sequelize.ENUM, values: ['ACTIVE','SUSPENDED'], defaultValue: 'ACTIVE'},
});

module.exports = ApplicationPermission;

