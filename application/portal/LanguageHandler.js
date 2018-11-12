var Language = require('./../../db/model/Language-model');
var express = require('express');
var router = express.Router();

router.post('/language/create', function (req, res) {
    var data = req.body;
    // var user = data.user;
    Language.findOne({
        where: { system_default: true },
    }).then((default_language) => {
        if (default_language) {
            data.language['system_default'] = false;
        } else {
            data.language['system_default'] = true;
        }
        try {
            Language.findOne({
                where: { name: data.language.name, code: data.language.code },
            }).then((language_exist) => {
                if (language_exist) {
                    res.send({code: '06', message: '#language.create.name,code.exist'});
                } else {
                    Language.create(data.language).then((language) => {
                        res.send({code: '00', message: 'success', data: language});
                    }).catch((err) => {
                        res.send({code: '06', message: err.message || err});
                    });
                }  
            });
        } catch (error) {
            res.send({code: '06', message: error.message || error});
        }
    })
});
router.post('/language/list', function (req, res) {
    let query = req.body.query || {}
    Language.findAll({
        where: query
    }).then((languages) => {
        res.send({code: '00', message: 'success', data: languages})
    }).catch((err) => {
        res.send({code: '06', message: err.message || err})
    });
});
router.post('/language/edit', function (req, res) {
    var data = req.body;
    // var user = data.user;
    var id = data.language.id;

    Language.findOne({
        where: { id: id },
    })
        .then(language => {
            return language.updateAttributes(data.language)
        })
        .then(updatedLanguage => {
            res.send({code: '00', message: 'success', data: updatedLanguage});
        }).catch((err) => {
            res.send({code: '06', message: err.message || err});
        });
});
module.exports = router;
