var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var multer  = require('multer');

const svgson = require('svgson');
const fs = require('fs-promise');

var Icon = require('../models/icon');
var Meta = require('../models/meta');

var router = express.Router();

var slug = require('url-slug');

const toSlug = (str) => slug(str);
const unSlug = (str) => slug.revert(slug.revert(str, '_'), '-', 'titlecase');

const title = 'Orion API';

const doSVGOConfig = (isColor) => {
  var attrs = [
    'svg:id',
    'svg:data-name',
    'svg:width',
    'svg:height',
    'style',
  ];
  
  if (!isColor) {
    attrs.concat = ['(stroke-width|stroke-linecap|stroke-linejoin)']
  }
  
  return {
    multipass: true,
    plugins: [
      { removeStyleElement: true },
      { removeTitle: true },
      { removeAttrs: {
          attrs: attrs
        }
      },
      { cleanupIDs: false },
      { moveElemsAttrsToGroup: false },
    ],
  }
}

const SVGO_CONFIG = {
  multipass: true,
  plugins: [
    { removeStyleElement: true },
    { removeTitle: true },
    { removeAttrs: {
        attrs: [
          '(stroke-width|stroke-linecap|stroke-linejoin)',
          'svg:id',
          'svg:data-name',
          'svg:width',
          'svg:height'
        ]
      }
    },
    { cleanupIDs: false },
    { moveElemsAttrsToGroup: false },
  ]
};

router.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.errors = req.flash('error');
  res.locals.infos = req.flash('info');
  next();
});

router.use((req, res, next) => {
  Meta.findOne({ prop: 'suffix' }, (err, num) => {
    if (err) { return next(err); }
    
    if (num) {
      req.suffix = num.val;
      next()
    } else {
      const newMeta = new Meta({
        prop: 'suffix',
        val: 0,
      })
      console.log('new', newMeta);
      newMeta.save(next);
    }
  })
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

const countIconsInPack = (packageSlug, cb) => {
  Icon.where({ packageSlug }).count(function (err, count) {
    if (err) return handleError(err);
    cb(count);
  })
}

router.get('/admin', ensureAuthenticated, function(req, res, next) {
  Meta.findOne({ prop: 'suffix' }, (err, suffix) => {
    if (err) { return next(err); }
    
    Icon.find({}, 'packageSlug premium', function(err, data) {
      if (err || data === null){
        var err = { status: 'ERROR', message: 'Could not find Icons' };
        next(err);
      }
      
      const icons = data.map(icn => ({
        packageSlug: icn.packageSlug,
        premium: icn.premium
      }));
      
      const packs = icons.reduce((prev, next) => {
        return prev.hasOwnProperty(next.packageSlug) ? Object.assign({}, prev, {
          [next.packageSlug]: {
            icons: prev[next.packageSlug].icons + 1,
            premium: next.premium ? prev[next.packageSlug].premium + 1 : prev[next.packageSlug].premium,
          }
        }) : Object.assign({}, prev, {
          [next.packageSlug]: {
            icons: 1,
            premium: next.premium ? 1 : 0,
          }
        })
      }, {})
      
      res.render('Admin', { title, packs, suffix: suffix.val });
    });
  });
});


router.post('/update-suffix', ensureAuthenticated, function(req, res, next) {
  const nat = (n) => n >= 0 && Math.floor(n) === +n;
  
  if (nat(req.body.suffixNumber)) {
    Meta.findOneAndUpdate({ prop: 'suffix'}, { val: req.body.suffixNumber }, { new: true } , function(err, data){
      if (err){
        var error = {status:'ERROR', message: 'Error updating Suffix'};
        return res.json(error);
      }
      // Suffix updated!
      req.flash('info', `Suffix updated successfully!`);
      res.redirect('/admin');
    });
  } else {
    req.flash('error', `Not valid Suffix!`);
    res.redirect('/admin');
  }
  
});

// router.get('/upload', ensureAuthenticated, function(req, res, next) {
//   res.render('Upload', { title });
// });

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage })
  
router.post('/upload-single', ensureAuthenticated, upload.single('iconFile'), function(req, res, next) {
  const count = req.suffix;
  const newCount = parseInt(count) + 1;
  Meta.findOneAndUpdate({ prop: 'suffix'}, { val: newCount }, { new: true } , function(err, data){
    if (err){
      var error = {status:'ERROR', message: 'Error updating Suffix'};
      return res.json(error);
    }
    // Suffix updated!
  });
  
  fs.readFile(req.file.path, 'utf-8', function(err, data) {
    svgson(data, {
      svgo: true,
      svgoConfig: doSVGOConfig(req.body.iconStyle === 'color')
    }, function(result) {
      // Once processed newIcon with 'svgson'
      const newIcon = {
        name: req.body.iconName,
        packageSlug: toSlug(req.body.iconPack),
        iconSlug: `${toSlug(req.body.iconName)}_${newCount}`,
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
        req.flash('info', `Upload <a href="/edit/${newIcon.iconSlug}">${newIcon.name}</a> into <a href="/pack/${newIcon.packageSlug}">${newIcon.package}</a> pack successfully!`);
        res.redirect('/admin');
      });
      
    });
  });
});


