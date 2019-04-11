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
    updateDate: { type: String, "default": "" },
    check: { type: Boolean, "default": false },
    postDate: { type: String, "default": "" },
    postStage: { type: Number, "default": 0 }, //0未發布  1代發布  2發布  3下架
    avgScore: { type: Number, "default": 0 },
    score: { type: Array, "default": [] }
})

var MapRecord = module.exports = mongoose.model('Map', MapSchema)

module.exports.createMap = function (newMap, callback) {
    newMap.save(callback)
}
// getMap
module.exports.getMap = function (userID, callback) {
    var query = { userID: { $ne: userID }, check: true }
    MapRecord.find(query, callback).sort({ requireStar: 1 })
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
        mapName: scriptData.mapName,
        mapIntroduction: scriptData.mapIntroduction,
        mapDescription: scriptData.mapDescription,
        map: scriptData.map,
        requireStar: scriptData.requireStar,
        updateDate: scriptData.updateDate,
        postDate: "",
        postStage:scriptData.postStage,
        check: false
    }
    // console.log("scriptData:",scriptData);
    // console.log("setquery:",setquery);
    MapRecord.updateOne(query, setquery, callback);

}
module.exports.updateMapCheckById = function (id, callback) {
    var date = new Date();
    var query = { _id: id }
    var setquery = {
        check: true,
        checkDate: date.toString()
    }
    MapRecord.updateOne(query, setquery, callback);

}
module.exports.updateMapScoreById = function (id, score, avgscore, callback) {
    var query = { _id: id }
    var setquery = {
        score: score,
        avgScore: avgscore
    }
    MapRecord.updateOne(query, setquery, callback);

}
module.exports.ShelfMapMapById = function (id, callback) {
    var date=new Date();
    var postDate=date.toString();
    var query = { _id: id }
    var setquery = {
        postStage:2,
        postDate:postDate
    }
    MapRecord.updateOne(query, setquery, callback);

}

module.exports.unShelfMapMapById = function (id, callback) {
    var query = { _id: id }
    var setquery = {
        postStage:3,
        postDate:""
    }
    MapRecord.updateOne(query, setquery, callback);

}

module.exports.deleteMapById = function (id, callback) {
    var setquery = { _id: id }
    MapRecord.remove(setquery,callback)
}