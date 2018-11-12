'use strict'

const Sequelize = require('sequelize');
const db = require('../_db.js');
const Permission = require('./Permission-model');
const RolePermission = require('./RolePermission-model');
var sequelizeTransforms = require('sequelize-transforms');

const Role = db.define('roles',{
    id: {type: Sequelize.BIGINT,autoIncrement: true,primaryKey: true},
    name: {type: Sequelize.STRING, uppercase: true,unique: true,allowNull: false, validate: {notEmpty: true}},
    description: {type: Sequelize.STRING, uppercase: true,allowNull: true}
},
{
    defaultScope: {
        include: [
            {model: Permission, as: 'permissions'}
        ]
    }
});
Role.belongsToMany(Permission, {through: RolePermission});

sequelizeTransforms(Role);

module.exports = Role;
