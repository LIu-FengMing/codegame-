// ngrok http 3000
var createError = require('http-errors');
var crypto = require('crypto');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var passport = require('passport')
var LocalStrategy = require('passport-local')
var mongoose = require('mongoose')
var beforeHomePageRoutes=require('./routes/beforeHomePage')
var homeRoutes=require('./routes/home')
var oblivionRoutes=require('./routes/oblivion')

var developerRoutes=require('./routes/developer.js')

var APIRoutes=require('./routes/API')
// var homRoutes=require('./routes/home')

var dungeon = require('./routes/dungeon')

var session 	= require('./session/index');


mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost/nodetest',{ useNewUrlParser: true,useUnifiedTopology: true });



var app = express();




// Express Session

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());
app.use(express.static('public'));
app.use(session);
app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;
    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
// Connect Flash
app.use(flash());
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.use('/',beforeHomePageRoutes);
app.use('/',homeRoutes);
app.use('/',oblivionRoutes);

app.use('/',developerRoutes);


app.use('/',dungeon);





app.use('/API',APIRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  // console.log("Have error:" + err.message);
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
