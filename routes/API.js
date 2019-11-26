var express = require('express');
var router = express.Router();

var UserLogin = require('../models/userLogin')
var User = require('../models/user')

var multer = require("multer");

router.post('/createUserLoginState', function (req, res, next) {
    let date = req.body;
    if (date.username == "" || date.email == "") {
        return res.json({ responce: 'no user data' });
    }
    var newUserLoginState = new UserLogin({
        username: date.username,
        name: date.user,
        email: date.email,
        startDate: date.startDate,
        endDate: date.endDate
    })
    UserLogin.createUserLoginState(newUserLoginState, function (err, userLoginState) {
        if (err) throw err;
        return res.json({ responce: 'sucesss' });
    })
});

router.post('/downloadUserPlayTimes', function (req, res, next) {
    UserLogin.getAllUserLoginState(function (err, userLoginState) {
        if (err) throw err;

        var processList = [];
        for (let index = 0; index < userLoginState.length; index++) {
            const element = userLoginState[index];
            var isProcessed = false;
            for (let userIndex = 0; userIndex < processList.length; userIndex++) {
                const userInfo = processList[userIndex];
                if (userInfo.username == element.username && userInfo.email == element.email) {
                    isProcessed = true;
                    processList[userIndex].LoginTime.push({
                        startDate: element.startDate,
                        endDate: element.endDate,
                        playState: []
                    });
                    break;
                }
            }
            if (!isProcessed) {
                processList.push({
                    username: element.username,
                    email: element.email,
                    LoginTime: [
                        {
                            startDate: element.startDate,
                            endDate: element.endDate,
                            playState: []
                        }
                    ]
                })
            }
        }

        for (let index = 0; index < processList.length; index++) {
            var list = processList[index].LoginTime;
            //由小排到到
            list.sort(function (a, b) {
                if (a.startDate < b.startDate) {
                    return -1;
                }
                if (a.startDate > b.startDate) {
                    return 1;
                }
                return 0;
            });

            var tempProcessList = [];
            for (let dateIndex = 0; dateIndex < list.length; dateIndex++) {
                var element = list[dateIndex];
                var tPListLength = tempProcessList.length;
                if (tPListLength > 0) {
                    var tempLess = (element.endDate - tempProcessList[tPListLength - 1].endDate);
                    //判斷秒數
                    if ((tempLess / 1000) < 30) {
                        tempProcessList[tPListLength - 1].endDate = element.endDate;
                    }
                    else {
                        tempProcessList.push(element);
                    }
                }
                else {
                    tempProcessList.push(element);
                }
            }
            processList[index].LoginTime = tempProcessList;

        }
       

        var taskStack = [];
        for (let index = 0; index < processList.length; index++) {
            var element = processList[index];
            taskStack.push(
                new Promise((resolve, reject) => {
                    User.getUserByUsername(element.username, function (err, user) {
                        if (err) throw err;
                        for (let indexTimeBlock = 0; indexTimeBlock < element.LoginTime.length; indexTimeBlock++) {
                            //玩家登陸的區間
                            var loginTimeBlock = element.LoginTime[indexTimeBlock];  //loginTimeBlock ={startDate: ,endDate: ,   playState: []}

                            var EmpireType=["EasyEmpire","MediumEmpire"];
                            
                            for (let index = 0; index < user.EasyEmpire.codeLevel.length; index++) {
                                var levelInfo = user.EasyEmpire.codeLevel[index];
                                var hightStarNum = "0", hightinstructionNum = 9999;
                                for (let gameRecordIndex = 0; gameRecordIndex < levelInfo.challengeLog.length; gameRecordIndex++) {
                                    const gameLog = levelInfo.challengeLog[gameRecordIndex];
                                    var submitTime=new Date(gameLog.submitTime);
                                    var starNum = gameLog.srarNum, instructionNum = gameLog.instructionNum;
                                    if (loginTimeBlock.startDate > submitTime) {
                                        if (starNum > hightStarNum || (starNum == hightStarNum && hightinstructionNum > instructionNum)) {
                                            hightStarNum = starNum;
                                            hightinstructionNum = instructionNum;
                                        }
                                    }
                                    else if (loginTimeBlock.startDate <= submitTime && loginTimeBlock.endDate >= submitTime) {
                                        var isRecordHightScore = false;
                                        if (starNum > hightStarNum || (starNum == hightStarNum && hightinstructionNum > instructionNum)) {
                                            hightStarNum = starNum;
                                            hightinstructionNum = instructionNum;
                                            isRecordHightScore = true;
                                        }
                                        loginTimeBlock.playState.push({
                                            level: levelInfo.level,
                                            submitTime: submitTime,
                                            starNum:starNum,
                                            instructionNum:instructionNum,
                                            isRecordHightScore:isRecordHightScore
                                        })
                                    }
                                    else {
                                        break;
                                    }
                                }
                            }
                        }
                        resolve();
                    })
                })
            );
        }

        Promise.all(taskStack).then(function () {
            // console.log(processList);

            return res.json(processList);
        });
    })
});

module.exports = router;


