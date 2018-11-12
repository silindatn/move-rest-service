'use strict'

const Sequelize = require('sequelize');
const db = require('../_db.js');
const Address = require('./Address-model');
var sequelizeTransforms = require('sequelize-transforms');

const WorkShop = db.define('workshops',{
    id: {type: Sequelize.BIGINT,autoIncrement: true,primaryKey: true},
    account: {type: Sequelize.STRING,allowNull: true},
    email: {type: Sequelize.STRING,allowNull: true},
    name: {type: Sequelize.STRING,unique: true,allowNull: false, validate: {notEmpty: true}},
    telephone: {type: Sequelize.STRING,allowNull: false, validate: {notEmpty: true}},
    fax: {type: Sequelize.STRING,allowNull: true},
    status: {type: Sequelize.ENUM, values: ['ACTIVE','ONHOLD'], defaultValue: 'ACTIVE'}
},
{
    defaultScope: {
        include: [
            {model: Address, as: 'address'}
        ]
    }
});

WorkShop.belongsTo(Address, {as: 'address'});

sequelizeTransforms(WorkShop);

module.exports = WorkShop;
