var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var multer  = require('multer');

const svgson = require('svgson');
const fs = require('fs');

var Icon = require('../models/icon');

var router = express.Router();

var h = require('../helpers/index');

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
    req.session.returnTo = req.session.returnTo || req.url;
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
  // successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  successReturnToOrRedirect: '/'
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



router.get('/upload', ensureAuthenticated, function(req, res, next) {
  res.render('Upload', { title });
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage })
  
router.post('/upload', ensureAuthenticated, upload.single('iconFile'), function(req, res, next) {
  Icon.count({})
    .then(count => {
      fs.readFile(req.file.path, 'utf-8', function(err, data) {
        svgson(data, {
          svgo: true,
          svgoPlugins: [
            { removeStyleElement: true },
            { removeAttrs: {
                attrs: [
                  '(stroke-width|stroke-linecap|stroke-linejoin)',
                  'svg:id'
                ]
              }
            },
            { cleanupIDs: false },
            { moveElemsAttrsToGroup: false },
          ]
        }, function(result) {
          // 1. Got total icons number 
          // 2. Processed newIcon with 'svgson'
          const newIcon = {
            name: req.body.iconName,
            packageSlug: h.toSlug(req.body.iconPack),
            iconSlug: `${h.toSlug(req.body.iconName)}_${count + 1}`,
            library: req.body.iconLib,
            package: req.body.iconPack,
            style: req.body.iconStyle,
            tags: req.body.iconTags.split(","),
            premium: req.body.iconPremium ? true : false,
            paths: result,
          }

          const icon = new Icon(newIcon);
          
          icon.save( function (err, data) {
            if (err){
              var error = { status:'ERROR', message: 'Error saving Icon' };
              return res.json(error);
            }
          
            console.log('Icon saved!', newIcon);
          
            // JSON data of the new Icon
            var jsonData = {
              status: 'OK',
              icon: data
            }
            return res.json(jsonData);
          });
          
        });
      });
    })
});



router.get('/icons', ensureAuthenticated, function(req, res) {
  Icon.find({ packageSlug: 'edition-stroke' }, null, { sort:{ iconSlug: 1 } }, function (err, data){
    if(err || data === null){
      var error = { status: 'ERROR', message: 'Could not find Icons' };
      return res.json(error);
    }

    var jsonData = {
      status: 'OK',
      package: req.params.package,
      icons: data
    }

    res.render('Icons', { title: `Icons :: ${title}`, icons: jsonData.icons });
  });
});

router.get(['/pack', '/packs'], ensureAuthenticated, function(req, res, next) {
  Icon.find({}, 'packageSlug', function(err, data) {
    if (err || data === null){
      var err = { status: 'ERROR', message: 'Could not find Icons' };
      next(err);
    }
    const packs = new Set(data.map(icn => icn.packageSlug));

    res.render('Icons', { title: `Icons :: ${title}`, packs: Array.from(packs) });
  });
});

router.get('/pack/:pack', ensureAuthenticated, function(req, res, next) {
  Icon.find({ packageSlug: req.params.pack }, null, { sort:{ iconSlug: 1 } }, function (err, data){
    if (err || data === null){
      var err = { status: 'ERROR', message: 'Could not find Icons' };
      next(err);
    }

    if (data.length === 0) {
      req.flash('info', 'No icons for a package called: ' + req.params.pack);
      res.redirect('/pack');
      return;
    }

    res.render('Icons', { title: `Icons :: ${title}`, icons: data, pack: req.params.pack });
  });
});

router.get('/edit/:icon', ensureAuthenticated, function(req, res, next) {
  Icon.findOne({ iconSlug: req.params.icon }, function(err, data) {
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find that Icon ID'};
      next(err);
    }

    res.render('EditIcon', { title: `Icon :: ${title}`, icon: data });
  });
});

router.post('/edit/:icon', ensureAuthenticated, function(req, res, next) {
  const requestedIcon = req.params.icon;
  var dataToUpdate = {};

  if (req.body.iconName) {
    dataToUpdate['name'] = req.body.iconName;
  }

  if (req.body.iconStyle) {
    dataToUpdate['style'] = req.body.iconStyle;
  }

  if (req.body.iconPremium) {
    dataToUpdate['premium'] = req.body.iconPremium;
  }

  if (req.body.iconTags) {
    var tags = req.body.iconTags.split(",");
    var cleanTags = tags.map(tag => tag.trim());
    dataToUpdate['tags'] = cleanTags;
  }

  // console.log('the data to update is ' + JSON.stringify(dataToUpdate));

  Icon.findOneAndUpdate({ iconSlug: requestedIcon}, dataToUpdate, { new: true } , function(err,data){
    // if err saving, respond back with error
    if (err){
      var error = {status:'ERROR', message: 'Error updating animal'};
      return res.json(error);
    }

    console.log('Icon updated!!');

    res.render('EditIcon', {
      title: `Icon :: ${title}`,
      icon: data,
      infos: ['Icon updated successfully!']
    });
  })
});

router.use(function(req, res) {
  res.status(404).render('NotFound', { title });
});

module.exports = router;
