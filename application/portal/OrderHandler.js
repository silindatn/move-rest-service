const express = require('express');
const router = express.Router();
const handler = express();
const Order = require('./../../db/model/Order-model');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

router.post('/create', function (req, res) {
    const data = req.body;
    // const user = data.user;
    try {
        Order.findOne({
            where: { quoteNumber: data.order.quoteNumber },
        }).then((order_exist) => {
            if (order_exist) {
                res.send({code: '06', message: '#order.create.quoteNumber.exist'});
            } else {
                Order.create(data.order).then((order) => {
                    res.send({code: '00', message: 'success', data: order})
                }).catch((err) => {
                    res.send({code: '06', message: err.message || err});
                });
            }
        });
    } catch (error) {
        res.send({code: '06', message: error.message || error});
    }
});
router.post('/list_all', function (req, res) {
    let query = req.body.query || {};
    if (req.body.type && req.body.type === 'invoiced') {
        query['invoiceId'] = {[Op.ne]: null}
    }
    Order.findAll({
        where: query,
    }).then((orders) => {
        res.send({code: '00', message: 'success', data: orders})
    }).catch((err) => {
        res.send({code: '06', message: err.message || err})
    });
});
router.post('/edit', function (req, res) {
    const data = req.body;
    // const user = data.user;
    const id = data.order.id;
    Order.findOne({
        where: { id: id },
    })
        .then(order => {
            return order.updateAttributes(data.order)
        })
        .then(updatedOrder => {
            res.send({code: '00', message: 'success', data: updatedOrder});
        }).catch((err) => {
            res.send({code: '06', message: err.message || err});
        });
});

handler.use('/order', router);
module.exports = handler;
