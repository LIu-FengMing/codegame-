var express = require('express');
var router = express.Router();
// var passport = require('passport')
// var LocalStrategy = require('passport-local').Strategy

// var Equipment = require('../models/equipment')
var User = require('../models/user')
var UserSpendTime = require('../models/userspendtime') // 宜靜 2020.05.18
var MapRecord = require('../models/map')
var DictionaryRecord = require('../models/dictionary')
var EquipmentRecord = require('../models/equipment')
var GameMapRecord = require('../models/gameMap')
var testDict = require('../models/dataJson/dictionaryJson')
var testEquip = require('../models/dataJson/equipmentJson')

var multer = require("multer");
// 这里dest对应的值是你要将上传的文件存的文件夹
var upload = multer({ dest: '../public/testImg' });

var formidable = require('formidable');
var jqupload = require('jquery-file-upload-middleware');
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
router.post('/kuruma', function (req, res, next) {
    // Parse Info
    var type = req.body.type
    console.log("home post--------");
    console.log(req.body.type);
    console.log("--------------");
    if (type == "init") {
        var id = req.user.id;
        // console.log(req.user.id);
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            res.json(user);
        })
    }
    /**更新部分 */
    else if (type == "resetEquip") {
        var id = req.user.id;
        User.updateResetEquip(id, function (err, user) {
            if (err) throw err;
            console.log("up   :", user);
            User.getUserById(id, function (err, user) {
                if (err) throw err;
                res.json(user);
            })
        })
    }
    else if (type == "userMap") {
        MapRecord.getMapByUserID(req.user.id, function (err, map) {
            if (err) throw err;
            var dataMap = [];
            for (let indexM = 0; indexM < map.length; indexM++) {
                const element = map[indexM];
                if (element.check == true && element.postStage == 2) {
                    dataMap.push(element);
                }

            }
            res.json(dataMap);
            // console.log(req.user.id);
            // console.log(map);
            // res.json(map);
        })
    }
    /********* */
    else if (type == "weaponLevelup") {
        var id = req.user.id;
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            var weaponLevel = parseInt(user.weaponLevel) + 1
            var levelUpLevel = parseInt(user.levelUpLevel)
            // if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
            //     res.json({ err: "error" });
            // }
            // else {
            levelUpLevel += 1;
            User.updateWeaponLevel(id, weaponLevel, levelUpLevel, function (err, user) {
                if (err) throw err;
                // console.log("up   :", user);
                User.getUserById(id, function (err, user) {
                    if (err) throw err;
                    res.json(user);
                })
            })
            // }
        })
    }
    else if (type == "armorLevelup") {
        var id = req.user.id;
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            var armorLevelup = parseInt(user.armorLevel) + 1
            var levelUpLevel = parseInt(user.levelUpLevel)
            // if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
            //     res.json({ err: "error" });
            // }
            // else {
            levelUpLevel += 1;
            User.updateArmorLevel(id, armorLevelup, levelUpLevel, function (err, user) {
                if (err) throw err;
                // console.log("up   :", user);
                User.getUserById(id, function (err, user) {
                    if (err) throw err;
                    res.json(user);
                })
            })
            // }
        })
    }
    else if (type == "changePassword") {
        var id = req.user.id
        var password = req.body.password
        var oldPassword = req.body.oldPassword
        // console.log(password,oldPassword);

        User.getUserById(id, function (err, user) {
            if (err) throw err;
            if (user) {
                // console.log(user);
                User.comparePassword(oldPassword, user.password, function (err, isMatch) {
                    if (err) throw err
                    if (isMatch) {
                        req.flash('success_msg', 'you are updatePass now')
                        User.updatePassword(user.username, password, function (err, user) {
                            if (err) throw err;
                            // console.log("update :", user);
                        })
                        req.session.updatePassKey = null;
                        return res.json({ responce: 'sucesss' });
                    } else {
                        return res.json({ responce: 'failPassUndifine' });
                    }
                })
            } else {
                return res.json({ responce: 'error' });
            }
        })
        // res.redirect('/login')
    }
    else if (type == "loadDict") {
        DictionaryRecord.getDictionary(function (err, dict) {
            returnData = dict.sort(function (a, b) {
                return a.level > b.level ? 1 : -1;
            });
            res.json(returnData);

        });
    }
    else if (type == "loadEquip") {
        EquipmentRecord.getEquipment(function (err, equip) {
            res.json(equip[0]);

        });
    }
    else if (type == "updateEquip") {
        var seriJson = JSON.parse(req.body.seriJson)
        var armorLevel = seriJson.armorLevel;
        var weaponLevel = seriJson.weaponLevel;
        var levelUpLevel = seriJson.levelUpLevel;
        // console.log(seriJson);
        // console.log(armorLevel,weaponLevel,levelUpLevel);
        EquipmentRecord.updateEquipment(armorLevel, weaponLevel, levelUpLevel, function (err, dictResult) {
            if (err) throw err;
            res.json({ res: true });
        });
    }
    else if (type == "updateDict") {
        var dictType = req.body.dictType
        var dictNum = req.body.dictNum
        var dictValue = req.body.dictValue
        console.log(dictType, dictNum, dictValue);
        DictionaryRecord.getDictionary(function (err, dict) {
            if (err) throw err;
            var typeIndex = 0;
            for (let index = 0; index < dict.length; index++) {
                var element = dict[index];
                if (element.type == dictType) {
                    element.element[dictNum].value = dictValue;
                    typeIndex = index;
                    break;
                    // console.log(element);

                }
            }
            DictionaryRecord.updateDictionaryByType(dict[typeIndex].type, dict[typeIndex].element, function (err, dictResult) {
                if (err) throw err;
                res.json({ res: true });
            });
        });
    }
    else {

    }

});

