var express = require('express');
var router = express.Router();

var User = require('../models/user')
var MapRecord = require('../models/map')
var DictionaryRecord = require('../models/dictionary')
var EquipmentRecord = require('../models/equipment')
var GameMapRecord = require('../models/gameMap')

var fs = require('fs');

router.post('/onloadImg', function (req, res, next) {

    console.log(req.body.imgName);
    var imgName = req.body.imgName;
    var imgData = req.body.imgData;
    // console.log(imgData);
    // res.json({user:123});
    // //過濾data:URL
    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer.from(base64Data, 'base64');
    fs.writeFile("../codegame-/public/img/GameLevel/" + imgName, dataBuffer, function (err) {
        if (err) {
            return res.json({ state: true, err: err });
        } else {
            return res.json({ state: true, path: "GameLevel/" + imgName });
        }
    });
});

router.get('/kuruma', ensureAuthenticated, function (req, res, next) {
    // console.log(req.user)
    res.render('home/kuruma', {
        user: req.user.username
    });
});

router.get('/pruss', ensureAuthenticated, function (req, res, next) {
    // console.log(req.user)
    res.render('home/pruss', {
        user: req.user.username
    });
});

router.get('/gameView_text', ensureAuthenticated, function (req, res, next) {
    // console.log(req.user)
    res.render('home/gameView_text', {
        user: req.user.username
    });
});
router.post('/gameView_text', function (req, res, next) {
    // Parse Info
    var type = req.body.type
    //-----關卡紀錄 ------
    if (type == "codeLevelResult" || type == "blockLevelResult") {
        console.log("codeLevelResult");
        var id = req.user.id;
        var empire = req.body.Empire
        var data = {
            level: req.body.level,
            HighestStarNum: req.body.StarNum,
            challengeLog: [{
                submitTime: req.body.submitTime,
                result: req.body.result,
                code: req.body.code,
                srarNum: req.body.StarNum,
                instructionNum: req.body.instructionNum
            }]
        };
        codeLevelResult(id,empire,data,res);
    }
    else {
    }
});


router.get('/gameView_blockly', ensureAuthenticated, function (req, res, next) {
    // console.log(req.user)
    res.render('home/gameView_blockly', {
        user: req.user.username
    });
});
router.post('/gameView_blockly', function (req, res, next) {
    // Parse Info
    var type = req.body.type
    //-----關卡紀錄 ------
    if (type == "blockLevelResult" || type == "codeLevelResult") {
        var id = req.user.id;
        var empire = req.body.Empire
        var data = {
            level: req.body.level,
            HighestStarNum: req.body.StarNum,
            challengeLog: [{
                submitTime: req.body.submitTime,
                result: req.body.result,
                code: req.body.code,
                srarNum: req.body.StarNum,
                instructionNum: req.body.instructionNum
            }]
        };
        codeLevelResult(id,empire,data,res);
    }
    else {

    }

});

router.get('/managementModifyMap', ensureAuthenticated, function (req, res, next) {
    // console.log(req.user)
    res.render('backstage/managementModifyMap', {
        user: req.user.username
    });
});

router.get('/managementUser', ensureAuthenticated, function (req, res, next) {
    // console.log(req.user)
    if (!(req.user.username == "NKUSTCCEA"||req.user.username == "teacher")) { //如有其他管理者 在這加
        res.redirect('/login')
    }
    res.render('backstage/managementUser', {
        user: req.user.username
    });
});
router.post('/managementUser', function (req, res, next) {
    // Parse Info
    var type = req.body.type;
    if (type == "LoadUser") {
        User.getUser(req.user.id, function (err, users) {
            if (err) throw err;
            res.json(users);
        })
    }
    else if (type == "changeUserStatus") {
        var userstatus = req.body.userstatus;
        var userId = req.body.userId;
        User.updateUserStatus(userId, userstatus, function (err, users) {
            if (err) throw err;
            res.json(users);
        })
    }

});

