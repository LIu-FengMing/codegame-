// model/users.js
//先載入我們要的library
var mongoose = require('mongoose')
var bcrypt = require('bcryptjs')

//創造資料庫需要的欄位(schema)
var UserSchema = mongoose.Schema({
    username: { type: String, index: true },
    name: { type: String },
    email: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
})

var UserLogin = module.exports = mongoose.model('UserLogin', UserSchema)

module.exports.createUserLoginState = function (newUserLoginState, callback) {
    newUserLoginState.save(callback)
}