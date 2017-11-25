var express = require('express');
var router = express.Router();
var passport = require('passport');
var config = require('../config');

router.get('/', function(req, res) {
    res.redirect('/user/account');
});

router.get('/login', function(req, res) {
    if (req.isAuthenticated()) {
        req.flash('error', 'You are already logged in.');
        res.redirect('/');
    } else {
        res.render('login', {redirect: '/'});
    }
});

router.post('/login', passport.authenticate('local', {
        failureRedirect: '/user/login',
        failureFlash: true
  }), function(req, res) {
        if (typeof req.body.redirect !== 'undefined') {
            res.redirect(req.body.redirect);
        }
        res.redirect('/');
});

//logs user out of site, deleting them from the session, and returns to homepage
router.get('/logout', function(req, res) {
    if (!req.isAuthenticated()) {
        req.flash('error', 'Not logged in');
    } else {
        req.logout();
        req.flash('success_msg', 'Logged out');
    }
    res.redirect('/user/login');
});

module.exports = router;