router.get('/management', ensureAuthenticated, function (req, res, next) {
    // console.log(req.user)
    if (!(req.user.username == "NKUSTCCEA"||req.user.username == "teacher")) { //如有其他管理者 在這加
        res.redirect('/login')
    }
    res.render('backstage/management', {
        user: req.user.username
    });
});

router.get('/managementStatistics', ensureAuthenticated, function (req, res, next) {
    // console.log(req.user)
    if (!(req.user.username == "NKUSTCCEA"||req.user.username == "teacher")) { //如有其他管理者 在這加
        res.redirect('/login')
    }
    res.render('backstage/managementStatistics', {
        user: req.user.username
    });
});
router.post('/managementStatistics', function (req, res, next) {
    // Parse Info
    var type = req.body.type;
    if (type == "readAllPlay") {
        User.getUser(req.user.id, function (err, users) {
            if (err) throw err;
            res.json(users);
        })
    }
    else {

    }

});

router.get('/', ensureAuthenticated, function (req, res, next) {
    // console.log(req.user)

    User.getUserById(req.user.id, function (err, user) {
        if (err) throw err;
        if (!(req.user.username == "NKUSTCCEA"||req.user.username == "teacher")) { //如有其他管理者 在這加
            res.redirect('/home')
        }

        var openLokCastle = false;
        var codeLevel = -1;
        for (let index = 0; index < user.EasyEmpire.codeLevel.length; index++) {
            const element = user.EasyEmpire.codeLevel[index];
            if (parseInt(element.level) > codeLevel && element.HighestStarNum > 0) {
                codeLevel = parseInt(element.level);
                if (parseInt(element.level) >= 23) {
                    openLokCastle = true;
                    break;
                }
                else {
                    // console.log(codeLevel, parseInt(element.level));
                }
            }
        }
        var blockLevel = -1;
        for (let index = 0; index < user.EasyEmpire.blockLevel.length; index++) {
            const element = user.EasyEmpire.blockLevel[index];
            if (parseInt(element.level) > blockLevel && element.HighestStarNum > 0) {
                blockLevel = parseInt(element.level);
                if (parseInt(element.level) >= 23) {
                    openLokCastle = true;
                    break;
                }
                else {
                    // console.log(blockLevel, parseInt(element.level));
                }
            }
        }
        var codeLevel = user.EasyEmpire.codeLevel.length;
        var blockLevel = user.EasyEmpire.blockLevel.length;
        var totalLevel = Math.max(codeLevel, blockLevel);
        var lock = "unCastle_code";
        if (openLokCastle) {
            lock = "castle_code";
        }

        res.render('home/homeByManage', {
            user: req.user.username,
            castlelock: lock,
        });
    })
});

router.get('/home', ensureAuthenticated, function (req, res, next) {
    // console.log(req.user)

    User.getUserById(req.user.id, function (err, user) {
        if (err) throw err;
        if ((req.user.username == "NKUSTCCEA"||req.user.username == "teacher")) { //如有其他管理者 在這加
            return res.redirect('/management');
        }
        var openLokCastle = false;
        var codeLevel = -1;
        for (let index = 0; index < user.EasyEmpire.codeLevel.length; index++) {
            const element = user.EasyEmpire.codeLevel[index];
            if (parseInt(element.level) > codeLevel && element.HighestStarNum > 0) {
                codeLevel = parseInt(element.level);
                if (parseInt(element.level) >= 23) {
                    openLokCastle = true;
                    break;
                }
                else {
                    console.log(codeLevel, parseInt(element.level));
                }
            }
        }
        var blockLevel = -1;
        for (let index = 0; index < user.EasyEmpire.blockLevel.length; index++) {
            const element = user.EasyEmpire.blockLevel[index];
            if (parseInt(element.level) > blockLevel && element.HighestStarNum > 0) {
                blockLevel = parseInt(element.level);
                if (parseInt(element.level) >= 23) {
                    openLokCastle = true;
                    break;
                }
                else {
                    console.log(blockLevel, parseInt(element.level));
                }
            }
        }
        var codeLevel = user.EasyEmpire.codeLevel.length;
        var blockLevel = user.EasyEmpire.blockLevel.length;
        var totalLevel = Math.max(codeLevel, blockLevel);
        var lock = "unCastle_code";
        if (openLokCastle) {
            lock = "castle_code";
        }
        return res.render('home/home', {
            user: req.user.username,
            castlelock: lock
        });
    })
});

