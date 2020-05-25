

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var Mongoose = require('mongoose');


/**
 * Initialize Session
 * Uses MongoDB-based session store
 *
 */
var init = function() {
  if (process.env.NODE_ENV === 'production') {
    return session({
      secret: "secert",
      resave: false,
      saveUninitialized: false,
      unset: 'destroy',
      store: new MongoStore({
        mongooseConnection: Mongoose.connect("mongodb://localhost/fullspeed", {
          useNewUrlParser: true,
          useUnifiedTopology: true
        })
      })
    });
  } else {
    return session({
      secret: "secert",
      resave: false,
      unset: 'destroy',
      saveUninitialized: true
    });
  }
}

module.exports = init();
