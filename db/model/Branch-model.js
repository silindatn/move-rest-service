'use strict'

const Sequelize = require('sequelize');
const db = require('../_db.js');
const Address = require('./Address-model');
var sequelizeTransforms = require('sequelize-transforms');

const Branch = db.define('branches',{
    id: {type: Sequelize.BIGINT,autoIncrement: true,primaryKey: true},
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

Branch.belongsTo(Address, {as: 'address'});

sequelizeTransforms(Branch);

module.exports = Branch;