router.get('/logout', function (req, res, next) {
    req.logout()
    req.flash('success_msg', 'You are logged out')
    res.redirect('/login')
})

router.post('/loadGameMap', function (req, res, next) {
    console.log(req.body);
    console.log("loadGameMap post--------");

    var levelId = req.body.gameLevel;
    console.log(req.body.gameLevel);
    GameMapRecord.getMapByLevel(levelId, function (err, mapData) {
        res.json(mapData);
    });

});
router.post('/updateGameMap', function (req, res, next) {
    console.log(req.body);
    console.log("loadGameMap post--------");

    var levelId = req.body.gameLevel;
    var scriptData = JSON.parse(req.body.data);
    // console.log(scriptData);
    GameMapRecord.updateMapByLevel(levelId, scriptData, function (err, mapData) {
        return res.json(mapData);
    });
});

router.post('/loadGameMapData', function (req, res, next) {
    var start = 0, end = 50;
    GameMapRecord.getMap(function (err, mapData) {
        // res.json(mapData);
        if (err)
            console.log(err);

        var returnData = [];
        for (let index = start; index < end; index++) {
            var element = mapData[index];
            // console.log(element.level);

            for (let entry = 0; entry < element.data.length; entry++) {
                var entryItem = element.data[entry];
                // console.log(entryItem);
                if (entryItem.versionID == element.versionID) {
                    returnData.push(
                        entryItem.description
                    );
                    break;
                }
            }
        }

        returnData = returnData.sort(function (a, b) {
            return a.level > b.level ? 1 : -1;
        });
        res.json(returnData);
    })

});

router.post('/loadThisLevelGameMapData', function (req, res, next) {
    var level = req.body.level
    var gameMode = req.body.gameMode   // code  blocky
    console.log(req.body, level, gameMode);
    var start = 0, end = 50;
    if(gameMode=="code"){
        var mainDescription="mainCodeDescription";
    }
    else{
        var mainDescription="mainBlockyDescription";
        // end=24;
    }
    GameMapRecord.getMap(function (err, mapData) {
        // res.json(mapData);
        if (err)
            console.log(err);
        var returnData = [];
        for (let index = start; index < end; index++) {
            var element = mapData[index];
            if (gameMode == "blocky" && element.level>=24) {
                continue;
            }
            if (element.level != level) {
                returnData.push({
                    level: element.level + 1
                })
                continue;
            }
            for (let entry = 0; entry < element.data.length; entry++) {
                var entryItem = element.data[entry];
                // console.log(entryItem);
                if (entryItem.versionID == element.versionID) {
                    returnData.push(
                        entryItem[mainDescription]
                    );
                    break;
                }
            }
        }

        console.log(returnData);
        returnData = returnData.sort(function (a, b) {
            return a.level > b.level ? 1 : -1;
        });
        res.json(returnData);
    })

});

