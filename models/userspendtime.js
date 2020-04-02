// model/users.js
//先載入我們要的library
var mongoose = require('mongoose')
var bcrypt = require('bcryptjs')

//創造資料庫需要的欄位(schema)
var UserSpendTimeSchema = mongoose.Schema({
    username: { type: String, index: true },
    name: { type: String },
    email: { type: String },
    level:{ type: String},
    starNumber:{ type: Number},
    startplay: { type: Date },
    endplay: { type: Date },
    Totalspendtime:{ type: Number }
})

var UserSpendTime = module.exports = mongoose.model('UserSpendTime', UserSpendTimeSchema)

module.exports.createUserSpendTimeState = function (newUserSpendTimeState, callback) {
    newUserSpendTimeState.save(callback)
}

module.exports.getAllUserSpendTimeState = function (callback) {
    var query =  { username: { $ne: "" }}
    UserUserSpendTime.find(query, callback)
}