router.get('/pruss', ensureAuthenticated, function (req, res, next) {
    // console.log(req.user)
    res.render('home/pruss', {
        user: req.user.username
    });
});
router.post('/pruss', function (req, res, next) {
    // Parse Info
    var type = req.body.type
    console.log("home post--------");
    console.log(req.body.type);
    console.log("--------------");
    if (type == "init") {
        var id = req.user.id;
        // console.log(req.user.id);
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            res.json(user);
        })
    } else if (type == "loadmusicData") {
        if (req.session.bkMusicVolumn && req.session.musicLevel && req.session.bkMusicSwitch) {
            req.session.bkMusicVolumn = arseInt(req.body.bkMusicVolumn);
            req.session.bkMusicSwitch = parseInt(req.body.bkMusicSwitch);
            req.session.musicLevel = parseInt(req.body.musicLevel);
            console.log("tstt success");
            scriptData = {
                bkMusicVolumn: req.session.bkMusicVolumn
                , bkMusicSwitch: req.session.bkMusicSwitch
                , musicLevel: req.session.musicLevel
            }
            res.json(JSON.stringify(scriptData));
        }
        else {
            console.log("tstt nome");
            scriptData = {
                bkMusicVolumn: 0.1
                , bkMusicSwitch: 1
                , musicLevel: 1
            }
            req.session.bkMusicVolumn = 0.1;
            req.session.bkMusicSwitch = 1;
            req.session.musicLevel = 1;
            res.json(scriptData);

        }

    }
    /**更新部分 */
    else if (type == "resetEquip") {
        var id = req.user.id;
        User.updateResetEquip(id, function (err, user) {
            if (err) throw err;
            console.log("up   :", user);
            User.getUserById(id, function (err, user) {
                if (err) throw err;
                res.json(user);
            })
        })
    }
    else if (type == "userMap") {
        MapRecord.getMapByUserID(req.user.id, function (err, map) {
            if (err) throw err;
            var dataMap = [];
            for (let indexM = 0; indexM < map.length; indexM++) {
                const element = map[indexM];
                if (element.check == true && element.postStage == 2) {
                    dataMap.push(element);
                }

            }
            res.json(dataMap);
            // console.log(req.user.id);
            // console.log(map);
            // res.json(map);
        })
    }
    /********* */
    else if (type == "weaponLevelup") {
        var id = req.user.id;
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            var weaponLevel = parseInt(user.weaponLevel) + 1
            var levelUpLevel = parseInt(user.levelUpLevel)
            // if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
            //     res.json({ err: "error" });
            // }
            // else {
            levelUpLevel += 1;
            User.updateWeaponLevel(id, weaponLevel, levelUpLevel, function (err, user) {
                if (err) throw err;
                // console.log("up   :", user);
                User.getUserById(id, function (err, user) {
                    if (err) throw err;
                    res.json(user);
                })
            })
            // }


        })
    }
    else if (type == "armorLevelup") {
        var id = req.user.id;
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            var armorLevelup = parseInt(user.armorLevel) + 1
            var levelUpLevel = parseInt(user.levelUpLevel)
            // if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
            //     res.json({ err: "error" });
            // }
            // else {
            levelUpLevel += 1;
            User.updateArmorLevel(id, armorLevelup, levelUpLevel, function (err, user) {
                if (err) throw err;
                // console.log("up   :", user);
                User.getUserById(id, function (err, user) {
                    if (err) throw err;
                    res.json(user);
                })
            })
            // }
        })
    }
    else if (type == "changePassword") {
        var id = req.user.id
        var password = req.body.password
        var oldPassword = req.body.oldPassword
        // console.log(password,oldPassword);

        User.getUserById(id, function (err, user) {
            if (err) throw err;
            if (user) {
                // console.log(user);
                User.comparePassword(oldPassword, user.password, function (err, isMatch) {
                    if (err) throw err
                    if (isMatch) {
                        req.flash('success_msg', 'you are updatePass now')
                        User.updatePassword(user.username, password, function (err, user) {
                            if (err) throw err;
                            // console.log("update :", user);
                        })
                        req.session.updatePassKey = null;
                        return res.json({ responce: 'sucesss' });
                    } else {
                        return res.json({ responce: 'failPassUndifine' });
                    }
                })
            } else {
                return res.json({ responce: 'error' });
            }
        })
        // res.redirect('/login')
    }
    else if (type == "loadDict") {
        DictionaryRecord.getDictionary(function (err, dict) {
            returnData = dict.sort(function (a, b) {
                return a.level > b.level ? 1 : -1;
            });
            res.json(returnData);

        });
    }
    else if (type == "loadEquip") {
        EquipmentRecord.getEquipment(function (err, equip) {
            res.json(equip[0]);

        });
    }
    else if (type == "updateEquip") {
        var seriJson = JSON.parse(req.body.seriJson)
        var armorLevel = seriJson.armorLevel;
        var weaponLevel = seriJson.weaponLevel;
        var levelUpLevel = seriJson.levelUpLevel;
        // console.log(seriJson);
        // console.log(armorLevel,weaponLevel,levelUpLevel);
        EquipmentRecord.updateEquipment(armorLevel, weaponLevel, levelUpLevel, function (err, dictResult) {
            if (err) throw err;
            res.json({ res: true });
        });
    }
    else if (type == "updateDict") {
        var dictType = req.body.dictType
        var dictNum = req.body.dictNum
        var dictValue = req.body.dictValue
        console.log(dictType, dictNum, dictValue);
        DictionaryRecord.getDictionary(function (err, dict) {
            if (err) throw err;
            var typeIndex = 0;
            for (let index = 0; index < dict.length; index++) {
                var element = dict[index];
                if (element.type == dictType) {
                    element.element[dictNum].value = dictValue;
                    typeIndex = index;
                    break;
                    // console.log(element);

                }
            }
            DictionaryRecord.updateDictionaryByType(dict[typeIndex].type, dict[typeIndex].element, function (err, dictResult) {
                if (err) throw err;
                res.json({ res: true });
            });
        });
    }
    else {

    }

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
    console.log("home post--------gameView");
    console.log(req.body.type);
    console.log("--------------");
    if (type == "init") {
        var id = req.user.id;
        bkMusicVolumn = 1;
        bkMusicSwitch = parseInt(req.body.bkMusicSwitch);
        musicLevel = parseInt(req.body.musicLevel);
        if (req.session.bkMusicVolumn) {
            scriptData = {
                bkMusicVolumn: req.session.bkMusicVolumn
                , bkMusicSwitch: req.session.bkMusicSwitch
                , musicLevel: req.session.musicLevel
            }
            res.json(scriptData);
        }

        // console.log(req.user.id);
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            res.json(user);
        })
    }
    else if (type == "weaponLevelup") {
        var id = req.user.id;
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            var weaponLevel = parseInt(user.weaponLevel) + 1
            var levelUpLevel = parseInt(user.levelUpLevel)
            // if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
            //     res.json({ err: "error" });
            // }
            // else {
            levelUpLevel += 1;
            User.updateWeaponLevel(id, weaponLevel, levelUpLevel, function (err, user) {
                if (err) throw err;
                // console.log("up   :", user);
                User.getUserById(id, function (err, user) {
                    if (err) throw err;
                    res.json(user);
                })
            })
            // }


        })
    }
    else if (type == "armorLevelup") {
        var id = req.user.id;
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            var armorLevelup = parseInt(user.armorLevel) + 1
            var levelUpLevel = parseInt(user.levelUpLevel)
            // if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
            //     res.json({ err: "error" });
            // }
            // else {
            levelUpLevel += 1;
            User.updateArmorLevel(id, armorLevelup, levelUpLevel, function (err, user) {
                if (err) throw err;
                // console.log("up   :", user);
                User.getUserById(id, function (err, user) {
                    if (err) throw err;
                    res.json(user);
                })
            })
            // }
        })
    }
    //-----關卡紀錄 ------
    else if (type == "codeLevelResult" || type == "blockLevelResult") {
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
        }
        console.log("data:", data);

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
                if ((MediumEmpire.HighestLevel == data.level || MediumEmpire.HighestLevel <= data.level) && data.HighestStarNum > 0) {
                    MediumEmpire.HighestLevel = parseInt(data.level) + 1;
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
                console.log(MediumEmpire);
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
    else if (type == "loadDict") {
        DictionaryRecord.getDictionary(function (err, dict) {
            returnData = dict.sort(function (a, b) {
                return a.level > b.level ? 1 : -1;
            });
            res.json(returnData);

        });
    }
    else if (type == "loadEquip") {
        EquipmentRecord.getEquipment(function (err, equip) {
            res.json(equip[0]);

        });
    }
    else if (type == "updateEquip") {
        var seriJson = JSON.parse(req.body.seriJson)
        var armorLevel = seriJson.armorLevel;
        var weaponLevel = seriJson.weaponLevel;
        var levelUpLevel = seriJson.levelUpLevel;
        // console.log(seriJson);
        // console.log(armorLevel,weaponLevel,levelUpLevel);
        EquipmentRecord.updateEquipment(armorLevel, weaponLevel, levelUpLevel, function (err, dictResult) {
            if (err) throw err;
            res.json({ res: true });
        });
    }
    else if (type == "updateDict") {
        var dictType = req.body.dictType
        var dictNum = req.body.dictNum
        var dictValue = req.body.dictValue
        console.log(dictType, dictNum, dictValue);
        DictionaryRecord.getDictionary(function (err, dict) {
            if (err) throw err;
            var typeIndex = 0;
            for (let index = 0; index < dict.length; index++) {
                var element = dict[index];
                if (element.type == dictType) {
                    element.element[dictNum].value = dictValue;
                    typeIndex = index;
                    break;
                    // console.log(element);

                }
            }
            DictionaryRecord.updateDictionaryByType(dict[typeIndex].type, dict[typeIndex].element, function (err, dictResult) {
                if (err) throw err;
                res.json({ res: true });
            });
        });
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
    console.log("home post--------gameView");
    console.log(req.body.type);
    console.log("--------------");
    if (type == "init") {
        var id = req.user.id;
        bkMusicVolumn = 1;
        bkMusicSwitch = parseInt(req.body.bkMusicSwitch);
        musicLevel = parseInt(req.body.musicLevel);
        if (req.session.bkMusicVolumn) {
            scriptData = {
                bkMusicVolumn: req.session.bkMusicVolumn
                , bkMusicSwitch: req.session.bkMusicSwitch
                , musicLevel: req.session.musicLevel
            }
            res.json(scriptData);
        }

        // console.log(req.user.id);
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            res.json(user);
        })
    }
    else if (type == "weaponLevelup") {
        var id = req.user.id;
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            var weaponLevel = parseInt(user.weaponLevel) + 1
            var levelUpLevel = parseInt(user.levelUpLevel)
            // if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
            //     res.json({ err: "error" });
            // }
            // else {
            levelUpLevel += 1;
            User.updateWeaponLevel(id, weaponLevel, levelUpLevel, function (err, user) {
                if (err) throw err;
                // console.log("up   :", user);
                User.getUserById(id, function (err, user) {
                    if (err) throw err;
                    res.json(user);
                })
            })
            // }


        })
    }
    else if (type == "armorLevelup") {
        var id = req.user.id;
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            var armorLevelup = parseInt(user.armorLevel) + 1
            var levelUpLevel = parseInt(user.levelUpLevel)
            // if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
            //     res.json({ err: "error" });
            // }
            // else {
            levelUpLevel += 1;
            User.updateArmorLevel(id, armorLevelup, levelUpLevel, function (err, user) {
                if (err) throw err;
                // console.log("up   :", user);
                User.getUserById(id, function (err, user) {
                    if (err) throw err;
                    res.json(user);
                })
            })
            // }
        })
    }
    //-----暫時的 ------
    //-----關卡紀錄 ------
    else if (type == "blockLevelResult" || type == "codeLevelResult") {
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
        }
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
                console.log(MediumEmpire);
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
    //-------------------
    else if (type == "loadDict") {
        DictionaryRecord.getDictionary(function (err, dict) {
            returnData = dict.sort(function (a, b) {
                return a.level > b.level ? 1 : -1;
            });
            res.json(returnData);

        });
    }
    else if (type == "loadEquip") {
        EquipmentRecord.getEquipment(function (err, equip) {
            res.json(equip[0]);

        });
    }
    else if (type == "updateEquip") {
        var seriJson = JSON.parse(req.body.seriJson)
        var armorLevel = seriJson.armorLevel;
        var weaponLevel = seriJson.weaponLevel;
        var levelUpLevel = seriJson.levelUpLevel;
        // console.log(seriJson);
        // console.log(armorLevel,weaponLevel,levelUpLevel);
        EquipmentRecord.updateEquipment(armorLevel, weaponLevel, levelUpLevel, function (err, dictResult) {
            if (err) throw err;
            res.json({ res: true });
        });
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
router.post('/managementModifyMap', function (req, res, next) {
    // Parse Info
    var type = req.body.type
    console.log("home post--------gameView");
    console.log(req.body.type);
    console.log("--------------");
    if (type == "init") {
        var id = req.user.id;
        bkMusicVolumn = 1;
        bkMusicSwitch = parseInt(req.body.bkMusicSwitch);
        musicLevel = parseInt(req.body.musicLevel);
        if (req.session.bkMusicVolumn) {
            scriptData = {
                bkMusicVolumn: req.session.bkMusicVolumn
                , bkMusicSwitch: req.session.bkMusicSwitch
                , musicLevel: req.session.musicLevel
            }
            res.json(scriptData);
        }

        // console.log(req.user.id);
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            res.json(user);
        })
    }
    else if (type == "weaponLevelup") {
        var id = req.user.id;
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            var weaponLevel = parseInt(user.weaponLevel) + 1
            var levelUpLevel = parseInt(user.levelUpLevel)
            // if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
            //     res.json({ err: "error" });
            // }
            // else {
            levelUpLevel += 1;
            User.updateWeaponLevel(id, weaponLevel, levelUpLevel, function (err, user) {
                if (err) throw err;
                // console.log("up   :", user);
                User.getUserById(id, function (err, user) {
                    if (err) throw err;
                    res.json(user);
                })
            })
            // }


        })
    }
    else if (type == "armorLevelup") {
        var id = req.user.id;
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            var armorLevelup = parseInt(user.armorLevel) + 1
            var levelUpLevel = parseInt(user.levelUpLevel)
            // if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
            //     res.json({ err: "error" });
            // }
            // else {
            levelUpLevel += 1;
            User.updateArmorLevel(id, armorLevelup, levelUpLevel, function (err, user) {
                if (err) throw err;
                // console.log("up   :", user);
                User.getUserById(id, function (err, user) {
                    if (err) throw err;
                    res.json(user);
                })
            })
            // }
        })
    }
    //-----暫時的 ------
    //-----關卡紀錄 ------
    else if (type == "blockLevelResult" || type == "codeLevelResult") {
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
        }
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
                console.log(MediumEmpire);
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
    //-------------------
    else {

    }

});

