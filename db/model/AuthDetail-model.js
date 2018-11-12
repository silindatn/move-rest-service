'use strict'

const Sequelize = require('sequelize');
const db = require('../_db.js');
// let Device = require('./sub/Device-model');
// let Auth = require('./sub/Auth-model');
const User = require('./User-model');
// const trackRevisions = require('sequelize-logbook');

const AuthDetail = db.define('authdetails', {
    id: {type: Sequelize.BIGINT,autoIncrement: true,primaryKey: true},
    channel: { type: Sequelize.ENUM, values: ['APP','PORTAL','WEBSERVICE','WEB-API']},
    uuid: {type: Sequelize.STRING,allowNull: false, validate: {notEmpty: true}},
    device: { type: Sequelize.JSON, allowNull: false, validate: {notEmpty: true}},
    hash: {type: Sequelize.STRING,allowNull: false, validate: {notEmpty: true}},
    status: { type: Sequelize.ENUM, values: ['ACTIVE','INACTIVE','BLOCKED','NEW','REGISTRATION','REISSUE','EXPIRED','REGISTERED','NOT_REGISTERED','REMOVED','EXISTS'], defaultValue: 'NEW'},
    expiry_date: {type: Sequelize.DATE,allowNull: true},
    last_access: {type: Sequelize.DATE,allowNull: true},
    login_attemps: {type: Sequelize.INTEGER,defaultValue: 0},
}, {
    setterMethods: {
    },
    defaultScope: {
        include: [
            {model: User, as: 'user'},
            // {model: Auth, as: 'auth_history'}
        ]
    },
});

AuthDetail.prototype.resetAttempts = (auth, callback) => {
    let self = {
        login_attemps: 0,
        last_access: Sequelize.fn('NOW')
    };
    auth.updateAttributes(self);
    callback();
}
AuthDetail.prototype.incrementAttempts = (auth, callback) => {
    let self = {};
    self['login_attemps'] = auth.login_attemps + 1;
    let maxTries = 3;
    let locStatus = 'BLOCKED';
    if (self.login_attemps >= maxTries) {
        self['status'] = locStatus;
    }
    auth.updateAttributes(self);
    callback();
}
// AuthDetail.belongsToMany(Auth, {through: 'auth_history'})
AuthDetail.belongsTo(User, {as: 'user'});
// trackRevisions(AuthDetail);
// AuthDetail.hasPaperTrail();
module.exports = AuthDetail;
