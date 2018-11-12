let express = require('express')
let router = express.Router()
let WorkShop = require('./../../db/model/WorkShop-model');
let Address = require('./../../db/model/Address-model');
let async = require('async')

router.post('/workshop/create', function (req, res) {
    let data = req.body;
    let user = data.user;
    try {
        WorkShop.findOne({
            where: { name: data.workshop.name },
        }).then((workshop_exist) => {
            if (workshop_exist) {
                res.send({code: '06', message: '#workshop.create.name.exist'});
            } else {
                async.waterfall([
                    function createAddress (next) {
                        Address.create(data.workshop.Address).then((address) => {
                            next(null, address);
                        }).catch((err) => {
                            next(err);
                        });
                    },
                    function createWorkShop (address, next) {
                        data.workshop['addressId'] = address.id;
                        data.workshop.Address = address;
                        WorkShop.create(data.workshop).then((workshop) => {
                            next(null, workshop);
                        }).catch((err) => {
                            next(err);
                        });
                    }
                ],
                function done (err, workshop) {
                    if (!err && workshop) {
                        res.send({code: '00', message: 'success', data: workshop})
                    } else {
                        res.send({code: '06', message: err.message || err});
                    }
                });
            }
        });
    } catch (error) {
        res.send({code: '06', message: error.message || error});
    }
})
router.post('/workshop/list_all', function (req, res) {
    let query = req.body.query || {}
    WorkShop.findAll({
        where: query,
    }).then((workshops) => {
        res.send({code: '00', message: 'success', data: workshops})
    }).catch((err) => {
        res.send({code: '06', message: err.message || err})
    });
})
router.post('/workshop/edit', function (req, res) {
    let data = req.body;
    let user = data.user
    let id = data.workshop.id;
    WorkShop.findOne({
        where: { id: id },
    })
        .then(workshop => {
            return workshop.updateAttributes(data.workshop)
        })
        .then(updatedWorkShop => {
            res.send({code: '00', message: 'success', data: updatedWorkShop});
        }).catch((err) => {
            res.send({code: '06', message: err.message || err});
        });
})
router.post('/workshop/address/edit', function (req, res) {
    let data = req.body;
    let user = data.user
    let id = data.workshop.address.id;
    Address.findOne({
        where: { id: id },
    })
        .then(address => {
            return address.updateAttributes(data.workshop.address)
        })
        .then(updatedAddress => {
            res.send({code: '00', message: 'success', data: updatedAddress});
        }).catch((err) => {
            res.send({code: '06', message: err.message || err});
        });
})
module.exports = router
