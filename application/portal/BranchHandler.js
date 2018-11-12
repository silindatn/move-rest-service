let express = require('express')
let router = express.Router()
let Branch = require('./../../db/model/Branch-model');
let Address = require('./../../db/model/Address-model');
let async = require('async')

router.post('/branch/create', function (req, res) {
    let data = req.body;
    let user = data.user;
    try {
        Branch.findOne({
            where: { name: data.branch.name },
        }).then((branch_exist) => {
            if (branch_exist) {
                res.send({code: '06', message: '#branch.create.name.exist'});
            } else {
                async.waterfall([
                    function createAddress (next) {
                        Address.create(data.branch.Address).then((address) => {
                            next(null, address);
                        }).catch((err) => {
                            next(err);
                        });
                    },
                    function createBranch (address, next) {
                        data.branch['addressId'] = address.id;
                        data.branch.Address = address;
                        Branch.create(data.branch).then((branch) => {
                            next(null, branch);
                        }).catch((err) => {
                            next(err);
                        });
                    }
                ],
                function done (err, branch) {
                    if (!err && branch) {
                        res.send({code: '00', message: 'success', data: branch})
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
router.post('/branch/list_all', function (req, res) {
    let query = req.body.query || {}
    Branch.findAll({
        where: query,
    }).then((branches) => {
        res.send({code: '00', message: 'success', data: branches})
    }).catch((err) => {
        res.send({code: '06', message: err.message || err})
    });
})
router.post('/branch/edit', function (req, res) {
    let data = req.body;
    let user = data.user
    let id = data.branch.id;
    Branch.findOne({
        where: { id: id },
    })
        .then(branch => {
            return branch.updateAttributes(data.branch)
        })
        .then(updatedBranch => {
            res.send({code: '00', message: 'success', data: updatedBranch});
        }).catch((err) => {
            res.send({code: '06', message: err.message || err});
        });
})
router.post('/branch/address/edit', function (req, res) {
    let data = req.body;
    let user = data.user
    let id = data.branch.address.id;
    Address.findOne({
        where: { id: id },
    })
        .then(address => {
            return address.updateAttributes(data.branch.address)
        })
        .then(updatedAddress => {
            res.send({code: '00', message: 'success', data: updatedAddress});
        }).catch((err) => {
            res.send({code: '06', message: err.message || err});
        });
})
module.exports = router
