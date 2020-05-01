#!/usr/bin/env node
// ngrok http 3000
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
  console.log("listen to ",port);
});


var io = socket(server);
io.on('connection', function (socket) {
  socket.on("script", function (script) {
    //從伺服端拿到script的資訊
    //內容有：
    //input: "some input"
    //language: "程式語言"
    //script: "程式碼""
    sendScriptToApi(script.script, script.input, script.language, socket);
  })
})

var apikey = [
  {
    clientId: "6bae7e59775c3636b4bf78cdaed7c898",
    clientSecret: "88c23aa459149f14b0bf2b1ee57b834e727f8fd612848c2290a755b83145cde2"
  },
  {
    clientId: "e66752ae88e8398116a9db0fabca477a",
    clientSecret: "aa1d0ee049e376efcce7f8ecc7b9de6a4a27a20b21e9d4d935c61200b73e369"
  },
  {
    clientId: "19dea378b4d9d32cf26fa7874fd341fa",
    clientSecret: "7ccba1aed6624fac8ad8ceffde8163c6b0f32aa867f75551dc6e885dd32bc9bf"
  },
  {
    clientId: "86114495714bafbab3940b911f2b2430",
    clientSecret: "4bba8244592196944b848865233437c6fd017d798ed7febc42ec2f3d4cfab3aa"
  },
  {
    clientId: "bcaa4f910abd2163aeea19e6af139c97",
    clientSecret: "40ae2377986d16495b5392bc9e470eb08d31f8fd42d7fe92b666dbd836a936a5"
  },
  {
    clientId: "b422f021917fd4123450ec85f3f128c5",
    clientSecret: "dc6435955202ae72b80dfae2fff9044c7ab3c2890bc5bfbb246a5eafd3017eef"
  },
  {
    clientId: "a93d50f12ef2bfd953696a982eaa07c7",
    clientSecret: "da93ea10831281027fb255bbd03d96b77f6f39266bcb400dac417fd4724edc31"
  },
  // fdm的
  {
    clientId: "99c2672f5dce9ee9171173169c6c5fb9",
    clientSecret: "a7d1e2ea03bd4e32cd1284c17f51b94ff71c1473b38b98b53aab81138a902ea7"
  },
  //der的
  {
    clientId: "264e6ff43435e0f0ff02a5a0ca3d5fdd",
    clientSecret: "e7fa5fe51f02c6bee8b6bd322fb2da9ca11f45d5ab9e784b804f4a200d37dcb9"
  },
  //全速衝線的
  {
    clientId: "e14f2665b86ef91de9427aab4a4b4af4",
    clientSecret: "107e5014ae6aa0266fa197274299513146e1688e7c19035a1dc61497b2d5141e"
  },
  //勁豪的
  {
    clientId: "89a97a9b4cca969f591bcf2c53e18ce5",
    clientSecret: "17744fd2cc7fbe37b70317d41844688a415bf0a08317535f22d7541feb1fb8ad"
  },
  //俊成的
  {
    clientId: "e4d78f63a8cb4519300e855de8ff908c",
    clientSecret: "40e7690cd58cdfdd5252d7687b816c58c5f5a8f63948a34f0624f170f375cf97"
  },
  {
    clientId: "7396cf893d492bde69303506411ff238",
    clientSecret: "5f567b1102df0329c0333e3c29ca8df1231fead27ae8be5f225cd0b0127549ba"
  },
  {
    clientId: "4afe1a62e03936b375fcba723f89861f",
    clientSecret: "ba06a43d80b4a11d1541e3b6af11c7927f3de7ef409d062ed7a9fdc1959fdb69"
  },
  {
    clientId: "f2e831474c72f650e310b6d440fedadd",
    clientSecret: "f08441ab68fb62f3e4541e2d9548dea2b9558c281c3591eb5d6601d04e5d5db0"
  },
  {
    clientId: "af80fb1ac4ca88d689e09726c5f92a98",
    clientSecret: "3266b028edb3183330d5f7f5f076ad478a5dde8bca633c6f8e76d19c0c268e4c"
  },
]

function getRandom(x) {
  return Math.floor(Math.random() * x);
};

var sendScriptToApi = function (script, input, language, socket) {
  var index =    getRandom(apikey.length)
  var clientId = apikey[index].clientId
  var clientSecret = apikey[index].clientSecret
  var program = {
    stdin: input,
    script: script,
    language: language,
    versionIndex: "0",
    clientId: clientId,
    clientSecret: clientSecret
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
