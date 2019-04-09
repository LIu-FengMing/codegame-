// model/users.js
//先載入我們要的library
var mongoose = require('mongoose')

//創造資料庫需要的欄位(schema)
var MapSchema = mongoose.Schema({
    mapName: { type: String },
    mapIntroduction: { type: String },
    mapDescription: { type: String },
    author: { type: String },
    userID: { type: String },
    map: { type: String },
    requireStar: { type: Number, "default": 2 },
    createDate: { type: String, "default": "" },
    avgScore: { type: Number, "default": 0 },
    score: { type: Array, "default": [] },
    check:{ type: Boolean, "default": false }
})

var MapRecord = module.exports = mongoose.model('Map', MapSchema)

module.exports.createMap = function (newMap, callback) {
    newMap.save(callback)
}
// getMap
module.exports.getMap = function (userID, callback) {
    var query = { userID: { $ne : userID } ,check:true}
    MapRecord.find(query, callback).sort({requireStar:1})
}

// getMapById, 透過id找地圖
module.exports.getMapById = function (id, callback) {
    MapRecord.findById(id, callback)
}
// getMapByAuthor, 透過userID找地圖
module.exports.getMapByUserID = function (userID, callback) {
    var query = { userID: userID }
    MapRecord.find(query, callback)
}

// updateMap, 透過mapId更新地圖
module.exports.updateMapById = function (id, scriptData, callback) {
    var query = { _id: id }
    var setquery = {
        mapName:  scriptData.mapName ,
        mapIntroduction: scriptData.mapIntroduction ,
        mapDescription: scriptData.mapDescription ,
        map: scriptData.map ,
        requireStar: scriptData.requireStar ,
    }
    // console.log("scriptData:",scriptData);
    // console.log("setquery:",setquery);
    MapRecord.updateOne(query, setquery, callback);

}
module.exports.updateMapCheckById = function (id, callback) {
    var query = { _id: id }
    var setquery = {
        check:true
    }
    MapRecord.updateOne(query, setquery, callback);

}
module.exports.updateMapScoreById = function (id,score,avgscore, callback) {
    var query = { _id: id }
    var setquery = {
        score:score,
        avgScore:avgscore
    }
    MapRecord.updateOne(query, setquery, callback);

}
