var mongoose = require('mongoose');
var User = require('../models/user');

var GameRoomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  connections: {
    type: [{
      userId: String
    }]
  },readyRoomId:{
    type: String,
  }
});

var GameRoomSchemaModel = module.exports = mongoose.model('GameRoom', GameRoomSchema);


module.exports.create = function(data, callback) {
  var newGameRoom = new GameRoomSchemaModel(data);
  newGameRoom.save(callback);
};

module.exports.findAllRoom = function(data, callback) {
  GameRoomSchemaModel.find(data, callback);
}

module.exports.findRoom = function(data, callback) {
  GameRoomSchemaModel.findOne(data, callback)
}


module.exports.findRoomId = function(id, callback) {
  GameRoomSchemaModel.findById(id, callback);
}

module.exports.addUser = function(gameroom, socket, callback) {

  var user_ID = socket.request.session.passport.user;

  var conn = {
    userId: user_ID
  };

  try {
    gameroom.connections.push(conn);
    gameroom.save(callback);
  } catch (e) {}

}

module.exports.getUsers = function(room, socket, callback) {

  var users = [],
    vis = {},
    cunt = 0;
  var user_Id = socket.request.session.passport.user;


  // Loop on room's connections, Then:
  room.connections.forEach(function(conn) {

    // 1. Count the number of connections of the current user(using one or more sockets) to the passed room.
    if (conn.userId === user_Id) {
      cunt++;
    }

    // 2. Create an array(i.e. users) contains unique users' ids
    if (!vis[conn.userId]) {
      users.push(conn.userId);
    }
    vis[conn.userId] = true;
  });

  // Loop on each user id, Then:
  // Get the user object by id, and assign it to users array.
  // So, users array will hold users' objects instead of ids.
  var loadedUsers = 0;
  users.forEach(function(userId, i) {
    User.getUserById(userId, function(err, user) {
      if (err) {
        return callback(err);
      }
      users[i] = user;

      // fire callback when all users are loaded (async) from database
      if (++loadedUsers === users.length) {
        return callback(null, users, cunt);
      }
    });
  });
}



module.exports.removeUser = function(socket, callback) {


  var user_Id = socket.request.session.passport.user;

  GameRoomSchemaModel.find(function(err, GameRoom) { //每個房間的資訊
    if (err) {
      return callback(err);
    }
    GameRoom.every(function(gameroom) {
      var pass = true,
        cunt = 0,
        target = 0;
      gameroom.connections.forEach(function(conn, i) {
        if (conn.userId === user_Id) {
          cunt++;
          pass = false, target = i;
        }
      });

      if (!pass) {
        gameroom.connections.id(gameroom.connections[target]._id).remove();
        gameroom.save(function(err) {
          callback(err, gameroom, user_Id, cunt);
        });

      }
      return pass;
    });
  });
}









module.exports.removeRoom = function(data, callback) {
  GameRoomSchemaModel.findRoom(data, function(err, GameRoom) {
    if (err) {
      return callback(err);
    }
      GameRoom.remove();
      console.log(GameRoom.title + "(遊戲房間)--->移除");
      return callback(err)


  });
}
