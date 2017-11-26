var express = require('express');
var router = express.Router();

var Person = require('../models/person');
var ContactInfo = require('../models/contactInfo');

router.get('/', function(req, res) {
    var testName = 'test';

    var newPerson = {
      name: testName,
      story: 'had to run away'
    };

    var contactInfo = {
            address: '30 street',
            phone: '123-123-12312',
            email: 'random@email.com',
            socialMedia: 'social media test',
    };

    Person.createPerson(newPerson, contactInfo, function(err, response, msg) {
        if(err) {
          throw err;
        } else if (msg) {
          res.json('message: ' + msg);
        } else {
          Person.getByName(testName, function(err, person) {
              if(err) throw err;
              res.json(person);
          });
        }
    });
});

module.exports = router;
