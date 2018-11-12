'use strict';

const express = require('express');
const app = express();
// const { resolve } = require('path');
const db = require('./db');
const server = require('./server');
const morgan = require('morgan');
const fs = require('fs');
var path = require('path')
const bodyParser = require('body-parser');
const chalk = require('chalk');
const UploadService = require('./application/service/Upload.service');
var dj = require('dj-logger');
const auth = require('./engine/middleware/AuthService');
var config = require('./server/logger.config.json');
dj.LoggerFactory.init(config);
var logger = dj.LoggerFactory.get('ALL');
 
app.use(dj.startTransaction(logger,'MEETING-APP','BACKEND-SERVICES', (req) => logger.setParam('user', req.headers.user)));
 
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})
// logging middleware
// app.use(morgan('dev'));
app.use(morgan('combined', {stream: accessLogStream}))
// bodyParser middleware
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(bodyParser.json({limit: '500mb'}))
app.use(bodyParser.urlencoded({extended: false, limit: '500mb'}))

auth.init(app);
// prepend '/api' to URIs
app.use('/api', server);
app.use(express.static('/application/portal/tmp/file.pdf'));
app.get('/application/portal/tmp/file.pdf', function (req, res) {
    res.sendFile(__dirname + '/application/portal/tmp/file.pdf');
})
// server listening!
app.listen(process.env.PORT || 3090, () => {
    console.log(chalk.cyan('Server is listening'), chalk.yellow('http://localhost:3090'));
    UploadService.startServices();
    db.sync({force: false})
        .then(() => {
            console.log(chalk.cyan('Database is running'));
        })
        .catch(err => console.error(err));
});