/*以下測試檔*/
router.get('/managementModifyMapTest', ensureAuthenticated, function (req, res, next) {
    // console.log(req.user)
    res.render('backstage/managementModifyMapTest', {
        user: req.user.username
    });
});
router.post('/managementModifyMapTest', function (req, res, next) {
    // Parse Info
    var type = req.body.type
    console.log("home post--------gameView");
    console.log(req.body.type);
    console.log("--------------");
    if (type == "init") {
        var id = req.user.id;
        bkMusicVolumn = 1;
        bkMusicSwitch = parseInt(req.body.bkMusicSwitch);
        musicLevel = parseInt(req.body.musicLevel);
        if (req.session.bkMusicVolumn) {
            scriptData = {
                bkMusicVolumn: req.session.bkMusicVolumn
                , bkMusicSwitch: req.session.bkMusicSwitch
                , musicLevel: req.session.musicLevel
            }
            res.json(scriptData);
        }

        // console.log(req.user.id);
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            res.json(user);
        })
    }
    else if (type == "weaponLevelup") {
        var id = req.user.id;
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            var weaponLevel = parseInt(user.weaponLevel) + 1
            var levelUpLevel = parseInt(user.levelUpLevel)
            // if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
            //     res.json({ err: "error" });
            // }
            // else {
            levelUpLevel += 1;
            User.updateWeaponLevel(id, weaponLevel, levelUpLevel, function (err, user) {
                if (err) throw err;
                // console.log("up   :", user);
                User.getUserById(id, function (err, user) {
                    if (err) throw err;
                    res.json(user);
                })
            })
            // }


        })
    }
    else if (type == "armorLevelup") {
        var id = req.user.id;
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            var armorLevelup = parseInt(user.armorLevel) + 1
            var levelUpLevel = parseInt(user.levelUpLevel)
            // if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
            //     res.json({ err: "error" });
            // }
            // else {
            levelUpLevel += 1;
            User.updateArmorLevel(id, armorLevelup, levelUpLevel, function (err, user) {
                if (err) throw err;
                // console.log("up   :", user);
                User.getUserById(id, function (err, user) {
                    if (err) throw err;
                    res.json(user);
                })
            })
            // }
        })
    }
    //-----暫時的 ------
    //-----關卡紀錄 ------
    else if (type == "blockLevelResult" || type == "codeLevelResult") {
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
        }
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
                console.log(MediumEmpire);
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
    //-------------------
    else {

    }

});
/*到此結束*/

