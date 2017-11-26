var express = require('express');
var router = express.Router();

var Person = require('../models/person');
var ContactInfo = require('../models/contactInfo');

router.get('/', function(req, res) {
    res.send('hello')
});

module.exports = router;
