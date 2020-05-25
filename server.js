const {
  c,
  cpp,
  node,
  python,
  java
} = require('compile-run');
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


var Room = require('./models/room');
var GameRoom = require('./models/GameRoom');
var User = require('./models/user');



var server = http.createServer(app);



/*** Listen on provided port, on all network interfaces.*/
server.listen(port, function() {
  console.log("listen to 3000");
});



var io = socket(server);







io.on('connection', function(socket) {
  socket.on("script", function(script) {
    //從伺服端拿到script的資訊

    cpp.runSource(script.script, {
      stdin: script.input
    }, (err, result) => {
      if (err) {
        console.log("err:", err);
      } else {
        console.log("res:", result);
        socket.emit("answer", result);
      }
    });
  });
  /*
    socket.on("move", function(str, userNum) {
      io.emit("go", str, userNum);
    });
  */

})



server.on('error', onError);
server.on('listening', onListening);

// Normalize a port into a number, string, or false.

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

// Event listener for HTTP server "error" event.

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port;

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
  var bind = typeof addr === 'string' ?
    'pipe ' + addr :
    'port ' + addr.port;
  debug('Listening on ' + bind);
}




//---------廖映翔----------

io.use((socket, next) => {
  require('./session/index')(socket.request, {}, next);
});

// // room namespace -> 大廳的空間
io.of('/lobby').on('connection', function(socket) {

  setTimeout(function() { //這個timeout是為了更新自己回到大廳後房間的人數
    Room.findAllRoom(function(err, rooms) {
      if (err) throw err;
      socket.emit('AllRoomPlayerNum', rooms);
    });
  }, 1);





  //創造房間
  socket.on('createRoom', function(title, CurrentMap) {
    Room.findRoom({
      'title': new RegExp('^' + title + '$', 'i')
    }, function(err, room) {
      if (err) throw err;
      // console.log(room);
      if (room) {
        socket.emit('updateRoomsList', {
          error: 'Room title already exists!'
        });
      } else {
        Room.create({
          title: title,
          CurrentMap: CurrentMap
        }, function(err, newRoom) {
          if (err) throw err;
          socket.emit('GoToRoom', newRoom); //馬上創建馬上進入房間
          socket.broadcast.emit('updateRoomsList', {
            newRoom: newRoom
          });
          socket.broadcast.emit('RoomPlayerNum', newRoom); //更新大廳的房間人數
        });
      };
    });

  });


  socket.on('check', function(roomId) {
    Room.findRoomId(roomId, function(err, room) {
      if (err) throw err;
      try {

        if (room.connections.length == 4) { // 限制人數
          socket.emit("full");
        } else {
          socket.emit("GoToRoom", room);
        }

      } catch (e) {}

    })
  })


  socket.on('newMessage', function(message) {
    socket.broadcast.emit('addMessage', message);
  });

});