router.get('/managementUser', ensureAuthenticated, function (req, res, next) {
    // console.log(req.user)
    if (req.user.isadmin == false) { //如有其他管理者 在這加
        res.redirect('/login')
    }
    res.render('backstage/managementUser', {
        user: req.user.username
    });
});
router.post('/managementUser', function (req, res, next) {
    // Parse Info
    var type = req.body.type
    console.log("home post--------");
    console.log(req.body.type);
    console.log("--------------");
    if (type == "init") {
        var id = req.user.id;
        // console.log(req.user.id);
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            res.json(user);
        })
    }
    else if (type == "LoadUser") {
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
// 以下宜靜 2020.05.18
router.get('/managementRFMP', ensureAuthenticated, function (req, res, next) {
    // console.log(req.user)
    if (!(req.user.username == "NKUSTCCEA"||req.user.username == "teacher")) { //如有其他管理者 在這加
        res.redirect('/login')
    }
    res.render('backstage/managementRFMP', {
        user: req.user.username
    });
});

router.post('/managementRFMP', function (req, res, next) {  
    try {
        var type = req.body.type;
        var startTime = req.body.startTime;
        var endTime = req.body.endTime;
        console.log("type:",type);
        console.log("startTime:",startTime);
        console.log("endTime:",endTime);
        if (type == "init") {
            console.log("11111111111111111111111");
            var id = req.user.id;
            User.getUserById(id, function (err, user) {
                if (err) throw err;
                res.json(user);
            })
        }else if(type == "Calculate"){
            console.log("Calculate   22222222222222222222222");
            var UserRFMP = []; // 陣列裡中每一筆資料存 [玩家信箱,R數據,F數據,M數據,P數據,R評分,F評分,M評分,P評分,R值,F值,M值,P值,學習者類型]
                                                  // [   0   ,  1  ,  2 ,  3  , 4  ,  5  ,  6  , 7  ,  8  , 9 , 10,11, 12,    13   ]
            var Rhavedata = [],Fhavedata = [],Mhavedata = [],Phavedata = [];    // 只將有記錄的人的記錄丟進去 // 2020.05.17
            var Rscore = [],Fscore = [],Mscore = [],Pscore = [];    // 只將有記錄的人的評分丟進去 // 2020.05.17
            var RQ = [0,0,0,0],FQ = [0,0,0,0],MQ = [0,0,0,0], PQ = [0,0,0,0];
            var Rave = 0,Fave = 0,Mave = 0,Pave = 0;
            var Rday = endTime;
            var RFtaskStack = [];
            RFtaskStack.push(
                new Promise((resolve, reject) => {
                    User.getAllUser(function (err, userState){
                        if (err) throw err;
                        // console.log("玩家人數:",userState.length - 1);
                        var userlen = 0;    // 判斷玩家人數，因要扣除管理者
        
                        // 初始化所有玩家RFMP陣列資料
                        for(let index = 0;index < userState.length; index++){
                            if( userState[index].email != "NKUSTCCEA@gmail.com" ){
                                UserRFMP[userlen] = [userState[index].email,-1,-1,0,0,0,0,0,0,0,0,0,0,""];
                                userlen = userlen + 1;
                            }
                        }// 結束初始化所有玩家RFMP陣列資料
                        
        
                        // R & F數據計算
                        for(let index = 0;index < userState.length; index++){
                            var FIntervalLen = 0,FIntervalData=[];  // 紀錄 管理者所設定的時間內登入次數以及登入時間資料
                            if(userState[index].Logintime.length){    // 如果userState[index]此玩家有登入資料
                                for(let i=0; i < UserRFMP.length; i++){
                                    if(userState[index].email == UserRFMP[i][0]){
                                        var Login = userState[index].Logintime.length;
                                        for(let j=0; j < Login; j++){   // 只抓存管理者所設定的時間內的資料
                                            if((userState[index].Logintime[j] > startTime) && (userState[index].Logintime[j] < endTime)){
                                                FIntervalLen = FIntervalLen + 1;
                                                FIntervalData.push(userState[index].Logintime[j]);
                                            }
                                        }
                                        if(FIntervalLen != 0){
                                            var RInterval = FIntervalData[FIntervalLen-1].getTime();
                                            var Rsub = (Rday - RInterval) / 1000 / 60 / 60 / 24;  //換算成天 
                                            UserRFMP[i][1] = 1 / Rsub;// UserRFMP[i][1] 存 Rdata
                                            UserRFMP[i][2] = FIntervalLen;  // UserRFMP[i][2] 存 Fdata
                                            Rhavedata.push(UserRFMP[i][1]); // 只將有R_Data的人放進陣列裡 // 2020.05.17
                                            Fhavedata.push(UserRFMP[i][2]); // 只將有F_Data的人放進陣列裡 // 2020.05.17
                                        }
                                    }
                                }
                            }
                        } // 結束 R & F 數據計算
                        
                        // R數據由大排到小
                        let Rtime = Rhavedata.length;
                        while(Rtime > 1){
                            Rtime--;
                            for(let i=0; i < Rhavedata.length-1;i++){
                                var temp;
                                if( Rhavedata[i] < Rhavedata[i+1] ){
                                    temp = Rhavedata[i];
                                    Rhavedata[i] = Rhavedata[i+1];
                                    Rhavedata[i+1] = temp;
                                }
                            }
                        }
                        
                        
                        // R數據的五分位數計算
                        for(let i = 0; i < RQ.length; i++){
                            if(i==3){   //取 80%  為 Q4
                                var position = Rhavedata.length*0.2;
                                if ((position % 1) == 0) {
                                    RQ[i] = (Rhavedata[Math.floor(position)] + Rhavedata[Math.floor(position)+1])/2;
                                }else{
                                    RQ[i] = Rhavedata[Math.floor(position)]; //整數無條件進位
                                }
                            }
                            if(i==2){   //取 60%  為 Q3
                                var position = Rhavedata.length*0.4;
                                if ((position % 1) == 0) {
                                    RQ[i] = (Rhavedata[Math.floor(position)] + Rhavedata[Math.floor(position)+1])/2;
                                }else{
                                    RQ[i] = Rhavedata[Math.floor(position)]; //整數無條件進位
                                }
                            }
                            if(i==1){   //取 40%  為 Q2
                                var position = Rhavedata.length*0.6;
                                if ((position % 1) == 0) {
                                    RQ[i] = (Rhavedata[Math.floor(position)] + Rhavedata[Math.floor(position)+1])/2;
                                }else{
                                    RQ[i] = Rhavedata[Math.floor(position)]; //整數無條件進位
                                }
                            }
                            if(i==0){   //取 20%  為 Q1
                                var position = Rhavedata.length*0.8;
                                if ((position % 1) == 0) {
                                    RQ[i] = (Rhavedata[Math.floor(position)] + Rhavedata[Math.floor(position)+1])/2;
                                }else{
                                    RQ[i] = Rhavedata[Math.floor(position)]; //整數無條件進位
                                }
                            }
                        }
                        console.log("RQ:",RQ);
                        // 結束 R數據的五分位數計算
        
                        // 玩家R評分計算
                        for(let index = 0; index < UserRFMP.length; index++){
                            if(UserRFMP[index][1] >= RQ[3]){  // 如果大於等於RQ4，得5分
                                UserRFMP[index][5] = 5;
                                Rscore.push(5);
                            }else if((UserRFMP[index][1] < RQ[3]) && (UserRFMP[index][1] >= RQ[2])){  // 如果小於RQ4，且大於等於RQ3，得4分
                                UserRFMP[index][5] = 4;
                                Rscore.push(4);
                            }else if((UserRFMP[index][1] < RQ[2]) && (UserRFMP[index][1] >= RQ[1])){  // 如果小於RQ3，且大於等於RQ2，得3分
                                UserRFMP[index][5] = 3;
                                Rscore.push(3);
                            }else if((UserRFMP[index][1] < RQ[1]) && (UserRFMP[index][1] >= RQ[0])){  // 如果小於RQ2，且大於等於RQ1，得2分
                                UserRFMP[index][5] = 2;
                                Rscore.push(2);
                            }else if((UserRFMP[index][1] < RQ[0]) && (UserRFMP[index][1] != -1)){  // 如果小於等於RQ1，得1分
                                UserRFMP[index][5] = 1;
                                Rscore.push(1);
                            }
                            if(UserRFMP[index][1] == -1){
                                UserRFMP[index][5] = -1;
                                // 因不在選取區間內，所以不記錄進Rscore裡
                            }
                        } // 結束 玩家R評分計算
        
                        for(let i=0;i < Rscore.length; i++){
                            Rave = Rave + Rscore[i];
                        }
                        // console.log("R評分總分數:",Rave);
                        Rave = Rave / Rscore.length;
        
                        // 更新使用者Rscore
                        for(let i=0;i < UserRFMP.length; i++){
                            //非同步
                            User.updateRscore(UserRFMP[i][0], UserRFMP[i][5] ,function (err, record) {
                                if (err) throw err;
                            })
                        }
                        console.log("R評分平均:",Rave);
                        // console.log("R有資料:",Rhavedata.length);
                        // console.log("R評分長度:",Rscore.length);
                        
                        
                        // F數據由大排到小
                        let Ftime = Fhavedata.length;
                        while(Ftime > 1){
                            Ftime--;
                            for(let i=0; i < Fhavedata.length-1;i++){
                                var temp;
                                if( Fhavedata[i] < Fhavedata[i+1] ){
                                    temp = Fhavedata[i];
                                    Fhavedata[i] = Fhavedata[i+1];
                                    Fhavedata[i+1] = temp;
                                }
                            }
                        }  
        
                        // F數據的五分位數計算
                        for(let i = 0; i < FQ.length; i++){
                            if(i==3){   //取 80%  為 Q4
                                var position = Fhavedata.length*0.2;
                                if ((position % 1) == 0) {
                                    FQ[i] = (Fhavedata[Math.floor(position)] + Fhavedata[Math.floor(position)+1])/2;
                                }else{
                                    FQ[i] = Fhavedata[Math.floor(position)]; //整數無條件進位
                                }
                            }
                            if(i==2){   //取 60%  為 Q3
                                var position = Fhavedata.length*0.4;
                                if ((position % 1) == 0) {
                                    FQ[i] = (Fhavedata[Math.floor(position)] + Fhavedata[Math.floor(position)+1])/2;
                                }else{
                                    FQ[i] = Fhavedata[Math.floor(position)]; //整數無條件進位
                                }
                            }
                            if(i==1){   //取 40%  為 Q2
                                var position = Fhavedata.length*0.6;
                                if ((position % 1) == 0) {
                                    FQ[i] = (Fhavedata[Math.floor(position)] + Fhavedata[Math.floor(position)+1])/2;
                                }else{
                                    FQ[i] = Fhavedata[Math.floor(position)]; //整數無條件進位
                                }
                            }
                            if(i==0){   //取 20%  為 Q1
                                var position = Fhavedata.length*0.8;
                                if ((position % 1) == 0) {
                                    FQ[i] = (Fhavedata[Math.floor(position)] + Fhavedata[Math.floor(position)+1])/2;
                                }else{
                                    FQ[i] = Fhavedata[Math.floor(position)]; //整數無條件進位
                                }
                            }
                        }
                        // console.log("FQ:",FQ);
                        // 結束 F數據的五分位數計算
        
                        // 玩家F評分計算
                        for(let index = 0; index < UserRFMP.length; index++){
                            if(UserRFMP[index][2] >= FQ[3]){  // 如果大於等於FQ4，得5分
                                UserRFMP[index][6] = 5;
                                Fscore.push(5);
                            }else if((UserRFMP[index][2] < FQ[3]) && (UserRFMP[index][2] >= FQ[2])){  // 如果小於FQ4，且大於等於FQ3，得4分
                                UserRFMP[index][6] = 4;
                                Fscore.push(4);
                            }else if((UserRFMP[index][2] < FQ[2]) && (UserRFMP[index][2] >= FQ[1])){  // 如果小於FQ3，且大於等於FQ2，得3分
                                UserRFMP[index][6] = 3;
                                Fscore.push(3);
                            }else if((UserRFMP[index][2] < FQ[1]) && (UserRFMP[index][2] >= FQ[0])){  // 如果小於FQ2，且大於等於FQ1，得2分
                                UserRFMP[index][6] = 2;
                                Fscore.push(2);
                            }else if((UserRFMP[index][2] < FQ[0]) && (UserRFMP[index][2] != -1)){  // 如果小於等於FQ1，得1分
                                UserRFMP[index][6] = 1;
                                Fscore.push(1);
                            }
                            if(UserRFMP[index][2] == -1){
                                UserRFMP[index][6] = -1;
                                // 因不在選取區間內，所以不記錄進Fscore裡
                            }
                        } // 結束 玩家F評分計算
        
                        for(let i=0;i < Fscore.length; i++){
                            Fave = Fave + Fscore[i];
                        }
                        // console.log("F評分總分數:",Fave);
                        Fave = Fave / Fscore.length;
        
                        // 更新使用者Fscore
                        for(let i=0;i < UserRFMP.length; i++){
                            User.updateFscore(UserRFMP[i][0], UserRFMP[i][6] ,function (err, record) {
                                if (err) throw err;
                            })
                        }
                        console.log("F評分平均:",Fave);
                        // console.log("F有資料:",Fhavedata.length);
                        // console.log("F評分長度:",Fscore.length);
                        
                        
                         // 以下做 M & P的計算
                        UserSpendTime.getAllUserSpendTimeState(function (err, userSpendTimeState){
                            if (err) throw err;
        
                            // M & P數據計算
                            for(let index = 0;index < userSpendTimeState.length ;index++){
                                const MP_process = userSpendTimeState[index];
                                if((MP_process.startplay.getTime() > startTime) && (MP_process.endplay.getTime() < endTime)){
                                    var min = (MP_process.endplay.getTime() - MP_process.startplay.getTime()) / 1000 / 60;  //換算成分鐘
                                    for(let index = 0;index < UserRFMP.length ; index++){
                                        if(MP_process.email == UserRFMP[index][0]){
                                            UserRFMP[index][3] = UserRFMP[index][3] + min;  // UserRFMP[index][3] 存 Mdata
                                            UserRFMP[index][4] = UserRFMP[index][4] + MP_process.starNumber;  // UserRFMP[index][4] 存 Pdata
                                        }
                                    }
                                }
                            }

                            // 去除資料的bug
                            for(let index = 0;index < UserRFMP.length ; index++){
                                if(UserRFMP[index][1] == -1){
                                    UserRFMP[index][3] = -1;  // UserRFMP[index][3] 存 Mdata
                                    UserRFMP[index][4] = -1;  // UserRFMP[index][4] 存 Pdata
                                }
                            }

                            for(let index = 0;index < UserRFMP.length ; index++){
                                if(UserRFMP[index][3] != -1){
                                    Mhavedata.push(UserRFMP[index][3]); // 只將有M_Data的人放進陣列裡 // 2020.05.17
                                }
                                if(UserRFMP[index][4] != -1){
                                    Phavedata.push(UserRFMP[index][4]); // 只將有P_Data的人放進陣列裡 // 2020.05.17
                                }
                            }
                            // 結束M & P數據計算
        
                            // M數據由大排到小
                            let Mtime = Mhavedata.length;
                            while(Mtime > 1){
                                Mtime--;
                                for(let i=0; i < Mhavedata.length-1;i++){
                                    var temp;
                                    if( Mhavedata[i] < Mhavedata[i+1] ){
                                        temp = Mhavedata[i];
                                        Mhavedata[i] = Mhavedata[i+1];
                                        Mhavedata[i+1] = temp;
                                    }
                                }
                            }   
                            
                            // M數據的五分位數計算
                            for(let i = 0; i < MQ.length; i++){
                                if(i==3){   //取 80%  為 Q4
                                    var position = Mhavedata.length*0.2;
                                    if ((position % 1) == 0) {
                                        MQ[i] = (Mhavedata[Math.floor(position)] + Mhavedata[Math.floor(position)+1])/2;
                                    }else{
                                        MQ[i] = Mhavedata[Math.floor(position)]; //整數無條件進位
                                    }
                                }
                                if(i==2){   //取 60%  為 Q3
                                    var position = Mhavedata.length*0.4;
                                    if ((position % 1) == 0) {
                                        MQ[i] = (Mhavedata[Math.floor(position)] + Mhavedata[Math.floor(position)+1])/2;
                                    }else{
                                        MQ[i] = Mhavedata[Math.floor(position)]; //整數無條件進位
                                    }
                                }
                                if(i==1){   //取 40%  為 Q2
                                    var position = Mhavedata.length*0.6;
                                    if ((position % 1) == 0) {
                                        MQ[i] = (Mhavedata[Math.floor(position)] + Mhavedata[Math.floor(position)+1])/2;
                                    }else{
                                        MQ[i] = Mhavedata[Math.floor(position)]; //整數無條件進位
                                    }
                                }
                                if(i==0){   //取 20%  為 Q1
                                    var position = Mhavedata.length*0.8;
                                    if ((position % 1) == 0) {
                                        MQ[i] = (Mhavedata[Math.floor(position)] + Mhavedata[Math.floor(position)+1])/2;
                                    }else{
                                        MQ[i] = Mhavedata[Math.floor(position)]; //整數無條件進位
                                    }
                                }
                            }
                            // console.log("MQ:",MQ);
                            // 結束 M數據的五分位數計算
                    
                            // 玩家M評分計算
                            for(let index = 0; index < UserRFMP.length; index++){
                                if(UserRFMP[index][3] >= MQ[3]){  // 如果大於等於MQ4，得5分
                                    UserRFMP[index][7] = 5;
                                    Mscore.push(5);
                                }else if((UserRFMP[index][3] < MQ[3]) && (UserRFMP[index][3] >= MQ[2])){  // 如果小於MQ4，且大於等於MQ3，得4分
                                    UserRFMP[index][7] = 4;
                                    Mscore.push(4);
                                }else if((UserRFMP[index][3] < MQ[2]) && (UserRFMP[index][3] >= MQ[1])){  // 如果小於MQ3，且大於等於MQ2，得3分
                                    UserRFMP[index][7] = 3;
                                    Mscore.push(3);
                                }else if((UserRFMP[index][3] < MQ[1]) && (UserRFMP[index][3] >= MQ[0])){  // 如果小於MQ2，且大於等於MQ1，得2分
                                    UserRFMP[index][7] = 2;
                                    Mscore.push(2);
                                }else if((UserRFMP[index][3] < MQ[0]) && (UserRFMP[index][3] != -1)){  // 如果小於等於MQ1，得1分
                                    UserRFMP[index][7] = 1;
                                    Mscore.push(1);
                                }
                                if(UserRFMP[index][3] == -1){
                                    UserRFMP[index][7] = -1;
                                    // 因不在選取區間內，所以不記錄進Mscore裡
                                }
                            } // 結束 玩家M評分計算
                    
                            for(let i=0;i < Mscore.length; i++){
                                Mave = Mave + Mscore[i];
                            }
                            // console.log("M評分總分數:",Mave);
                            Mave = Mave / Mscore.length;
                    
                            // 更新使用者Mscore
                            for(let i=0;i < UserRFMP.length; i++){
                                //非同步
                                User.updateMscore(UserRFMP[i][0], UserRFMP[i][7] ,function (err, record) {
                                    if (err) throw err;
                                })
                            }
                            console.log("M評分平均:",Mave);
                            // console.log("M有資料:",Mhavedata.length);
                            // console.log("M評分長度:",Mscore.length);
                            
                            // P數據由大排到小
                            let Ptime = Phavedata.length;
                            while(Ptime > 1){
                                Ptime--;
                                for(let i=0; i < Phavedata.length-1;i++){
                                    var temp;
                                    if( Phavedata[i] < Phavedata[i+1] ){
                                        temp = Phavedata[i];
                                        Phavedata[i] = Phavedata[i+1];
                                        Phavedata[i+1] = temp;
                                    }
                                }
                            }
                    
                            // P數據的五分位數計算
                            for(let i = 0; i < PQ.length; i++){
                                if(i==3){   //取 80%  為 Q4
                                    var position = Phavedata.length*0.2;
                                    if ((position % 1) == 0) {
                                        PQ[i] = (Phavedata[Math.floor(position)] + Phavedata[Math.floor(position)+1])/2;
                                    }else{
                                        PQ[i] = Phavedata[Math.floor(position)]; //整數無條件進位
                                    }
                                }
                                if(i==2){   //取 60%  為 Q3
                                    var position = Phavedata.length*0.4;
                                    if ((position % 1) == 0) {
                                        PQ[i] = (Phavedata[Math.floor(position)] + Phavedata[Math.floor(position)+1])/2;
                                    }else{
                                        PQ[i] = Phavedata[Math.floor(position)]; //整數無條件進位
                                    }
                                }
                                if(i==1){   //取 40%  為 Q2
                                    var position = Phavedata.length*0.6;
                                    if ((position % 1) == 0) {
                                        PQ[i] = (Phavedata[Math.floor(position)] + Phavedata[Math.floor(position)+1])/2;
                                    }else{
                                        PQ[i] = Phavedata[Math.floor(position)]; //整數無條件進位
                                    }
                                }
                                if(i==0){   //取 20%  為 Q1
                                    var position = Phavedata.length*0.8;
                                    if ((position % 1) == 0) {
                                        PQ[i] = (Phavedata[Math.floor(position)] + Phavedata[Math.floor(position)+1])/2;
                                    }else{
                                        PQ[i] = Phavedata[Math.floor(position)]; //整數無條件進位
                                    }
                                }
                            }
                            // console.log("PQ:",PQ);
                            // 結束 P數據的五分位數計算
                            // 玩家P評分計算
                            for(let index = 0; index < UserRFMP.length; index++){
                                if(UserRFMP[index][4] >= PQ[3]){  // 如果大於等於PQ4，得5分
                                    UserRFMP[index][8] = 5;
                                    Pscore.push(5);
                                }else if((UserRFMP[index][4] < PQ[3]) && (UserRFMP[index][4] >= PQ[2])){  // 如果小於PQ4，且大於等於PQ3，得4分
                                    UserRFMP[index][8] = 4;
                                    Pscore.push(4);
                                }else if((UserRFMP[index][4] < PQ[2]) && (UserRFMP[index][4] >= PQ[1])){  // 如果小於PQ3，且大於等於PQ2，得3分
                                    UserRFMP[index][8] = 3;
                                    Pscore.push(3);
                                }else if((UserRFMP[index][4] < PQ[1]) && (UserRFMP[index][4] >= PQ[0])){  // 如果小於PQ2，且大於等於PQ1，得2分
                                    UserRFMP[index][8] = 2;
                                    Pscore.push(2);
                                }else if((UserRFMP[index][4] < PQ[0]) && (UserRFMP[index][4] != -1)){  // 如果小於等於PQ1，得1分
                                    UserRFMP[index][8] = 1;
                                    Pscore.push(1);
                                }
                                if(UserRFMP[index][4] == -1){
                                    UserRFMP[index][8] = -1;
                                    // 因不在選取區間內，所以不記錄進Pscore裡
                                }
                            } // 結束 玩家P評分計算
                    
                            for(let i=0;i < Pscore.length; i++){
                                Pave = Pave + Pscore[i];
                            }
                            // console.log("P評分總分數:",Pave);
                            Pave = Pave / Pscore.length;
                    
                            // 更新使用者Pscore
                            for(let i=0;i < UserRFMP.length; i++){
                                //非同步
                                User.updatePscore(UserRFMP[i][0], UserRFMP[i][8] ,function (err, record) {
                                    if (err) throw err;
                                })
                            }
                            console.log("P評分平均:",Pave);
                            // console.log("P有資料:",Phavedata.length);
                            // console.log("P評分長度:",Pscore.length);

                            // 計算 RFMP值 以及 學習者類型判斷
                            for(let i=0;i < UserRFMP.length; i++){
                                if(UserRFMP[i][5] > Rave){  UserRFMP[i][9] = 1;     }   // UserRFMP[index][9] 存 R值
                                if(UserRFMP[i][6] > Fave){  UserRFMP[i][10] = 1;    }   // UserRFMP[index][10] 存 F值
                                if(UserRFMP[i][7] > Mave){  UserRFMP[i][11] = 1;    }   // UserRFMP[index][11] 存 M值
                                if(UserRFMP[i][8] > Pave){  UserRFMP[i][12] = 1;    }   // UserRFMP[index][12] 存 P值

                                if(UserRFMP[i][5] == -1){  UserRFMP[i][9] = -1;     }   // UserRFMP[index][9] 存 R值
                                if(UserRFMP[i][6] == -1){  UserRFMP[i][10] = -1;    }   // UserRFMP[index][10] 存 F值
                                if(UserRFMP[i][7] == -1){  UserRFMP[i][11] = -1;    }   // UserRFMP[index][11] 存 M值
                                if(UserRFMP[i][8] == -1){  UserRFMP[i][12] = -1;    }   // UserRFMP[index][12] 存 P值

                                /*
                                if(UserRFMP[i][9] == 0 && UserRFMP[i][10] == 0 && UserRFMP[i][11] == 0 && UserRFMP[i][12] == 0){    UserRFMP[i][13] = "關懷型";   } // 1
                                else if(UserRFMP[i][9] == 0 && UserRFMP[i][10] == 0 && UserRFMP[i][11] == 0 && UserRFMP[i][12] == 1){    UserRFMP[i][13] = "成就型";   } // 2
                                else if(UserRFMP[i][9] == 0 && UserRFMP[i][10] == 0 && UserRFMP[i][11] == 1 && UserRFMP[i][12] == 0){    UserRFMP[i][13] = "關懷型";   } // 3
                                else if(UserRFMP[i][9] == 0 && UserRFMP[i][10] == 0 && UserRFMP[i][11] == 1 && UserRFMP[i][12] == 1){    UserRFMP[i][13] = "一般型";   } // 4
                                else if(UserRFMP[i][9] == 0 && UserRFMP[i][10] == 1 && UserRFMP[i][11] == 0 && UserRFMP[i][12] == 0){    UserRFMP[i][13] = "關懷型";   } // 5
                                else if(UserRFMP[i][9] == 0 && UserRFMP[i][10] == 1 && UserRFMP[i][11] == 0 && UserRFMP[i][12] == 1){    UserRFMP[i][13] = "一般型";   } // 6
                                else if(UserRFMP[i][9] == 0 && UserRFMP[i][10] == 1 && UserRFMP[i][11] == 1 && UserRFMP[i][12] == 0){    UserRFMP[i][13] = "扶持型";   } // 7
                                else if(UserRFMP[i][9] == 0 && UserRFMP[i][10] == 1 && UserRFMP[i][11] == 1 && UserRFMP[i][12] == 1){    UserRFMP[i][13] = "成就型";   } // 8
                                else if(UserRFMP[i][9] == 1 && UserRFMP[i][10] == 0 && UserRFMP[i][11] == 0 && UserRFMP[i][12] == 0){    UserRFMP[i][13] = "關懷型";   } // 9
                                else if(UserRFMP[i][9] == 1 && UserRFMP[i][10] == 0 && UserRFMP[i][11] == 0 && UserRFMP[i][12] == 1){    UserRFMP[i][13] = "成就型";   } // 10
                                else if(UserRFMP[i][9] == 1 && UserRFMP[i][10] == 0 && UserRFMP[i][11] == 1 && UserRFMP[i][12] == 0){    UserRFMP[i][13] = "扶持型";   } // 11
                                else if(UserRFMP[i][9] == 1 && UserRFMP[i][10] == 0 && UserRFMP[i][11] == 1 && UserRFMP[i][12] == 1){    UserRFMP[i][13] = "傑出型";   } // 12
                                else if(UserRFMP[i][9] == 1 && UserRFMP[i][10] == 1 && UserRFMP[i][11] == 0 && UserRFMP[i][12] == 0){    UserRFMP[i][13] = "扶持型";   } // 13
                                else if(UserRFMP[i][9] == 1 && UserRFMP[i][10] == 1 && UserRFMP[i][11] == 0 && UserRFMP[i][12] == 1){    UserRFMP[i][13] = "傑出型";   } // 14
                                else if(UserRFMP[i][9] == 1 && UserRFMP[i][10] == 1 && UserRFMP[i][11] == 1 && UserRFMP[i][12] == 0){    UserRFMP[i][13] = "扶持型";   } // 15
                                else if(UserRFMP[i][9] == 1 && UserRFMP[i][10] == 1 && UserRFMP[i][11] == 1 && UserRFMP[i][12] == 1){    UserRFMP[i][13] = "傑出型";   } // 16
                                else if(UserRFMP[i][9] == -1 && UserRFMP[i][10] == -1 && UserRFMP[i][11] == -1 && UserRFMP[i][12] == -1){    UserRFMP[i][13] = "NaN";   } // 不在所選區間內
                                // else if(UserRFMP[i][11] == -1 && UserRFMP[i][12] == -1){    UserRFMP[i][13] = "無闖關者";   }
                                */

                               if(UserRFMP[i][10] == 0 && UserRFMP[i][11] == 0 && UserRFMP[i][12] == 0){    UserRFMP[i][13] = "000型";   } // 1
                               else if(UserRFMP[i][10] == 0 && UserRFMP[i][11] == 0 && UserRFMP[i][12] == 1){    UserRFMP[i][13] = "001型";   }
                               else if(UserRFMP[i][10] == 0 && UserRFMP[i][11] == 1 && UserRFMP[i][12] == 0){    UserRFMP[i][13] = "010型";   }
                               else if(UserRFMP[i][10] == 0 && UserRFMP[i][11] == 1 && UserRFMP[i][12] == 1){    UserRFMP[i][13] = "011型";   }
                               else if(UserRFMP[i][10] == 1 && UserRFMP[i][11] == 0 && UserRFMP[i][12] == 0){    UserRFMP[i][13] = "100型";   }
                               else if(UserRFMP[i][10] == 1 && UserRFMP[i][11] == 0 && UserRFMP[i][12] == 1){    UserRFMP[i][13] = "101型";   }
                               else if(UserRFMP[i][10] == 1 && UserRFMP[i][11] == 1 && UserRFMP[i][12] == 0){    UserRFMP[i][13] = "110型";   }
                               else if(UserRFMP[i][10] == 1 && UserRFMP[i][11] == 1 && UserRFMP[i][12] == 1){    UserRFMP[i][13] = "111型";   }
                               else if(UserRFMP[i][10] == -1 && UserRFMP[i][11] == -1 && UserRFMP[i][12] == -1){    UserRFMP[i][13] = "NaN";   }


                                // 更新使用者 學習者類型
                                //非同步
                                User.updateLearnerType(UserRFMP[i][0], UserRFMP[i][13] ,function (err, record) {
                                    if (err) throw err;
                                    
                                })
                                
                            } // 結束計算 RFMP值 以及 學習者類型判斷

                            // for(let i=0;i < UserRFMP.length; i++){
                            //     console.log("UserRFMP[",i,"]:",UserRFMP[i]);
                            // }
                            
                            resolve();
                            
        
                        }) // 結束 UserSpendTime.getAllUserSpendTimeState
                    }) // 結束 User.getAllUser
                })
            );

            Promise.all(RFtaskStack).then(function () {
                // res.json({"zzzz":"學妹(X)"}); //?
                res.json(null);
            });
            
            
        }
        else if (type == "LoadUser") {
            console.log("LoadUser  33333333333333333333333");
            User.getUser(req.user.id, function (err, users) {
                if (err) throw err;
                res.json(users);
            })
        }
    } catch (error) {
        console.log(error);
    }  
    
});

// 以上宜靜 2020.05.18

router.get('/management', ensureAuthenticated, function (req, res, next) {
    // console.log(req.user)
    if (!req.user.isadmin) { //如有其他管理者 在這加
        return res.redirect('/login')
    }
    res.render('backstage/management', {
        user: req.user.username
    });
});
router.post('/management', function (req, res, next) {
    // Parse Info

    var type = req.body.type
    console.log("home post--------");
    console.log(req.body.type);
    console.log("--------------");
    if (type == "init") {
        var id = req.user.id;
        // console.log(req.user.id);
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            res.json(user);
        })
    } else if (type == "loadmusicData") {
        if (req.session.bkMusicVolumn && req.session.musicLevel && req.session.bkMusicSwitch) {
            req.session.bkMusicVolumn = arseInt(req.body.bkMusicVolumn);
            req.session.bkMusicSwitch = parseInt(req.body.bkMusicSwitch);
            req.session.musicLevel = parseInt(req.body.musicLevel);
            console.log("tstt success");
            scriptData = {
                bkMusicVolumn: req.session.bkMusicVolumn
                , bkMusicSwitch: req.session.bkMusicSwitch
                , musicLevel: req.session.musicLevel
            }
            res.json(JSON.stringify(scriptData));
        }
        else {
            console.log("tstt nome");
            scriptData = {
                bkMusicVolumn: 0.1
                , bkMusicSwitch: 1
                , musicLevel: 1
            }
            req.session.bkMusicVolumn = 0.1;
            req.session.bkMusicSwitch = 1;
            req.session.musicLevel = 1;
            res.json(scriptData);

        }

    }

});

