var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

var User = require("../models/user.js");
var Icon = require('../models/icon');

var toSlug = function (text) { 
  return text.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-')
}


/**
 * GET '/'
 * Default home route. Just relays a success message back.
 * @param  {Object} req
 * @return {Object} json
 */
router.get('/', function(req, res) {
  
  var jsonData = {
    'name': 'orion-api',
    'api-status':'OK'
  }

  // respond with json data
  res.json(jsonData)
});

// simple route to show an HTML page
router.get('/sample-page', function(req,res){
  res.render('sample.html')
})




router.get('/config', function(req, res) {
  var nick = new User({ 
    name: 'Lionel T', 
    password: 'elrumordelaluz',
    admin: true 
  });
  
  nick.save(function(err) {
    if (err) throw err;
    console.log('User saved successfully');
    res.json({ success: true });
  });
});

router.get('/api/users', function(req, res) {
  User.find({}, 'name', function(err, users) {
    res.json(users);
  });
});

router.post('/api/authenticate', function(req, res) {
  User.findOne({
    name: req.body.name
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right create a token
        var token = jwt.sign({ name: user.name, password: user.password }, process.env.SECRET, {
          expiresIn: '7d'
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }   

    }

  });
});


// route middleware to verify a token
router.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, process.env.SECRET, function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});


// /**
//  * POST '/api/add'
//  * Receives a POST request of the new Icon, saves to db, responds back
//  * @param  {Object} req. An object containing the different attributes of the Icon
//  * @return {Object} JSON
//  */

router.post('/api/add', function(req, res){
    // console.log(req.body);
    var name = req.body.name,
        package = req.body.package,
        packageSlug = toSlug(package),
        iconSlug = packageSlug + '__' + toSlug(name),
        library = req.body.library,
        type = req.body.type,
        tags = req.body.tags.split(","),
        paths = JSON.parse(req.body.paths),
        premium = req.body.premium;

    var iconObj = {
      name: name,
      package: package,
      iconSlug: iconSlug,
      packageSlug: packageSlug,
      library: library,
      type: type,
      tags: tags,
      paths: paths,
      premium: premium
    }

    var icon = new Icon(iconObj);
    
    // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model-save    
    icon.save( function (err, data) {
      if (err){
        var error = { status:'ERROR', message: 'Error saving Icon' };
        return res.json(error);
      }

      console.log('Icon saved!', 'name: ' + name, 'package: ' + package, '(' + iconSlug + ')');
      // console.log(data);

      // JSON data of the new Icon
      var jsonData = {
        status: 'OK',
        icon: data
      }
      return res.json(jsonData);
    })  
});


function adaptBulkIcons (file) {
  return file.icons.map(function (icon) {
    // Transform `title` into `name`
    icon.name = icon.title

    // Create slugs
    var packageSlug = toSlug(icon.package);
    icon.packageSlug = packageSlug;
    icon.iconSlug = packageSlug + '__' + toSlug(icon.title);

    // Aditional params
    icon.premium = false;
    icon.tags = [];

    // Remove `title`
    delete icon.title;
    // console.log(icon)

    return icon;
  })
}

router.post('/api/bulk', function(req, res){
  // var iconsArray = adaptBulkIcons(editionFillFile);
  Icon.collection.insert(iconsArray, handleInsert);
  function handleInsert (err, icons) {
    if (err) {
      var error = { status:'ERROR', message: 'Error saving bulk Icons' };
      return res.json(error);
    } else {
      var jsonData = {
        status: 'OK',
        icons: icons
      }
      console.info('%d Icons were successfully stored.', icons.length);
      return res.json(jsonData);
    }
  }
});



// /**
//  * GET '/api/icon/'
//  * Receives a GET request specifying the Icon Slug or ID to get
//  * @param  {String} req.param('id') || {String} req.param('slug').
//  * @return {Object} JSON
//  */

router.get('/api/icon/', function(req, res){

  var requestedId = req.params.id;
  var requestedSlug = req.params.slug;
  
  console.log(req.query)
  if (requestedId) {

    Icon.findById(requestedId, function (err, data){
      if(err || data == null){
        var error = {status:'ERROR', message: 'Could not find that Icon slug'};
         return res.json(error);
      }
      var jsonData = {
        status: 'OK',
        icon: data
      }
      return res.json(jsonData);
    })

  } else if (requestedSlug) {

    Icon.findOne({ iconSlug: requestedSlug }, function (err, data){
      if(err || data == null){
        var error = {status:'ERROR', message: 'Could not find that Icon ID'};
         return res.json(error);
      }
      var jsonData = {
        status: 'OK',
        icon: data
      }
      return res.json(jsonData);
    })

  } else {

    var error = {status:'ERROR', message: 'Need to specify at least a param'};
    return res.json(error);

  }

})





