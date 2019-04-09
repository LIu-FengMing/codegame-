#!/usr/bin/env node
// ngrok http 3000

var title = '登入';
var socket = require('socket.io');
var request = require('request');

/*** Module dependencies.*/
var app = require('./app');
var debug = require('debug')('nodejs-auth:server');
var http = require('http');
/*** Get port from environment and store in Express.*/
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
/*** Create HTTP server.*/
var server = http.createServer(app);
/*** Listen on provided port, on all network interfaces.*/
server.listen(port, function () {
  console.log("listen to 3000");
});


var io = socket(server);
io.on('connection', function (socket) {
  socket.on("script", function (script) {
    //從伺服端拿到script的資訊
    //內容有：
    //input: "some input"
    //language: "程式語言"
    //script: "程式碼""
    console.log(script);
    console.log("--------------------");
    sendScriptToApi(script.script, script.input, script.language, socket);

  })
})


var sendScriptToApi = function (script, input, language, socket) {
  var program = {
      stdin: input,
      script: script,
      language: language,
      versionIndex: "0",
      clientId:"264e6ff43435e0f0ff02a5a0ca3d5fdd",
      clientSecret: "e7fa5fe51f02c6bee8b6bd322fb2da9ca11f45d5ab9e784b804f4a200d37dcb9"
  };
  var answer = {
      error: "",
      statusCode: "",
      body: ""
  }
  request({
          url: 'https://api.jdoodle.com/execute',
          method: "POST",
          json: program
      },
      function (error, response, body) {
          answer.error = error;
          answer.statusCode = response;
          answer.body = body;
          socket.emit('answer', answer);
      });
}



server.on('error', onError);
server.on('listening', onListening);
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