router.post('/loadThisLevelGameMapMap', function (req, res, next) {
    var level = req.body.level
    console.log(req.body, level);
    var start = 0, end = 50;
    GameMapRecord.getMap(function (err, mapData) {
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
                // console.log(entryItem);
                if (entryItem.versionID == element.versionID) {
                    return res.json(entryItem.map);
                }
            }
        }
    })

});
router.post('/changeUserCreateMapPermission', function (req, res, next) {
    var userId = req.body.userId
    var canCreateMapPermission = req.body.canCreateMapPermission
    User.updateUserCreateMapPermission(userId, canCreateMapPermission, function (err, users) {
        if (err) throw err;
        res.json(users);
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

function codeLevelResult(id,empire,data,res){
    User.getUserById(id, function (err, user) {
        if (err) throw err;
        if (empire == "EasyEmpire") {
            var EasyEmpire = user.EasyEmpire
            var starChange = false, starChangeNum = 0;
            if (EasyEmpire.codeHighestLevel == data.level && data.HighestStarNum > 0) {
                EasyEmpire.codeHighestLevel = parseInt(EasyEmpire.codeHighestLevel) + 1;
                starChange = true;
                starChangeNum = data.HighestStarNum;
            }
            var codeLevel = EasyEmpire.codeLevel
            var level = false, levelnum = 0;
            for (var i = 0; i < codeLevel.length; i++) {
                if (codeLevel[i].level == data.level) {
                    level = true;
                    levelnum = i;
                    break;
                }
            }
            if (level) {
                if (codeLevel[levelnum].HighestStarNum < data.HighestStarNum) {
                    starChange = true;
                    starChangeNum = data.HighestStarNum - EasyEmpire.codeLevel[levelnum].HighestStarNum;
                    EasyEmpire.codeLevel[levelnum].HighestStarNum = data.HighestStarNum;

                }
                EasyEmpire.codeLevel[levelnum].challengeLog.push(data.challengeLog[0]);
            }
            else {
                EasyEmpire.codeLevel.push(data);
            }
            if (starChange) {
                var starNum = user.starNum;
                starNum = parseInt(starNum) + parseInt(starChangeNum);
                User.updateStarNumById(id, starNum, function (err, level) {
                    if (err) throw err;
                    User.updateEasyEmpireById(id, EasyEmpire, function (err, level) {
                        if (err) throw err;
                        User.getUserById(id, function (err, user) {
                            if (err) throw err;
                            res.json(user);

                        })
                    })
                })
            }
            else {
                User.updateEasyEmpireById(id, EasyEmpire, function (err, level) {
                    if (err) throw err;
                    User.getUserById(id, function (err, user) {
                        if (err) throw err;
                        res.json(user);

                    })
                })
            }
        }
        else if (empire == "MediumEmpire") {
            var MediumEmpire = user.MediumEmpire
            var starChange = false, starChangeNum = 0;
            if (MediumEmpire.HighestLevel == data.level && data.HighestStarNum > 0) {
                MediumEmpire.HighestLevel = parseInt(MediumEmpire.HighestLevel) + 1;
                starChange = true;
                starChangeNum = data.HighestStarNum;
            }
            var codeLevel = MediumEmpire.codeLevel
            var level = false, levelnum = 0;
            for (var i = 0; i < codeLevel.length; i++) {
                if (codeLevel[i].level == data.level) {
                    level = true;
                    levelnum = i;
                    break;
                }
            }
            if (level) {
                if (parseInt(codeLevel[levelnum].HighestStarNum) < parseInt(data.HighestStarNum)) {
                    starChange = true;
                    starChangeNum = parseInt(data.HighestStarNum) - parseInt(MediumEmpire.codeLevel[levelnum].HighestStarNum);
                    MediumEmpire.codeLevel[levelnum].HighestStarNum = data.HighestStarNum;
                }
                MediumEmpire.codeLevel[levelnum].challengeLog.push(data.challengeLog[0]);
            }
            else {
                MediumEmpire.codeLevel.push(data);
            }
            if (starChange) {
                var starNum = user.starNum;
                starNum = parseInt(starNum) + parseInt(starChangeNum);
                User.updateStarNumById(id, starNum, function (err, level) {
                    if (err) throw err;
                    User.updateMediumEmpireById(id, MediumEmpire, function (err, level) {
                        if (err) throw err;
                        User.getUserById(id, function (err, user) {
                            if (err) throw err;
                            res.json(user);

                        })
                    })
                })
            }
            else {
                User.updateMediumEmpireById(id, MediumEmpire, function (err, level) {
                    if (err) throw err;
                    User.getUserById(id, function (err, user) {
                        if (err) throw err;
                        res.json(user);

                    })
                })
            }
        }
    })
}