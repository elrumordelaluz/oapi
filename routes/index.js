var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var ms = require('ms');

var router = express.Router();

const title = 'Orion API';

router.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.errors = req.flash('error');
  res.locals.infos = req.flash('info');
  next();
});

function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('info', 'You must be logged in to see this page.');
    res.redirect('/login');
  }
}

router.get('/', function(req, res, next) {
  res.render('Index', { title });
});

router.get('/signup', function(req, res) {
  // res.render('Signup', { title });
  res.redirect('/')
});

router.get('/login', function(req, res) {
  res.render('Login', { title });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.post('/login', passport.authenticate('login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

router.post('/signup', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }, function(err, user) {
    if (err) { return next(err); }

    if (user) {
      req.flash('error', 'User already exists.');
      return res.redirect('/signup');
    }

    var newUser = new User({
      username: username,
      password: password
    });

    newUser.save(next);

  });
}, passport.authenticate('login', {
  successRedirect: '/',
  failureRedirect: '/signup',
  failureFlash: true
}));

router.get('/token', ensureAuthenticated, function(req, res, next) {
  var profile = { name: req.user.username, password: req.user.password };
  var token = jwt.sign(profile, process.env.SECRET);

  req.user.token = token;
  req.user.save(function(err) {
    if (err) {
      next(err);
      return;
    }
    req.flash('info', 'Token generated successfully!');
    res.redirect('/');
  });
  // next();
});

router.use(function(req, res) {
  res.status(404).render('NotFound', { title });
});

module.exports = router;
