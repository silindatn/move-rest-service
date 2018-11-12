'use strict';

const express = require('express');
const router = new express.Router();


// routes
router.use('/example', require('./routes/examples'));
router.use(require('./../application/application'));

router.use(function (req, res) {
    res.status(404).end();
});

module.exports = router;
