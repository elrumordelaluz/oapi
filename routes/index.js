var express = require('express');
var router = express.Router();

const title = 'Orion API';

router.get('/', function(req, res) {
  res.render('Index', { title });
});

router.get('/login', function(req, res) {
  res.render('Login', { title });
});

router.use(function(req, res) {
  res.status(404).render('NotFound', { title });
});

module.exports = router;