router.get('/managementStatistics', ensureAuthenticated, function (req, res, next) {
    // console.log(req.user)
    if (req.user.isadmin == false) { //如有其他管理者 在這加
        res.redirect('/login')
    }
    res.render('backstage/managementStatistics', {
        user: req.user.username
    });
});
router.post('/managementStatistics', function (req, res, next) {
    // Parse Info
    var type = req.body.type
    console.log("home post--------");
    console.log(req.body.type);
    console.log("--------------");
    if (type == "init") {
        var id = req.user.id;
        // console.log(req.user.id);
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            res.json(user);
        })
    } else if (type == "loadmusicData") {
        if (req.session.bkMusicVolumn && req.session.musicLevel && req.session.bkMusicSwitch) {
            req.session.bkMusicVolumn = arseInt(req.body.bkMusicVolumn);
            req.session.bkMusicSwitch = parseInt(req.body.bkMusicSwitch);
            req.session.musicLevel = parseInt(req.body.musicLevel);
            console.log("tstt success");
            scriptData = {
                bkMusicVolumn: req.session.bkMusicVolumn
                , bkMusicSwitch: req.session.bkMusicSwitch
                , musicLevel: req.session.musicLevel
            }
            res.json(JSON.stringify(scriptData));
        }
        else {
            console.log("tstt nome");
            scriptData = {
                bkMusicVolumn: 0.1
                , bkMusicSwitch: 1
                , musicLevel: 1
            }
            req.session.bkMusicVolumn = 0.1;
            req.session.bkMusicSwitch = 1;
            req.session.musicLevel = 1;
            res.json(scriptData);

        }

    }
    else if (type == "readAllPlay") {
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
        if (user.isadmin == false) { //如有其他管理者 在這加
            res.redirect('/home')
        }

        /*初次一定要做 預設檔案進db*/
        // var dictJson = testDict.dict.code;
        // for (let index = 0; index < dictJson.length; index++) {
        //     console.log(dictJson[index].type, dictJson[index].element);
        //     var newDictionary = new DictionaryRecord({
        //         type:dictJson[index].type,
        //         element:dictJson[index].element
        //     })
        //     DictionaryRecord.createDictionary(newDictionary, function (err, dict) {

        //         console.log(dict);
        //     })
        // }
        // var equipJson = testEquip;
        // var newEquipment = new EquipmentRecord({
        //     levelUpLevel: equipJson.levelUpLevel,
        //     weaponLevel:equipJson.weaponLevel,
        //     armorLevel: equipJson.armorLevel
        // })
        // EquipmentRecord.createEquipment(newEquipment, function (err, dict) {
        //     console.log(dict);
        // })

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
router.post('/', function (req, res, next) {
    console.log(req.body);
    // Parse Info
    var type = req.body.type
    console.log("home post--------");
    console.log(req.body.type);
    console.log("--------------");
    if (type == "init") {
        var id = req.user.id;
        // console.log(req.user.id);
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            res.json(user);
        })
    } else if (type == "loadmusicData") {
        /*if(req.session.bkMusicVolumn && req.session.musicLevel && req.session.bkMusicSwitch){
          req.session.bkMusicVolumn=arseInt(req.body.bkMusicVolumn);
          req.session.bkMusicSwitch=parseInt(req.body.bkMusicSwitch);
          req.session.musicLevel=parseInt(req.body.musicLevel);
          console.log("tstt success");
          scriptData={
            bkMusicVolumn: req.session.bkMusicVolumn
            ,bkMusicSwitch: req.session.bkMusicSwitch
            ,musicLevel: req.session.musicLevel
          }
          res.json(JSON.stringify(scriptData));
        }
        else{
          console.log("tstt nome");
          scriptData={
            bkMusicVolumn: 0.1
            ,bkMusicSwitch: 1
            ,musicLevel: 1
          }
          req.session.bkMusicVolumn=0.1;
          req.session.bkMusicSwitch=1;
          req.session.musicLevel=1;
          res.json(JSON.stringify(scriptData));

        }*/

    }

    /**更新部分 */
    else if (type == "resetEquip") {
        var id = req.user.id;
        User.updateResetEquip(id, function (err, user) {
            if (err) throw err;
            console.log("up   :", user);
            User.getUserById(id, function (err, user) {
                if (err) throw err;
                res.json(user);
            })
        })
    }
    else if (type == "userMap") {
        MapRecord.getMapByUserID(req.user.id, function (err, map) {
            if (err) throw err;
            var dataMap = [];
            for (let indexM = 0; indexM < map.length; indexM++) {
                const element = map[indexM];
                if (element.check == true && element.postStage == 2) {
                    dataMap.push(element);
                }

            }
            res.json(dataMap);
            // console.log(req.user.id);
            // console.log(map);
            // res.json(map);
        })
    }
    /********* */
    else if (type == "weaponLevelup") {
        var id = req.user.id;
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            var weaponLevel = parseInt(user.weaponLevel) + 1
            var levelUpLevel = parseInt(user.levelUpLevel)
            // if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
            //     res.json({ err: "error" });
            // }
            // else {
            levelUpLevel += 1;
            User.updateWeaponLevel(id, weaponLevel, levelUpLevel, function (err, user) {
                if (err) throw err;
                // console.log("up   :", user);
                User.getUserById(id, function (err, user) {
                    if (err) throw err;
                    res.json(user);
                })
            })
            // }
        })
    }
    else if (type == "armorLevelup") {
        var id = req.user.id;
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            var armorLevelup = parseInt(user.armorLevel) + 1
            var levelUpLevel = parseInt(user.levelUpLevel)
            // if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
            //     res.json({ err: "error" });
            // }
            // else {
            levelUpLevel += 1;
            User.updateArmorLevel(id, armorLevelup, levelUpLevel, function (err, user) {
                if (err) throw err;
                // console.log("up   :", user);
                User.getUserById(id, function (err, user) {
                    if (err) throw err;
                    res.json(user);
                })
            })
            // }
        })
    }
    //-----暫時的 ------

    else if (type == "changePassword") {
        var id = req.user.id
        var password = req.body.password
        var oldPassword = req.body.oldPassword
        // console.log(password,oldPassword);

        User.getUserById(id, function (err, user) {
            if (err) throw err;
            if (user) {
                // console.log(user);
                User.comparePassword(oldPassword, user.password, function (err, isMatch) {
                    if (err) throw err
                    if (isMatch) {
                        req.flash('success_msg', 'you are updatePass now')
                        User.updatePassword(user.username, password, function (err, user) {
                            if (err) throw err;
                            // console.log("update :", user);
                        })
                        req.session.updatePassKey = null;
                        return res.json({ responce: 'sucesss' });
                    } else {
                        return res.json({ responce: 'failPassUndifine' });
                    }
                })
            } else {
                return res.json({ responce: 'error' });
            }
        })
        // res.redirect('/login')
    }
    else if (type == "loadDict") {
        DictionaryRecord.getDictionary(function (err, dict) {
            returnData = dict.sort(function (a, b) {
                return a.level > b.level ? 1 : -1;
            });
            res.json(returnData);

        });
    }
    else if (type == "loadEquip") {
        EquipmentRecord.getEquipment(function (err, equip) {
            res.json(equip[0]);

        });
    }
    else if (type == "updateEquip") {
        var seriJson = JSON.parse(req.body.seriJson)
        var armorLevel = seriJson.armorLevel;
        var weaponLevel = seriJson.weaponLevel;
        var levelUpLevel = seriJson.levelUpLevel;
        // console.log(seriJson);
        // console.log(armorLevel,weaponLevel,levelUpLevel);
        EquipmentRecord.updateEquipment(armorLevel, weaponLevel, levelUpLevel, function (err, dictResult) {
            if (err) throw err;
            res.json({ res: true });
        });
    }
    else if (type == "updateDict") {
        var dictType = req.body.dictType
        var dictNum = req.body.dictNum
        var dictValue = req.body.dictValue
        console.log(dictType, dictNum, dictValue);
        DictionaryRecord.getDictionary(function (err, dict) {
            if (err) throw err;
            var typeIndex = 0;
            for (let index = 0; index < dict.length; index++) {
                var element = dict[index];
                if (element.type == dictType) {
                    element.element[dictNum].value = dictValue;
                    typeIndex = index;
                    break;
                    // console.log(element);

                }
            }
            DictionaryRecord.updateDictionaryByType(dict[typeIndex].type, dict[typeIndex].element, function (err, dictResult) {
                if (err) throw err;
                res.json({ res: true });
            });
        });
    }
    //-------------------
    else {

    }

});

