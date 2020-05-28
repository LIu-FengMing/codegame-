var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Room = require('../models/room');
var GameRoom = require('../models/GameRoom');
var MutiplayerMap = require('../models/MutiplayerMap');

var list = [];


router.get('/lobby', ensureAuthenticated, function(req, res, next) {
  Room.findAllRoom(function(err, rooms) {
    if (err) throw err;
    res.render('dungeon/lobby', {
      rooms
    });
  });

});


router.post('/lobby', function(req, res, next) {
  // console.log(req.body);
  // Parse Info
  var type = req.body.type
  // console.log("home post--------");
  // console.log(req.body.type);
  // console.log("--------------");
  if (type == "init") {
    var id = req.user.id;

    User.getUserById(id, function(err, user) {
      if (err) throw err;
      list.push(user);
      res.json(user);
    })
  }


  if (type == "inituserlist") {
    var id = req.user.id;

    User.getUserById(id, function(err, user) {
      if (err) throw err;
      res.json(list);
    })
  }
});


router.get('/lobby/:id', ensureAuthenticated, function(req, res, next) {
  var roomId = req.params.id;
  Room.findRoomId(roomId, function(err, room) {
    if (err) throw err;
    if (!room) {
      return next();
    }
    res.render('dungeon/room', {
      user: req.user,
      room: room
    });
  });

});


router.get('/lobby/:id/dungeon', ensureAuthenticated, function(req, res, next) {
  var roomId = req.params.id;
  Room.findRoomId(roomId, function(err, room) {
    if (err) throw err;
    GameRoom.findRoom({
      title: room.title
    }, function(err, gameroom) {
      if (gameroom) {
        res.render('dungeon/dungeon', {
          room: room
        });
      } else {
        res.send("遊戲房間還沒創造");
      }
    })
  });
});

router.post('/lobby/:id/dungeon', ensureAuthenticated, function(req, res, next) {
  var type = req.body.type
  if (type == "init") {
    var id = req.user.id;
    User.getUserById(id, function(err, user) {
      if (err) throw err;
      list.push(user);
      res.json(user);
    })
  }

});

router.post('/lobby/:id/dungeon/loadThisGameRoomPlayer', function(req, res, next) {
  console.log('-------------------------------');
  console.log('POST:loadThisGameRoomPlayer');
  console.log('-------------------------------');
  var roomId = req.params.id;
  Room.findRoomId(roomId, function(err, room) {
    if (err) throw err;
    GameRoom.findRoom({
      title: room.title
    }, function(err, gameroom) {
      res.json(gameroom.connections);
    })
  });
});






router.post('/loadThisGameRoomLevelGameMapMap', function(req, res, next) {
  var level = req.body.level
  console.log('-------------------------------');
  console.log('POST:loadThisGameRoomLevelGameMapMap');
  console.log('-------------------------------');
  console.log(req.body, level);
  var start = 0,
    end = 5;
  MutiplayerMap.getMap(function(err, mapData) {
    // res.json(mapData);
    if (err)
      console.log(err);
    for (let index = start; index < end; index++) {
      var element = mapData[index];
      if (element.level != level) {
        continue;
      }

      for (let entry = 0; entry < element.data.length; entry++) {
        var entryItem = element.data[entry];
        if (entryItem.versionID == element.versionID) {
          return res.json(entryItem.map);
        }
      }

    }
  })

});

router.post('/lobby/:id/dungeon/delete', function(req, res, next) {
  gameRoomId = req.params.id;
  GameRoom.removeRoom({
    readyRoomId: gameRoomId
  }, function(err) { //如果房間人數是零，就刪掉房間
    console.log("遊戲房間刪除");
    console.log(req.params.id);
  });

  Room.removeAllUser(gameRoomId,function(err){
    console.log("準備房間人數刪除");
  })
});







module.exports = router;

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('error_msg', 'you are not logged in')
    res.redirect('/login')
  }
}