router.post('/upload-multiple', ensureAuthenticated, upload.array('multipleIconFiles'), function(req, res, next) {
  const count = req.suffix;
  const files = req.files.length;
  const newCount = parseInt(count) + files;
  Meta.findOneAndUpdate({ prop: 'suffix'}, { val: newCount }, { new: true } , function(err, data){
    if (err){
      var error = {status:'ERROR', message: 'Error updating Suffix'};
      return res.json(error);
    }
    // Suffix updated!
  });
        
  const processSeparateFile = (file) => {
    return new Promise((resolve, reject) => {
      return fs.readFile(file.path, 'utf-8').then(data => {
        svgson(data, {
          svgo: true,
          title: file.originalname.substr(0, file.originalname.lastIndexOf(".")),
          pathsKey: 'paths',
          svgoConfig: doSVGOConfig(req.body.iconStyle === 'color')
        }, resolve);
      });
    });
  };
  
  Promise.all(req.files.map(file => {
    return processSeparateFile(file);
  })).then(iconsArray => {
    const packageSlug = toSlug(req.body.iconPack);
    const newIcons = iconsArray.map((icon, index) => {
      return {
        name: unSlug(icon.title),
        packageSlug: packageSlug,
        iconSlug: `${toSlug(icon.title)}_${parseInt(count) + index + 1}`,
        library: req.body.iconLib,
        package: req.body.iconPack,
        style: req.body.iconStyle,
        tags: [],
        premium: req.body.iconPremium ? true : false,
        paths: icon.paths,
      };
    });
    
    
    function handleInsert (err, icons) {
      if (err) {
        var error = { status:'ERROR', message: 'Error saving bulk Icons' };
        return res.json(error);
      } else {
        var jsonData = {
          status: 'OK',
          icons: icons
        }
        
        req.flash('info', `Upload ${icons.insertedCount} icons into <a href="/pack/${packageSlug}">${req.body.iconPack}</a> pack successfully!`);
        res.redirect('/admin');
      }
    }
    
    Icon.collection.insert(newIcons, handleInsert);
    
  });
});


// router.get('/icons', ensureAuthenticated, function(req, res) {
//   Icon.find({ packageSlug: 'edition-stroke' }, null, { sort:{ iconSlug: 1 } }, function (err, data){
//     if(err || data === null){
//       var error = { status: 'ERROR', message: 'Could not find Icons' };
//       return res.json(error);
//     }
// 
//     var jsonData = {
//       status: 'OK',
//       package: req.params.package,
//       icons: data
//     }
// 
//     res.render('Icons', { title: `Icons :: ${title}`, icons: jsonData.icons });
//   });
// });


