var express = require('express');
var router = express.Router();

var Person = require('../models/person');
var ContactInfo = require('../models/contactInfo');

router.get('/', function(req, res) {
    res.send('hello');
});

router.get('/setupDB', function(req, res) {
      var promises = [
         {
            "_id":"5a1aba6965af6300c8c20286",
            "name":"friend's mother",
            "story":"had to run away",
            "contactInfo":[
            ]
         },
         {
            "_id":"5a1abd197e3dc801210f63ec",
            "name":"friend",
            "network":[
               "5a1aba6965af6300c8c20286",
               "5a1aba6965af6300c8c20286"
            ],
            "contactInfo":[

            ]
         },
         {
            "_id":"5a1abe99b753300153917f31",
            "name":"friend's father",
            "network":[
               "5a1aba6965af6300c8c20286",
               "5a1aba6965af6300c8c20286"
            ],
            "contactInfo":[

            ]
         },
         {
            "_id":"5a1abf0b70aaa9015de93b33",
            "name":"friend's grandfather",
            "network":[
               "5a1aba6965af6300c8c20286"
            ],
            "contactInfo":
              {
                address: 'address ',
                phone: '111-222-3333',
                email: 'email@test.com',
                socialMedia: 'social media'
              }
         }
      ].map(function(params) {
          var contactInfo = params.contactInfo;
          delete params.contactInfo;
          var person = params;

          return new Promise(function(resolve, reject) {
            Person.create(params, contactInfo, function(err, person) {
              if(err) reject(err);
              resolve(person);
            });
          });
      });

      Promise.all(promises).then(function(result) {
          res.json(result);
      }, function(err) {
          res.json(err);
      })
});

module.exports = router;
