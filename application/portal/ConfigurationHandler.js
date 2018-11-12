var Configuration = require('./../../db/model/Configuration-model');
var express = require('express');
var router = express.Router();

router.post('/configuration/create', function (req, res) {
    var data = req.body;
    var user = data.user;
    try {
        Configuration.findOne({
            where: { name: data.configuration.name },
        }).then((configuration_exist) => {
            if (configuration_exist) {
                res.send({code: '06', message: '#configuration.create.name,code.exist'});
            } else {
                Configuration.create(data.configuration).then((configuration) => {
                    res.send({code: '00', message: 'success', data: configuration});
                }).catch((err) => {
                    res.send({code: '06', message: err.message || err});
                });
            }  
        });
    } catch (error) {
        res.send({code: '06', message: error.message || error});
    }
});
router.post('/configuration/list', function (req, res) {
    let query = req.body.query || {}
    Configuration.findAll({
        where: query
    }).then((configurations) => {
        res.send({code: '00', message: 'success', data: configurations})
    }).catch((err) => {
        res.send({code: '06', message: err.message || err})
    });
});
router.post('/configuration/edit', function (req, res) {
    var data = req.body;
    var user = data.user;
    var id = data.configuration.id;

    Configuration.findOne({
        where: { id: id },
    })
        .then(configuration => {
            return configuration.updateAttributes(data.configuration)
        })
        .then(updatedConfiguration => {
            res.send({code: '00', message: 'success', data: updatedConfiguration});
        }).catch((err) => {
            res.send({code: '06', message: err.message || err});
        });
});
module.exports = router;
