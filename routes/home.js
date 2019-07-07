var express = require('express');
var router = express.Router();
// var passport = require('passport')
// var LocalStrategy = require('passport-local').Strategy

var Equipment = require('../models/equipment')
var User = require('../models/user')
var MapRecord = require('../models/map')
router.get('/kuruma', ensureAuthenticated, function (req, res, next) {
    // console.log(req.user)
    res.render('home//kuruma', {
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
            var dataMap=[];
            for (let indexM = 0; indexM < map.length; indexM++) {
                const element = map[indexM];
                if(element.check==true&&element.postStage==2){
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
            if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
                res.json({ err: "error" });
            }
            else {
                levelUpLevel += 1;
                User.updateWeaponLevel(id, weaponLevel, levelUpLevel, function (err, user) {
                    if (err) throw err;
                    console.log("up   :", user);
                    User.getUserById(id, function (err, user) {
                        if (err) throw err;
                        res.json(user);
                    })
                })
            }
        })
    }
    else if (type == "armorLevelup") {
        var id = req.user.id;
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            var armorLevelup = parseInt(user.armorLevel) + 1
            var levelUpLevel = parseInt(user.levelUpLevel)
            if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
                res.json({ err: "error" });
            }
            else {
                levelUpLevel += 1;
                User.updateArmorLevel(id, armorLevelup, levelUpLevel, function (err, user) {
                    if (err) throw err;
                    // console.log("up   :", user);
                    User.getUserById(id, function (err, user) {
                        if (err) throw err;
                        res.json(user);
                    })
                })
            }
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
            }else{
                return res.json({ responce: 'error' });
            }
        })
        // res.redirect('/login')
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
            var dataMap=[];
            for (let indexM = 0; indexM < map.length; indexM++) {
                const element = map[indexM];
                if(element.check==true&&element.postStage==2){
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
            if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
                res.json({ err: "error" });
            }
            else {
                levelUpLevel += 1;
                User.updateWeaponLevel(id, weaponLevel, levelUpLevel, function (err, user) {
                    if (err) throw err;
                    console.log("up   :", user);
                    User.getUserById(id, function (err, user) {
                        if (err) throw err;
                        res.json(user);
                    })
                })
            }


        })
    }
    else if (type == "armorLevelup") {
        var id = req.user.id;
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            var armorLevelup = parseInt(user.armorLevel) + 1
            var levelUpLevel = parseInt(user.levelUpLevel)
            if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
                res.json({ err: "error" });
            }
            else {
                levelUpLevel += 1;
                User.updateArmorLevel(id, armorLevelup, levelUpLevel, function (err, user) {
                    if (err) throw err;
                    // console.log("up   :", user);
                    User.getUserById(id, function (err, user) {
                        if (err) throw err;
                        res.json(user);
                    })
                })
            }
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
            }else{
                return res.json({ responce: 'error' });
            }
        })
        // res.redirect('/login')
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
            if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
                res.json({ err: "error" });
            }
            else {
                levelUpLevel += 1;
                User.updateWeaponLevel(id, weaponLevel, levelUpLevel, function (err, user) {
                    if (err) throw err;
                    console.log("up   :", user);
                    User.getUserById(id, function (err, user) {
                        if (err) throw err;
                        res.json(user);
                    })
                })
            }


        })
    }
    else if (type == "armorLevelup") {
        var id = req.user.id;
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            var armorLevelup = parseInt(user.armorLevel) + 1
            var levelUpLevel = parseInt(user.levelUpLevel)
            if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
                res.json({ err: "error" });
            }
            else {
                levelUpLevel += 1;
                User.updateArmorLevel(id, armorLevelup, levelUpLevel, function (err, user) {
                    if (err) throw err;
                    // console.log("up   :", user);
                    User.getUserById(id, function (err, user) {
                        if (err) throw err;
                        res.json(user);
                    })
                })
            }
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
            if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
                res.json({ err: "error" });
            }
            else {
                levelUpLevel += 1;
                User.updateWeaponLevel(id, weaponLevel, levelUpLevel, function (err, user) {
                    if (err) throw err;
                    console.log("up   :", user);
                    User.getUserById(id, function (err, user) {
                        if (err) throw err;
                        res.json(user);
                    })
                })
            }


        })
    }
    else if (type == "armorLevelup") {
        var id = req.user.id;
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            var armorLevelup = parseInt(user.armorLevel) + 1
            var levelUpLevel = parseInt(user.levelUpLevel)
            if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
                res.json({ err: "error" });
            }
            else {
                levelUpLevel += 1;
                User.updateArmorLevel(id, armorLevelup, levelUpLevel, function (err, user) {
                    if (err) throw err;
                    // console.log("up   :", user);
                    User.getUserById(id, function (err, user) {
                        if (err) throw err;
                        res.json(user);
                    })
                })
            }
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
            if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
                res.json({ err: "error" });
            }
            else {
                levelUpLevel += 1;
                User.updateWeaponLevel(id, weaponLevel, levelUpLevel, function (err, user) {
                    if (err) throw err;
                    console.log("up   :", user);
                    User.getUserById(id, function (err, user) {
                        if (err) throw err;
                        res.json(user);
                    })
                })
            }


        })
    }
    else if (type == "armorLevelup") {
        var id = req.user.id;
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            var armorLevelup = parseInt(user.armorLevel) + 1
            var levelUpLevel = parseInt(user.levelUpLevel)
            if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
                res.json({ err: "error" });
            }
            else {
                levelUpLevel += 1;
                User.updateArmorLevel(id, armorLevelup, levelUpLevel, function (err, user) {
                    if (err) throw err;
                    // console.log("up   :", user);
                    User.getUserById(id, function (err, user) {
                        if (err) throw err;
                        res.json(user);
                    })
                })
            }
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