// /**
//  * GET '/api/icons'
//  * Receives a GET request to get all Icons or filter by parameters passed
//  * @return {Object} JSON
//  */

router.get('/api/icons', function(req, res){
  // Find all Icons or filter by parameters 
  var query = Object.assign({}, req.query);
  if (query.hasOwnProperty('token')) {
    delete query['token'];
  }
  Icon.find(query, function (err, data){
    if(err || data == null){
      var error = { status: 'ERROR', message: 'Could not find Icons' };
      return res.json(error);
    }

    var jsonData = {
      status: 'OK',
      icons: data
    } 

    res.json(jsonData);
  })
});



// /**
//  * GET '/package/:package'
//  * Receives a GET request to get all Icons in specified Package
//  * @param  {String} req.params.package.
//  * @return {Object} JSON
//  */

router.get('/api/package/:package', function(req, res){
  // Find all or filter by parameters 
  Icon.find({ packageSlug: req.params.package }, null, { sort:{ iconSlug: 1 } }, function (err, data){
    if(err || data == null){
      var error = { status: 'ERROR', message: 'Could not find Icons' };
      return res.json(error);
    }

    var jsonData = {
      status: 'OK',
      package: req.params.package,
      icons: data
    } 

    res.json(jsonData);
  })
});







// /**
//  * GET '/api/search/:query'
//  * Receives a GET request to get all Icons that match the Search Query
//  * Could receive a paramater ?nin=package-slug-1,package-slug-2 {Array} to avoid search in those packages
//  * @return {Object} JSON
//  */

router.get('/api/search/:query', function(req, res){
  // Find all or filter by search query 
  var regex = new RegExp(req.params.query, 'i');
  var noPacks = req.query.nin ? req.query.nin.split(/[\s,]+/) : null;
  Icon.find({ 
    $or: [
      { name: regex }, 
      { tags: regex }
    ],
    packageSlug: { $nin: noPacks }
  }, null, { 
    skip: 0,
    sort:{ packageSlug: 1 } 
  }, function (err, data){
    if(err || data == null){
      var error = { status: 'ERROR', message: 'Could not find Icons' };
      return res.json(error);
    }

    var jsonData = {
      status: 'OK',
      query: req.params.query,
      icons: data
    } 

    if (noPacks.length > 0) {
      jsonData.noPacks = noPacks
    }

    res.json(jsonData);
  })
});






// /**
//  * POST '/api/update/:id'
//  * Receives a POST request with data of the Icon to update, updates db, responds back
//  * @param  {String} req.param('slug'). The iconSlug to update
//  * @param  {Object} req. An object containing the different attributes of the Icon
//  * @return {Object} JSON
//  */

router.post('/api/update/:id', function(req, res){

   var requestedId = req.param('id');

   var dataToUpdate = {}; // a blank object of data to update

    // pull out the information from the req.body and add it to the object to update
    // var name, age, weight, color, url; 

    var type, paths, premium, tags = [];

    if (req.body.type) {
      type = req.body.type;
      dataToUpdate['type'] = type;
    }
    if (req.body.paths) {
      paths = req.body.paths;
      dataToUpdate['paths'] = paths;
    }
    if (req.body.premium) {
      premium = req.body.premium;
      dataToUpdate['premium'] = premium;
    }
    if(req.body.tags){
      tags = req.body.tags.split(",");
      dataToUpdate['tags'] = tags;
    }

    console.log('the data to update is ' + JSON.stringify(dataToUpdate));

    Icon.findByIdAndUpdate(requestedId, dataToUpdate, { new: true }, function (err,data) {
      
      if (err){
        var error = {status:'ERROR', message: 'Error updating animal'};
        return res.json(error);
      }

      console.log('Icon updated successfully!');

      var jsonData = {
        status: 'OK',
        icon: data
      }

      return res.json(jsonData);

    })

})





/**
 * GET '/api/delete/:id'
 * Receives a GET request specifying the Icon to delete
 * @param  {String} req.param('id'). The icon ID
 * @return {Object} JSON
 */

router.get('/api/delete/:id', function(req, res){

  var requestedId = req.param('id');

  Icon.findByIdAndRemove(requestedId,function(err, data){
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find that animal to delete'};
      return res.json(error);
    }

    // otherwise, respond back with success
    var jsonData = {
      status: 'OK',
      message: 'Icon successfully deleted (id: ' + requestedId + ')'
    }

    res.json(jsonData);

  })

})


module.exports = router;
