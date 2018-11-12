'use strict'

const Sequelize = require('sequelize');
const db = require('../_db.js');
const Branch = require('./Branch-model');
const WorkShop = require('./WorkShop-model');
const Supplier = require('./Supplier-model');
const User = require('./User-model');
var sequelizeTransforms = require('sequelize-transforms');
var randomize = require('randomatic');


const Order = db.define('orders', {
    id: {type: Sequelize.BIGINT,autoIncrement: true,primaryKey: true},
    order_no: {type: Sequelize.STRING, unique: true,allowNull: true},
    quoteNumber: {type: Sequelize.STRING, unique: true,allowNull: false, validate: {notEmpty: true}},
    quoteValue: {type: Sequelize.STRING,allowNull: false, validate: {notEmpty: true}},
    availableCredit: {type: Sequelize.STRING,allowNull: false, validate: {notEmpty: true}},
    approvedDate: {type: Sequelize.DATE,allowNull: true},
    purchaseId: {type: Sequelize.STRING,allowNull: true},
    workshopApprovedDate: {type: Sequelize.DATE,allowNull: true},
    quoteId: {type: Sequelize.STRING,allowNull: true},
    invoiceId: {type: Sequelize.STRING,allowNull: true},
    status: {type: Sequelize.ENUM, values: ['PENDING','APPROVED','REJECTED', 'ONHOLD', 'PRE-APPROVED', 'UNPAID', 'PAID'], defaultValue: 'PRE-APPROVED'},
}, {
    getterMethods: {
    },
    defaultScope: {
        include: [
            {model: Branch, as: 'branch'},
            {model: WorkShop, as: 'workshop'},
            {model: Supplier, as: 'supplier'},
            {model: User, as: 'approved'},
            {model: User, as: 'requested'},
            {model: User, as: 'workshopApproved'}
        ]
    }
});
Order.belongsTo(Branch, {as: 'branch'});
Order.belongsTo(Supplier, {as: 'supplier'});
Order.belongsTo(WorkShop, {as: 'workshop'});
Order.belongsTo(User, {as: 'approved'});
Order.belongsTo(User, {as: 'workshopApproved'});
Order.belongsTo(User, {as: 'requested'});
// Methods Sequelize v4

Order.beforeCreate('create', (data) => {
    if (data.isNewRecord) {
        let date = new Date();
        data.order_no = date.getFullYear().toString() + (date.getMonth() + 1).toString() + date.getDate().toString() + '=' + randomize('Aa0', 10);
    }
})
// User.hasPaperTrail();
sequelizeTransforms(Order);
module.exports = Order;
