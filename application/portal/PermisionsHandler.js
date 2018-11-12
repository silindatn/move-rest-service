const express = require('express');
const router = express.Router();
const handler = express();
const Permission = require('./../../db/model/Permission-model');

router.post('/create', function (req, res) {
    const data = req.body;
    const user = data.user;
    try {
        Permission.findOne({
            where: { code: data.permission.code },
        }).then((permission_exist) => {
            if (permission_exist) {
                res.send({code: '06', message: '#permission.create.code.exist'});
            } else {
                Permission.create(data.permission).then((permission) => {
                    res.send({code: '00', message: 'success', data: permission})
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
    const query = req.body.query || {};
    Permission.findAll({
        where: query,
    }).then((permissions) => {
        res.send({code: '00', message: 'success', data: permissions})
    }).catch((err) => {
        res.send({code: '06', message: err.message || err})
    });
});
router.post('/edit', function (req, res) {
    const data = req.body;
    const user = data.user;
    const id = data.permission._id;
    Permission.findOne({
        where: { id: id },
    })
        .then(permission => {
            return permission.updateAttributes(data.permission)
        })
        .then(updatedPermission => {
            res.send({code: '00', message: 'success', data: updatedPermission});
        }).catch((err) => {
            res.send({code: '06', message: err.message || err});
        });
});

handler.use('/permission', router);
module.exports = handler;
