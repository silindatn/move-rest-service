'use strict'

const Sequelize = require('sequelize');
const db = require('../_db.js');

const RolePermission = db.define('rolePermissions', {
    status: {type: Sequelize.ENUM, values: ['ACTIVE','SUSPENDED'], defaultValue: 'ACTIVE'},
});

module.exports = RolePermission;

