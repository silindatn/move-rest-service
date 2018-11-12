'use strict'

const Sequelize = require('sequelize');
const db = require('../_db.js');
const Permission = require('./Permission-model');
const ApplicationPermission = require('./ApplicationPermission-model');
var sequelizeTransforms = require('sequelize-transforms');

const Application = db.define('applications', {
    id: {type: Sequelize.BIGINT,autoIncrement: true,primaryKey: true},
    code: {type: Sequelize.STRING, uppercase: true,unique: true,allowNull: false, validate: {notEmpty: true}},
    name: {type: Sequelize.STRING, uppercase: true,unique: true,allowNull: false, validate: {notEmpty: true}},
    version: {type: Sequelize.STRING,allowNull: true},
    description: {type: Sequelize.STRING, uppercase: true,allowNull: true},
    channel: {type: Sequelize.STRING, uppercase: true,allowNull: false, validate: {notEmpty: true}},
    status: {type: Sequelize.ENUM, values: ['ACTIVE','SUSPENDED'], defaultValue: 'ACTIVE'},
    public_key: {type: Sequelize.STRING, uppercase: true,allowNull: true},
    private_key: {type: Sequelize.STRING, uppercase: true,allowNull: true}
},
{
    defaultScope: {
        include: [
            {model: Permission, as: 'permissions'}
        ]
    }
});
Application.belongsToMany(Permission, {through: ApplicationPermission});

sequelizeTransforms(Application);

module.exports = Application;