// room namespace -> ”準備房間”的空間
io.of('/rooms').on('connection', function(socket) {

  socket.on('join', function(roomId) {
    Room.findRoomId(roomId, function(err, room) {
      if (err) throw err;

      Room.changeRoomStatus(room, 0) //更改房間狀態

      Room.addUser(room, socket, function(err, newRoom) {
        io.of('/lobby').emit('RoomPlayerNum', newRoom); //更新大廳的房間人數
        // Join the room channel
        socket.join(newRoom.id);
        // console.log(newRoom); //把user加入connections這個欄位

        // Room.getUsers(newRoom, socket, function(err, users, cuntUserInRoom) {
        //   if (err) throw err;
        //   socket.emit('updateUsersList', users, true);
        //   if (cuntUserInRoom === 1) {
        //     socket.broadcast.to(newRoom.id).emit('updateUsersList', users[users.length - 1]);
        //   }
        // });
        newRoom.connections.forEach((users, i) => {
          socket.emit('updateUsersList', users, i);
        });

        User.getUserById(socket.request.session.passport.user, function(err, user) {
          player = { //這裏這樣做是為了參數名稱同步，是因為user的id是存在room(資料庫)的connections的userId裡，但是在User(資料庫)的話是存在_id裡
            userId: user._id,
            name: user.name
          }
          socket.broadcast.to(newRoom.id).emit('updateUsersList', player, newRoom.connections.length - 1);
        })


      })

    })
  });

  socket.on('newMessage', function(roomId, message) {
    socket.broadcast.to(roomId).emit('addMessage', message);
  });

  socket.on('start', function(status, roomId) {
    Room.findRoomId(roomId, function(err, room) {
      Room.changePlayerStatus(room, status, socket) //更改玩家狀態
      var playerId = socket.request.session.passport.user;
      io.of('/rooms').in(roomId).emit("ready", playerId);
    })
  })


  socket.on('ready', function(roomId) {
    Room.findRoomId(roomId, function(err, room) {
      if (room.connections.length == 1) { //這裡決定”準備房間”要幾個人都按開始鍵才會進入”遊戲房間“
        const result = room.connections.every(x => x.playerStatus == 1); //核對是否房內四人的遊戲狀態都是1(準備中)，如果符合，result會為true
        if (result) {
          GameRoom.create({ //創造”遊戲房間“的資料庫
            title: room.title,
            readyRoomId: room.id
          }, function(err, newGameRoom) {
            if (err) throw err;
            // console.log("GameRoom成功創造！");
            // console.log(newGameRoom);
            room.connections.forEach((item, i) => { //把room資料庫的connections塞入gameroom資料庫
              newGameRoom.connections.push(item);
            });
            newGameRoom.save();

          })
          Room.changeRoomStatus(room, 1) //更改房間狀態

          io.of('/lobby').emit("changeRoomStatus", room, 1);
          //房間準備問題
          io.of('/rooms').in(roomId).emit("go");
        }
      }
    })
  })

  socket.on('MapChange', function(roomId, mapName) {
    // console.log(roomId, "_____", mapName);
    Room.findRoomId(roomId, function(err, room) {
      Room.changeMap(room, mapName)
    })
  })



  socket.on('disconnect', function() {

    Room.removeUser(socket, function(err, room, userId, cuntUserInRoom) {
      console.log(`${userId}移除`);

      io.of('/lobby').emit('RoomPlayerNum', room); //更新大廳的房間人數

      socket.leave(room.id);

      socket.broadcast.to(room.id).emit('removeUser');
      room.connections.forEach((user, i) => {
        socket.broadcast.to(room.id).emit('updateUsersList', user, i);
      });

      // setTimeout(function() { //用timeout延遲一下，這樣自己的才會更新到
      //   Room.removeRoom(room.id, function(err, RemoveMessage) { //如果房間人數是零，就刪掉房間
      //     if (err) throw err;
      //     if (RemoveMessage) {
      //       io.of('/lobby').emit('removeRoom', room.id);
      //     }
      //   });
      // }, 200);


    });
  });
});




// room namespace -> ”遊戲房間“的空間
io.of('/game').on('connection', function(socket) {
  socket.on("joinGame", function(roomId) {
    GameRoom.findRoom({
      readyRoomId: roomId
    }, function(err, gameroom) {
      if (err) throw err;
      // GameRoom.addUser(gameroom, socket, function(err, newRoom) {});
    })
    socket.join(roomId);
  });


  socket.on('newMessage', function(roomId, message) {
    io.of('/game').in(roomId).emit('addMessage', message);
  });

  socket.on("script", function(script) {
    //從伺服端拿到script的資訊

    cpp.runSource(script.script, {
      stdin: script.input
    }, (err, result) => {
      if (err) {
        console.log("err:", err);
      } else {
        console.log("res:", result);
        socket.emit("answer", result);
      }
    });
  });
  //動作同步
  socket.on("move", function(roomId, str, userNum) {
    io.of('/game').in(roomId).emit("action", str, userNum);
  });

  socket.on('disconnect', function() {
    // GameRoom.removeUser(socket, function(err, gameroom, userId, cuntUserInRoom) {
    //   socket.leave(gameroom.id);
    //   if (cuntUserInRoom === 1) {
    //      console.log("移除");
    //   }

    // GameRoom.removeRoom(gameroom.id, function(err, RemoveMessage) { //如果房間人數是零，就刪掉房間
    //   if (err) throw err;
    //   if (RemoveMessage) {
    //     // console.log("remove gameroom");
    //   }
    // });

    // })
  });


});
