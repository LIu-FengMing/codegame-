// model/users.js
//先載入我們要的library
var mongoose = require('mongoose')
var bcrypt = require('bcryptjs')

//創造資料庫需要的欄位(schema)
var UserSchema = mongoose.Schema({
  isadmin: {
    type: Boolean,
    default: false
  },
  GameStaus:{
    type: String,
    default: "normal"
  },
  username: {
    type: String,
    index: true
  },
  password: {
    type: String
  },
  email: {
    type: String
  },
  name: {
    type: String
  },
  levelUpLevel: {
    type: Number,
    "default": 0
  },
  weaponLevel: {
    type: Number,
    "default": 0
  },
  armorLevel: {
    type: Number,
    "default": 0
  },
  starNum: {
    type: Number,
    "default": 0
  },
  EasyEmpire: {
    codeHighestLevel: {
      type: Number,
      "default": 0
    },
    blockHighestLevel: {
      type: Number,
      "default": 0
    },
    codeLevel: {
      type: Array,
      "default": []
    },
    blockLevel: {
      type: Array,
      "default": []
    }
  },
  MediumEmpire: {
    HighestLevel: {
      type: Number,
      "default": 0
    },
    codeLevel: {
      type: Array,
      "default": []
    }
  },
  createMap: {
    type: Array,
    "default": []
  },
  finishMapNum: {
    type: Array,
    "default": []
  },
  userstatus: {
    type: Number,
    "default": 0
  },
  canCreateMapPermission: {
    type: Boolean,
    "default": false
  },
  //以下宜靜 2020.05.18
  Logintime: { type: Array, "default": [] },
  Rscore: { type: Number, "default": 0},
  Fscore: {type: Number, "default": 0},
  Mscore: { type: Number, "default": 0},
  Pscore: { type: Number, "default": 0},
  LearnerType: { type: String , "default": ""}
  //以上宜靜 2020.05.18
})

var User = module.exports = mongoose.model('User', UserSchema)

// 建立createUser方法, 然後用bcrypt加密 + 存檔
module.exports.createUser = function(newUser, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      newUser.password = hash
      newUser.save(callback)
    })
  })
}
// getUSER
module.exports.getUser = function(userID, callback) {
  var query = {
    _id: {
      $ne: userID
    }
  }
  User.find(query, callback)
}
// getUserByUsername, 用username來找使用者
module.exports.getUserByUsername = function(username, callback) {
  var query = {
    username: username
  }
  User.findOne(query, callback)
}
// getUserByUsername, 用email來找使用者
module.exports.getUserByEmail = function(email, callback) {
  var query = {
    email: email
  }
  User.findOne(query, callback)
}
// getUserById, 用id來找使用者
module.exports.getUserById = function(id, callback) {
  User.findById(id, {
    __v: 0
  }, callback)
}


// module.exports.getUserByAdim = function(id, callback) {
//   User.findById(id, {
//     __v: 0
//   }, callback)
// }




// comparePassword, 當使用者登入的時候我們要比對登入密碼跟我們資料庫密碼相同
module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if (err) throw err
    callback(null, isMatch)
  });
}

module.exports.givePassBcrypt = function(candidatePassword, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(candidatePassword, salt, function(err, hash) {
      callback(null, hash)
    })
  })
}

// updateUserStatus, 更新使用者狀態
module.exports.updateUserStatus = function(id, userstatus, callback) {
  var query = {
    _id: id
  }
  var setquery = {
    userstatus: userstatus
  }
  User.updateOne(query, setquery, callback);
}

// updateUserStatus, 更新使用者狀態
module.exports.updateUserCreateMapPermission = function(id, canCreateMapPermission, callback) {
  var query = {
    _id: id
  }
  var setquery = {
    canCreateMapPermission: canCreateMapPermission
  }
  User.updateOne(query, setquery, callback);
}

