var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var autoReap  = require('multer-autoreap');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');
var mongoose = require('mongoose');
var env = require('node-env-file');

mongoose.Promise = global.Promise;

var app = express();

var setupPassport = require('./setupPassport.js');

setupPassport();

// if in development mode, load .env variables
if (app.get("env") === "development") {
    env(__dirname + '/.env');
}

// connect to database
app.db = mongoose.connect(process.env.MONGOLAB_URI);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
};

app.use(allowCrossDomain)
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
// app.use(bodyParser.json());
app.use(bodyParser.json({limit: '16mb'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(autoReap);

app.use(session({
  secret: "TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX",
  resave: true,
  saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'downloads')));

// API Routes
var apiV1 = require('./routes/api/v1');
app.use('/api/v1', apiV1);

// Other Routes
var defaultRoutes = require('./routes/index');
app.use('/', defaultRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});


module.exports = app;
