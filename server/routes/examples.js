const express = require('express');
const router = express.Router();

const User = require('./../../db/model/User-model');
const Application = require('./../../db/model/Application-model');

router.get('/all', function (req, res, next) {
    console.log('here we are')
    User.findAll()
        .then(all => {
            console.log(all)
            res.send(all);
        })
});

module.exports = router;