router.get('/pack/:pack', ensureAuthenticated, function(req, res, next) {
  Icon.find({ packageSlug: req.params.pack }, null, { sort:{ iconSlug: 1 } }, function (err, data){
    if (err || data === null){
      var err = { status: 'ERROR', message: 'Could not find Icons' };
      next(err);
    }

    if (data.length === 0) {
      req.flash('info', 'A package called ' + req.params.pack + ' seems empty.');
      res.redirect('/admin');
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
  
  if (req.body.iconSlug) {
    dataToUpdate['iconSlug'] = req.body.iconSlug;
  }

  if (req.body.iconStyle) {
    dataToUpdate['style'] = req.body.iconStyle;
  }

  if (req.body.iconPremium) {
    dataToUpdate['premium'] = req.body.iconPremium;
  }
  
  if (req.body.iconCodeHidden && req.body.iconCodeIsChanged === '1') {
    dataToUpdate['paths'] = JSON.parse(req.body.iconCodeHidden);
  }

  if (req.body.iconTags) {
    var tags = req.body.iconTags.split(",");
    var cleanTags = tags.map(tag => tag.trim());
    dataToUpdate['tags'] = cleanTags;
  }

  Icon.findOneAndUpdate({ iconSlug: requestedIcon}, dataToUpdate, { new: true } , function(err, data){
    // if err saving, respond back with error
    if (err){
      var error = {status:'ERROR', message: 'Error updating animal'};
      return res.json(error);
    }

    console.log('Icon updated!!');
    
    req.flash('info', 'Icon updated successfully!');
    res.redirect(`/edit/${data.iconSlug}`);
  })
});

router.post('/replace/:icon', ensureAuthenticated, upload.single('iconFile'), function(req, res, next) {
  const requestedIcon = req.params.icon;
  
  fs.readFile(req.file.path, 'utf-8', function(err, data) {
    svgson(data, {
      svgo: true,
      svgoConfig: doSVGOConfig(req.body.iconStyleWhenReplacingFile === 'color')
      // svgoConfig: SVGO_CONFIG
    }, function(result) {
      // Once processed newIcon with 'svgson'
      Icon.findOneAndUpdate({ iconSlug: requestedIcon}, { paths: result }, { new: true } , function(err, data){
        // if err saving, respond back with error
        if (err){
          var error = {status:'ERROR', message: 'Error editing Icon'};
          return res.json(error);
        }
        console.log('Icon File Replaced!!');
        req.flash('info', 'Icon File replaced successfully!');
        res.redirect(`/edit/${data.iconSlug}`);
      })
      
    });
  });
});

router.post('/bulk', ensureAuthenticated, function(req, res, next) {
  const selected = req.body['selected[]'];
  const action = req.body.action;
  
  if (action === 'premium') {
    Icon.update({'iconSlug': { $in: selected }}, { premium: true }, { multi: true }, (err, data) => {
      if (err || data === null){
        var err = { status: 'ERROR', message: 'Could not find Icons' };
        next(err);
      }
      req.flash('info', `Set ${data.n} icons to Premium successfully!`);
      res.json({ data })
    });
  } else if (action === 'delete') {
    Icon.find({'iconSlug': { $in: selected }})
      .then(orig => {
        Icon.remove({'iconSlug': { $in: selected }}, (err, data) => {
          if (err || data === null){
            var err = { status: 'ERROR', message: 'Could not find Icons' };
            next(err);
          }

          req.session.lastMultipleIcons = orig;
          req.flash('info', `Deleted ${data.result.n} icons successfully! <a href="/undo-multiple">Undo?</a>`);
          countIconsInPack(orig[0].packageSlug, count => {
            res.json({ data, count })
          });
        });
      })
  } else if (action === 'nopremium') {
    Icon.update({'iconSlug': { $in: selected }}, { premium: false }, { multi: true }, (err, data) => {
      if (err || data === null){
        var err = { status: 'ERROR', message: 'Could not find Icons' };
        next(err);
      }
      req.flash('info', `Unset ${data.n} icons from Premium successfully!`);
      res.json({ data })
    });
  }
});

router.get('/undo', ensureAuthenticated, function(req, res, next) {
  const lastIcon = req.session.lastIcon;
  const undoneIcon = {
    name: lastIcon.name,
    packageSlug: lastIcon.packageSlug,
    iconSlug: lastIcon.iconSlug,
    library: lastIcon.library,
    package: lastIcon.package,
    style: lastIcon.style,
    tags: lastIcon.tags,
    premium: lastIcon.premium,
    paths: lastIcon.paths,
  }

  const icon = new Icon(undoneIcon);
  
  icon.save( function (err, data) {
    if (err){
      var error = { status:'ERROR', message: 'Error undoing Icon' };
      return res.json(error);
    }
  
    console.log('Icon Undone!', undoneIcon);
  
    // JSON data of the new Icon
    var jsonData = {
      status: 'OK',
      icon: data
    }
    
    req.flash('info', `Undone <a href="/edit/${undoneIcon.iconSlug}">${undoneIcon.iconSlug}</a> into <a href="/pack/${undoneIcon.packageSlug}">${undoneIcon.package}</a> pack successfully!`);
    res.redirect(`${req.header('Referer')}#${undoneIcon.iconSlug}`);
  });
});

router.get('/undo-multiple', ensureAuthenticated, function(req, res, next) {
  const getParams = (obj) => ({
    name: obj.name,
    packageSlug: obj.packageSlug,
    iconSlug: obj.iconSlug,
    library: obj.library,
    package: obj.package,
    style: obj.style,
    tags: obj.tags,
    premium: obj.premium,
    paths: obj.paths,
  });
  const lastMultipleIcons = req.session.lastMultipleIcons.map(getParams);
  
  function handleInsert (err, icons) {
    if (err) {
      var error = { status:'ERROR', message: 'Error saving bulk Icons' };
      return res.json(error);
    } else {
      var jsonData = {
        status: 'OK',
        icons: icons
      }
      
      req.flash('info', `Undone deletion of ${icons.insertedCount} icons successfully!`);
      res.redirect(req.header('Referer'));
    }
  }
  
  Icon.collection.insert(lastMultipleIcons, handleInsert);  
});

router.get('/delete/:icon', ensureAuthenticated, function(req, res, next) {
  const requestedIcon = req.params.icon;
  Icon.findOneAndRemove({ iconSlug: requestedIcon}, function(err, doc){
    if (err){
      var error = {status:'ERROR', message: 'Error removing Icon: ' + err};
      return res.json(error);
    }
    
    req.session.lastIcon = doc;
    req.flash('info', `Icon ${req.params.icon} deleted successfully! <a href="/undo">Undo?</a>`);
    
    countIconsInPack(doc.packageSlug, count => {
      res.redirect(count === 0 ? '/admin' : req.header('Referer'));
    });
    
  })
});


router.use(function(req, res) {
  res.status(404).render('NotFound', { title });
});

module.exports = router;
