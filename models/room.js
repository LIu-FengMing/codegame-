var mongoose = require('mongoose');
var User = require('../models/user');

var RoomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  connections: {
    type: [{
      userId: String,
      name: String,
      socketId: String,
      playerStatus: {
        type: Number,
        "default": 0 //0是(未準備)，１是(已準備)
      }
    }]
  },
  roomStatus: { //0是(未開始)，１是(已開始)
    type: Number,
    "default": 0
  },
  CurrentMap: {
    type: String,
    required: true
  }
});

var roomModel = module.exports = mongoose.model('room', RoomSchema);



module.exports.create = function(data, callback) {
  var newRoom = new roomModel(data);
  newRoom.save(callback);
};

module.exports.findAllRoom = function(data, callback) {
  roomModel.find(data, callback);
}

module.exports.findRoom = function(data, callback) {
  roomModel.findOne(data, callback)
}


module.exports.findRoomId = function(id, callback) {
  roomModel.findById(id, callback);
}



module.exports.addUser = function(room, socket, callback) {

  // Get current user's id
  var user_ID = socket.request.session.passport.user;


  // Get current user's name
  User.getUserById(user_ID, function(err, user) {
    if (err) throw err;
    var conn = {
      userId: user_ID,
      name: user.name,
      socketId: socket.id
    };

    try {
      room.connections.push(conn);
      room.save(callback);
    } catch (e) {}

  })

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

  // Get current user's id
  var userId = socket.request.session.passport.user;

  roomModel.find(function(err, rooms) { //每個房間的資訊
    if (err) {
      return callback(err);
    }
    //console.log(rooms);
    rooms.every(function(room) {
      var pass = true,
        cunt = 0,
        target = 0;
      room.connections.forEach(function(conn, i) {
        if (conn.userId === userId) {
          cunt++;
        }
        if (conn.socketId === socket.id) {
          pass = false, target = i;
        }
      });

      if (!pass) {
        if (room.roomStatus == 0) { //如果房間狀態是0(未開始)
          room.connections.id(room.connections[target]._id).remove();
        }
        // room.connections.id(room.connections[target]._id).remove();
        room.save(function(err) {
          callback(err, room, userId, cunt);
        });
      }
      return pass;
    });
  });
}

module.exports.changePlayerStatus = function(room, status, socket) {

  var user_Id = socket.request.session.passport.user;

  roomModel.updateOne({
    _id: room._id,
    "connections.userId": user_Id
  }, {
    $set: {
      "connections.$.playerStatus": status
    }
  }, function(err, message) {
    // console.log(message);
  })
}


module.exports.changeRoomStatus = function(room, status) {
  roomModel.updateOne({
    _id: room._id,
  }, {
    $set: {
      "roomStatus": status
    }
  }, function(err, message) {
    // console.log(message);
  })
}

module.exports.changeMap = function(room, map) {

  roomModel.updateOne({
    _id: room._id,
  }, {
    $set: {
      "CurrentMap": map
    }
  }, function(err, message) {
    // console.log(message);
  })
}








module.exports.removeRoom = function(data, callback) {
  roomModel.findRoomId(data, function(err, rooms) {
    if (err) {
      return callback(err);
    }


    try {

      if (rooms.connections.length == 0) {
        rooms.remove();
        console.log(rooms.title + "(準備房間)--->移除");
        return callback(err, true)
      } else {
        console.log(rooms.title + "(準備房間)--->還有人");
        return callback(err, false)
      }

    } catch (e) {}


  });
}


module.exports.removeAllUser = function(data, callback) {
  console.log("removeAllUser-------------------");
  roomModel.findRoomId(data, function(err, rooms) {
    console.log("removeAllUser-----------");
    rooms.connections.forEach(function(conn, i) {
      rooms.connections.id(rooms.connections[i]._id).remove();
      rooms.save();
    })
  })

}
