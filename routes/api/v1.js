const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const tmp = require('tmp');
const svg2png = require('svg-to-png');

const User = require("../../models/user.js");
const Icon = require('../../models/icon');

const JSZip = require('jszip');
var slug = require('url-slug');


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
//  * POST '/download-single'
//  * Receives a POST request with code to generate a single SVG file to download\
//  * @param  {Object} req
//  * @return {Object} Blob
//  */

router.post('/download-single', function (req, res) {  
  tmp.file({ mode: 0644, prefix: 'icon-', postfix: '.svg' }, function _tempFileCreated(err, svgPath, fd) {
    if (err) { return console.log(err) }
    const basename = path.basename(svgPath, '.svg')
    
    fs.writeFile(svgPath, req.body.code, function(err) {
      if (err) { return console.log(err) }
      
      if (req.body.type === 'png') {
        tmp.dir(function _tempDirCreated(err, pngPath, cleanupCallback) {
          if (err) throw err;
          svg2png.convert(svgPath, pngPath)
          .then(() => {
            return res.download(`${pngPath}/${basename}.png`)
          })
          cleanupCallback(); // Manual cleanup
        });
      } else {
        return res.download(svgPath)
      }
      
    }); 
  });
});


router.post('/generate-pack', function(req, res) {
  const zip = new JSZip();
  zip.file('demo.html', req.body.demo);
  zip.file(`${req.body.fileName}.svg`, req.body.sprite);
  const timestamp = Date.now();
  const zipName = `${slug(req.body.name)}_${timestamp}`;
  zip.generateNodeStream({type:'nodebuffer',streamFiles:true})
    .pipe(fs.createWriteStream(`./downloads/${zipName}.zip`))
    .on('finish', function () {
        console.log(`${zipName}.zip`);
        res.json({
          status: 'ok',
          url: `${zipName}.zip`,
        })
    });
});


router.get('/download-pack', function(req, res) {
  const filePath = path.resolve(__dirname,'../../downloads', req.query.name);
  fs.stat(filePath, function(err, stats) {
    if (err) { console.log('error') }
    res.sendFile(filePath, function(err) {
      if (err) { 
        console.log('error') 
      } else {
        fs.unlink(filePath);
      } 
    });
  })
});



// /**
//  * GET '/icon/'
//  * Receives a GET request specifying the Icon Slug or ID to get
//  * @param  {String} req.param('id') || {String} req.param('slug').
//  * @return {Object} JSON
//  */

router.get('/icon/:slug', function(req, res){
  var requestedSlug = req.params.slug;

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

})





// /**
//  * GET '/icons'
//  * Receives a GET request to get all Icons or filter by parameters passed
//  * @return {Object} JSON
//  */

router.get('/icons', function(req, res){
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

router.get('/package/:package', function(req, res){
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
//  * GET '/search/:query'
//  * Receives a GET request to get all Icons that match the Search Query
//  * Could receive a paramater ?nin=package-slug-1,package-slug-2 {Array} to avoid search in those packages
//  * @return {Object} JSON
//  */

router.get('/search/:query', function(req, res){
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

    if (noPacks && noPacks.length > 0) {
      jsonData.noPacks = noPacks
    }

    res.json(jsonData);
  })
});






// /**
//  * POST '/update/:id'
//  * Receives a POST request with data of the Icon to update, updates db, responds back
//  * @param  {String} req.param('slug'). The iconSlug to update
//  * @param  {Object} req. An object containing the different attributes of the Icon
//  * @return {Object} JSON
//  */

router.post('/update/:id', function(req, res){

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
 * GET '/delete/:id'
 * Receives a GET request specifying the Icon to delete
 * @param  {String} req.param('id'). The icon ID
 * @return {Object} JSON
 */

router.get('/delete/:id', function(req, res){

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
