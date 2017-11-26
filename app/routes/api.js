var config = require('../config');
var express = require('express');
var router = express.Router();
var Person = require('../models/person');
var ContactInfo = require('../models/contactInfo');

router.get('/user/:id', function(req, res) {
  Person.findOne({_id: req.params.id}).populate(["contactInfo", "network"]).exec(function(err, person) {
      if (err) throw err;
      res.json(person);
  });
});

router.delete('/user/:id', function(req, res) {
  Person.findOne({_id: req.params.id}, function(err, person) {
      if (err) throw err;
      else if (person == null) res.json({success: false, msg: 'Person is not registered.'});
      else {
            person.remove(function(err) {
            if(err) throw err;
            res.json({success: true});
          });
      }
  });
});

router.post('/user', function(req, res) {
  Person.updateInfo(req.body.oldInfo, req.body.newInfo, function(err, person) {
      if (err) throw err;
      res.json({success: true});
  });

});

router.put('/user', function(req, res) {
  Person.create(req.body.person, req.body.contactInfo,function(err, person) {
        if (err) res.json({success: false, err: err});
        else res.json({success: true});
  });
});

//** network **/
router.put('/user/network', function(req, res) {
  Person.findOne({name: req.body.person.name}).exec(function(err, person) {
      if (err) res.json({success: false, err: err});
      if (person == null) res.json({success: false, err: 'Person is not registered.'});
      else {  //find network
        Person.findOne({name: req.body.network.name}, function(err, networkPerson) {
            if (networkPerson == null) res.json({success: false, err: 'Could not create network link.'});
            else {
              person.update({network: networkPerson._id}, function(err, person) {
                if (err) throw err;
                else res.json({success: true});
              });
            }
        });
      }
    });
});


/** dev routes **/
router.get('/users', function(req, res) {
  Person.find({}).populate([]).exec(function(err, persons){
      if(err) res.json({success: false, err: err});
      else res.json(persons);
  });
});


router.get('/contactInfo', function(req, res) {
  ContactInfo.find({}).populate("person").exec(function(err, infos){
      if(err) res.json({success: false, err: err});
      else res.json(infos);
  });
});

router.get('/db/purge', function(req, res) {
  Person.remove({}, function(err){
      if (err) res.json({success: false, err: err});
      ContactInfo.remove({}, function(err) {
        if(err) res.json({success: false, err: err});
        else res.json({success: true});
      });
  });
});

module.exports = router;