router.get('/home', ensureAuthenticated, function (req, res, next) {
    // console.log(req.user);

    User.getUserById(req.user.id, function (err, user) {
        if (err) throw err;
        if (user.isadmin) {
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
        console.log(JSON.stringify(req.user).toString());
        // DictionaryRecord.getDictionary(function (err, dict) {
        //     EquipmentRecord.getEquipment(function (err, equip) {
        //         return res.render('home/home', {
        //             user: req.user.username,
        //             castlelock: lock,
        //             player:JSON.stringify(req.user).toString(),
        //             gameDict:JSON.stringify(dict).toString(),
        //             gameEquip:JSON.stringify(equip[0]).toString()
        //         });
        //     });
        // });
        return res.render('home/home', {
            user: req.user.username,
            castlelock: lock
        });
    })
});
router.post('/home', function (req, res, next) {
    console.log(req.body);
    // Parse Info
    var type = req.body.type
    console.log("home post--------");
    console.log(req.body.type);
    console.log("--------------");
    if (type == "init") {
        var id = req.user.id;
        // console.log(req.user.id);
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            res.json(user);
        })
    } else if (type == "loadmusicData") {
        /*if(req.session.bkMusicVolumn && req.session.musicLevel && req.session.bkMusicSwitch){
          req.session.bkMusicVolumn=arseInt(req.body.bkMusicVolumn);
          req.session.bkMusicSwitch=parseInt(req.body.bkMusicSwitch);
          req.session.musicLevel=parseInt(req.body.musicLevel);
          console.log("tstt success");
          scriptData={
            bkMusicVolumn: req.session.bkMusicVolumn
            ,bkMusicSwitch: req.session.bkMusicSwitch
            ,musicLevel: req.session.musicLevel
          }
          res.json(JSON.stringify(scriptData));
        }
        else{
          console.log("tstt nome");
          scriptData={
            bkMusicVolumn: 0.1
            ,bkMusicSwitch: 1
            ,musicLevel: 1
          }
          req.session.bkMusicVolumn=0.1;
          req.session.bkMusicSwitch=1;
          req.session.musicLevel=1;
          res.json(JSON.stringify(scriptData));

        }*/

    }

    /**更新部分 */
    else if (type == "resetEquip") {
        var id = req.user.id;
        User.updateResetEquip(id, function (err, user) {
            if (err) throw err;
            console.log("up   :", user);
            User.getUserById(id, function (err, user) {
                if (err) throw err;
                res.json(user);
            })
        })
    }
    else if (type == "userMap") {
        MapRecord.getMapByUserID(req.user.id, function (err, map) {
            if (err) throw err;
            var dataMap = [];
            for (let indexM = 0; indexM < map.length; indexM++) {
                const element = map[indexM];
                if (element.check == true && element.postStage == 2) {
                    dataMap.push(element);
                }

            }
            res.json(dataMap);
            // console.log(req.user.id);
            // console.log(map);
            // res.json(map);
        })
    }
    /********* */
    else if (type == "weaponLevelup") {
        var id = req.user.id;
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            var weaponLevel = parseInt(user.weaponLevel) + 1
            var levelUpLevel = parseInt(user.levelUpLevel)
            // if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
            //     res.json({ err: "error" });
            // }
            // else {
            levelUpLevel += 1;
            User.updateWeaponLevel(id, weaponLevel, levelUpLevel, function (err, user) {
                if (err) throw err;
                // console.log("up   :", user);
                User.getUserById(id, function (err, user) {
                    if (err) throw err;
                    res.json(user);
                })
            })
            // }
        })
    }
    else if (type == "armorLevelup") {
        var id = req.user.id;
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            var armorLevelup = parseInt(user.armorLevel) + 1
            var levelUpLevel = parseInt(user.levelUpLevel)
            // if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
            //     res.json({ err: "error" });
            // }
            // else {
            levelUpLevel += 1;
            User.updateArmorLevel(id, armorLevelup, levelUpLevel, function (err, user) {
                if (err) throw err;
                // console.log("up   :", user);
                User.getUserById(id, function (err, user) {
                    if (err) throw err;
                    res.json(user);
                })
            })
            // }
        })
    }
    //-----暫時的 ------
    else if (type == "loadDict") {
        DictionaryRecord.getDictionary(function (err, dict) {
            returnData = dict.sort(function (a, b) {
                return a.level > b.level ? 1 : -1;
            });
            res.json(returnData);

        });
    }
    else if (type == "loadEquip") {
        EquipmentRecord.getEquipment(function (err, equip) {
            res.json(equip[0]);
        });
    }
    else if (type == "updateEquip") {
        var seriJson = JSON.parse(req.body.seriJson)
        var armorLevel = seriJson.armorLevel;
        var weaponLevel = seriJson.weaponLevel;
        var levelUpLevel = seriJson.levelUpLevel;
        // console.log(seriJson);
        // console.log(armorLevel,weaponLevel,levelUpLevel);
        EquipmentRecord.updateEquipment(armorLevel, weaponLevel, levelUpLevel, function (err, dictResult) {
            if (err) throw err;
            res.json({ res: true });
        });
    }
    else if (type == "changePassword") {
        var id = req.user.id
        var password = req.body.password
        var oldPassword = req.body.oldPassword
        // console.log(password,oldPassword);

        User.getUserById(id, function (err, user) {
            if (err) throw err;
            if (user) {
                // console.log(user);
                User.comparePassword(oldPassword, user.password, function (err, isMatch) {
                    if (err) throw err
                    if (isMatch) {
                        req.flash('success_msg', 'you are updatePass now')
                        User.updatePassword(user.username, password, function (err, user) {
                            if (err) throw err;
                            // console.log("update :", user);
                        })
                        req.session.updatePassKey = null;
                        return res.json({ responce: 'sucesss' });
                    } else {
                        return res.json({ responce: 'failPassUndifine' });
                    }
                })
            } else {
                return res.json({ responce: 'error' });
            }
        })
        // res.redirect('/login')
    }

    //-------------------
    else {

    }

});


router.get('/logout', function (req, res, next) {
    req.logout()//將使用者存在 session 的資料作廢(passport提供的)
    req.flash('success_msg','You are logged out')
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
    var gameMode = req.body.gameMode   // code or blocky
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
            if (gameMode == "blocky" && element.level>=24){
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
                if (entryItem.versionID == element.versionID) {
                    returnData.push(
                        entryItem[mainDescription]
                    );
                    break;
                }
            }
        }

        
        // console.log('returnData:'+returnData);
        returnData = returnData.sort(function (a, b) {
            return a.level > b.level ? 1 : -1;
        }); //資料照1~50關順序排好(因為資料庫裡原本是亂的)
        res.json(returnData);
    })

});

router.post('/loadThisLevelGameMapMap', function (req, res, next) {
    var level = req.body.level
    console.log(req.body,level);
    var start = 0, end = 50;
    GameMapRecord.getMap(function (err, mapData){
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