router.get('/managementUser', ensureAuthenticated, function (req, res, next) {
    // console.log(req.user)
    if(req.user.username!="NKUSTCCEA"){ //如有其他管理者 在這加
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
        var userstatus=req.body.userstatus;
        var userId=req.body.userId;
        User.updateUserStatus(userId,userstatus, function (err, users) {
            if (err) throw err;
            res.json(users);
        })
    }

});

router.get('/management', ensureAuthenticated, function (req, res, next) {
    // console.log(req.user)
    if(req.user.username!="NKUSTCCEA"){ //如有其他管理者 在這加
        res.redirect('/login')
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
    if(req.user.username!="NKUSTCCEA"){ //如有其他管理者 在這加
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
        if(user.username!="NKUSTCCEA"){ //如有其他管理者 在這加
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
        res.render('home/homeByManage', {
            user: req.user.username,
            castlelock: lock
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
            var dataMap=[];
            for (let indexM = 0; indexM < map.length; indexM++) {
                const element = map[indexM];
                if(element.check==true&&element.postStage==2){
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
            if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
                res.json({ err: "error" });
            }
            else {
                levelUpLevel += 1;
                User.updateWeaponLevel(id, weaponLevel, levelUpLevel, function (err, user) {
                    if (err) throw err;
                    console.log("up   :", user);
                    User.getUserById(id, function (err, user) {
                        if (err) throw err;
                        res.json(user);
                    })
                })
            }
        })
    }
    else if (type == "armorLevelup") {
        var id = req.user.id;
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            var armorLevelup = parseInt(user.armorLevel) + 1
            var levelUpLevel = parseInt(user.levelUpLevel)
            if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
                res.json({ err: "error" });
            }
            else {
                levelUpLevel += 1;
                User.updateArmorLevel(id, armorLevelup, levelUpLevel, function (err, user) {
                    if (err) throw err;
                    // console.log("up   :", user);
                    User.getUserById(id, function (err, user) {
                        if (err) throw err;
                        res.json(user);
                    })
                })
            }
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
            }else{
                return res.json({ responce: 'error' });
            }
        })
        // res.redirect('/login')
    }

    //-------------------
    else {

    }

});

router.get('/home', ensureAuthenticated, function (req, res, next) {
    // console.log(req.user)

    User.getUserById(req.user.id, function (err, user) {
        if (err) throw err;
         if(user.username=="NKUSTCCEA"){ //如有其他管理者 在這加
            res.redirect('/management')
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
        res.render('home/home', {
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
            var dataMap=[];
            for (let indexM = 0; indexM < map.length; indexM++) {
                const element = map[indexM];
                if(element.check==true&&element.postStage==2){
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
            if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
                res.json({ err: "error" });
            }
            else {
                levelUpLevel += 1;
                User.updateWeaponLevel(id, weaponLevel, levelUpLevel, function (err, user) {
                    if (err) throw err;
                    console.log("up   :", user);
                    User.getUserById(id, function (err, user) {
                        if (err) throw err;
                        res.json(user);
                    })
                })
            }
        })
    }
    else if (type == "armorLevelup") {
        var id = req.user.id;
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            var armorLevelup = parseInt(user.armorLevel) + 1
            var levelUpLevel = parseInt(user.levelUpLevel)
            if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
                res.json({ err: "error" });
            }
            else {
                levelUpLevel += 1;
                User.updateArmorLevel(id, armorLevelup, levelUpLevel, function (err, user) {
                    if (err) throw err;
                    // console.log("up   :", user);
                    User.getUserById(id, function (err, user) {
                        if (err) throw err;
                        res.json(user);
                    })
                })
            }
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
            }else{
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
    req.logout()
    req.flash('success_msg', 'You are logged out')
    res.redirect('/login')
})

module.exports = router;

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', 'you are not logged in')
        res.redirect('/login')
    }
}
