'use strict';

const Sequelize = require('sequelize');
const sequelizeTrail = require('sequelize-paper-trail');
// var db = require("mongoose-sql");
var e = process.environment;

// Create connection: note default environment variables
// returns a Knex instance
// db.connect({
//     client: "pg",
//     connection: {
//       host: "127.0.0.1",
//       user: "moveapp",
//       password: "15042011",
//       database: "MEETING-APP"
//     }
// });
const dbName = 'MOVE-APP';	// TODO: CHANGE dbName
const url = process.env.DATABASE_URL || `postgres://moveapp:15042011@localhost:5432/${dbName}`;

const db = new Sequelize(url, {
    logging: false,
    operatorsAliases: false
});
// var PaperTrail = sequelizeTrail(db, {});
// PaperTrail.defineModels();

module.exports = db;
