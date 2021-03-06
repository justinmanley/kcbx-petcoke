require('./lib/env');
var cwd = process.cwd();

var express = require('express')
  , auth = require(cwd + '/middleware/auth')
  , fs = require('fs')
  , hbs = require('hbs')
  , hbsHelpers = require(cwd + '/lib/hbs-helpers')
  , path = require('path')
  , favicon = require('serve-favicon')
  , logger = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  ;

var staticRoutes     = require('./routes/index');
var smsRoutes        = require("./routes/api/sms");
var subscriberRoutes = require("./routes/api/subscribers");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbsHelpers.register(hbs);

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.png'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

if (app.get('env') === 'staging') {
  app.use(auth.staging)
}

app.use('/'                , staticRoutes);
app.use("/api/sms"         , smsRoutes);
app.use("/api/subscribers" , subscriberRoutes);

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
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