// updatePassword, 更新密碼
module.exports.updatePassword = function(username, candidatePassword, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(candidatePassword, salt, function(err, hash) {
      var query = {
        username: username
      }
      var setquery = {
        password: hash
      }
      User.updateOne(query, setquery, callback);
    })
  })
}
// updateResetEquip, 重整
module.exports.updateResetEquip = function(id, callback) {
  var query = {
    _id: id
  }
  var setquery = {
    armorLevel: 0,
    weaponLevel: 0,
    levelUpLevel: 0
  }
  User.updateOne(query, setquery, callback);
}
// updatePassword, 更新武器等級
module.exports.updateWeaponLevel = function(id, newLevel, levelUpLevel, callback) {
  var query = {
    _id: id
  }


  var setquery = {
    weaponLevel: newLevel,
    levelUpLevel: levelUpLevel
  }
  User.updateOne(query, setquery, callback);
}
module.exports.updateArmorLevel = function(id, newLevel, levelUpLevel, callback) {
  var query = {
    _id: id
  }
  var setquery = {
    armorLevel: newLevel,
    levelUpLevel: levelUpLevel
  }
  User.updateOne(query, setquery, callback);
}

module.exports.findLevel = function(id, Level, callback) {
  var query = {
    _id: id
  }
  var setquery = {
    armorLevel: newLevel
  }
  User.updateOne(query, setquery, callback);
}


module.exports.updateEasyEmpireById = function(id, EasyEmpire, callback) {
  var query = {
    _id: id
  }
  var setquery = {
    EasyEmpire: EasyEmpire
  }
  User.updateOne(query, setquery, callback);

}
module.exports.updateMediumEmpireById = function(id, MediumEmpire, callback) {
  var query = {
    _id: id
  }
  var setquery = {
    MediumEmpire: MediumEmpire
  }
  User.updateOne(query, setquery, callback);

}
module.exports.updateStarNumById = function(id, starNum, callback) {
  var query = {
    _id: id
  }
  var setquery = {
    starNum: starNum
  }
  User.updateOne(query, setquery, callback);

}
module.exports.updatefinishMapNumById = function(id, finishMapNum, callback) {
  var query = {
    _id: id
  }
  var setquery = {
    finishMapNum: finishMapNum
  }
  User.updateOne(query, setquery, callback);

}

// 以下宜靜 2020.05.18
//updateUserLogintime 更新使用者登入次數
module.exports.updateUserLogintime = function(id, Logintime, callback) {
  var query = {
    _id: id
  }
  var setquery = {
      Logintime: Logintime
  }
  User.updateOne(query, setquery, callback);
}

//updateRscore 更新R的評分值
module.exports.updateRscore = function(email, Rscore, callback) {
  var query = {
      email: email
  }
  var setquery = {
      Rscore: Rscore
  }
  User.updateOne(query, setquery, callback);
}

//updateFscore 更新F的評分值
module.exports.updateFscore = function(email, Fscore, callback) {
  var query = {
      email: email
  }
  var setquery = {
      Fscore: Fscore
  }
  User.updateOne(query, setquery, callback);
}

//updateMscore 更新M的評分值
module.exports.updateMscore = function(email, Mscore, callback) {
  var query = {
      email: email
  }
  var setquery = {
      Mscore: Mscore
  }
  User.updateOne(query, setquery, callback);
}

//updatePscore 更新P的評分值
module.exports.updatePscore = function(email, Pscore, callback) {
  var query = {
      email: email
  }
  var setquery = {
      Pscore: Pscore
  }
  User.updateOne(query, setquery, callback);
}

//updateLearnerType 更新玩家類型
module.exports.updateLearnerType = function(email, LearnerType, callback) {
  var query = {
      email: email
  }
  var setquery = {
      LearnerType: LearnerType
  }
  User.updateOne(query, setquery, callback);
}



// 得到所有玩家資料
module.exports.getAllUser = function (callback) {
  var query =  { username: { $ne: "" }}
  User.find(query, callback)
}

// 以上宜靜 2020.05.18