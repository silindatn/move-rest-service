let express = require('express')
let router = express.Router()
let Supplier = require('./../../db/model/Supplier-model');
let Address = require('./../../db/model/Address-model');
let async = require('async')

router.post('/supplier/create', function (req, res) {
    let data = req.body;
    let user = data.user;
    try {
        Supplier.findOne({
            where: { name: data.supplier.name },
        }).then((supplier_exist) => {
            if (supplier_exist) {
                res.send({code: '06', message: '#supplier.create.name.exist'});
            } else {
                async.waterfall([
                    function createAddress (next) {
                        Address.create(data.supplier.Address).then((address) => {
                            next(null, address);
                        }).catch((err) => {
                            next(err);
                        });
                    },
                    function createSupplier (address, next) {
                        data.supplier['addressId'] = address.id;
                        data.supplier.Address = address;
                        Supplier.create(data.supplier).then((supplier) => {
                            next(null, supplier);
                        }).catch((err) => {
                            next(err);
                        });
                    }
                ],
                function done (err, supplier) {
                    if (!err && supplier) {
                        res.send({code: '00', message: 'success', data: supplier})
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
router.post('/supplier/list_all', function (req, res) {
    let query = req.body.query || {}
    Supplier.findAll({
        where: query,
    }).then((suppliers) => {
        res.send({code: '00', message: 'success', data: suppliers})
    }).catch((err) => {
        res.send({code: '06', message: err.message || err})
    });
})
router.post('/supplier/edit', function (req, res) {
    let data = req.body;
    let user = data.user
    let id = data.supplier.id;
    Supplier.findOne({
        where: { id: id },
    })
        .then(supplier => {
            return supplier.updateAttributes(data.supplier)
        })
        .then(updatedSupplier => {
            res.send({code: '00', message: 'success', data: updatedSupplier});
        }).catch((err) => {
            res.send({code: '06', message: err.message || err});
        });
})
router.post('/supplier/address/edit', function (req, res) {
    let data = req.body;
    let user = data.user
    let id = data.supplier.address.id;
    Address.findOne({
        where: { id: id },
    })
        .then(address => {
            return address.updateAttributes(data.supplier.address)
        })
        .then(updatedAddress => {
            res.send({code: '00', message: 'success', data: updatedAddress});
        }).catch((err) => {
            res.send({code: '06', message: err.message || err});
        });
})
module.exports = router
