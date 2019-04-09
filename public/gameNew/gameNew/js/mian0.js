
class User {
    constructor(key) {
        this.key = key;
    }
}
const user1 = new User("CVMRMWLFp6Okr1UksgGo0fqP7qstkSdHrKCz6OBHzU");
const runApi = 'https://api.runmycode.online/run'
let lang = 'cpp', inputStr = "", codeStr = "";
var mapNum = "game01";
var map = [];    ///0 是草地  1是沙漠  2是海洋
var people_init;    //x,y,面相   0->  1^  2<-  3 down
var end_init = [];  //x,y,面相        0- 1 |
var arrowObject = [], mapObject = []; //問號石頭[2] 是對於問號的方向
var imgObject = [], mapwinLinit;
var imgDic = new Array();  //0 是石頭 1是樹
var mapSize;
var edgeToWidth, edgeToHeight;
var mode = "easygame";
var data, Res_data, width, height;
var action_code = [], action_now = 0, quicklyCD = [];
var onChanged = false;
var onChanging = false;
var stepSpeed = 2, turnSpeed = 5, coinEatSpeed = 5, temporaryStorageX, temporaryStorageY;  //  1 2 5
var now_PeooleEESW, old_PeooleEESW;
var now_PeooleX, old_PeooleX;
var now_PeooleY, old_PeooleY;
var gameEndingCode = 0;   //0 未完成 1完成 2經過終點線 3駛出地圖_失敗 4撞到障礙物_失敗  5編譯失敗    10
var gameEndingCodeDic = new Array();  //0 未完成 1完成 2經過終點線 3駛出地圖_失敗 4撞到障礙物_失敗  5編譯失敗
var iscodesheetTeseLive = false, decodeMod = 1; //0 api 編譯  1 自行編譯     //測試 先佔為1
var decodeOutput = "";
var textarea_0 = document.getElementById('textarea_0');
var textarea_1 = document.getElementById('textarea_1');
var btn1 = document.getElementById('btn1');
var iscreatecanvas = 0;  //0 fase 1 true 2 load success
var iscreateImg = 0;  //0 fase 1 true 2 load success

var codeValue;
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        codeValue = this.responseText;
    }
};
xmlhttp.open("GET", "../json/code.text", true);
xmlhttp.send();


textarea_0.value = [
    '',
    '#include <stdio.h>',
    '#include <stdlib.h>',
    '',
    'int main(int argc, char* argv[]) {',
    '  step();',
    ' turnRight();',
    '  step();',
    '  turnLeft();',
    '   step();',
    '  return 0;',
    '}'
].join('\n')


function setup() {
    var path = ["stone", "tree", "tank", "bot",
        "car", "endline", "questionMark", "F",
        "L", "R", "coin", "boon",
        "arrow", "lock", "lock2", "bullet",
        "boon_hit", "questionstone", "arrowWite", "enemyTank"
    ]
    for (var i = 0; i < path.length; ++i) {
        var imgpath = "image/" + path[i] + ".png";
        var img = loadImage(imgpath);
        imgObject.push(img), imgDic[path[i]] = i.toString();
    }
    gameEndingCodeDic['0'] = "未完成";
    gameEndingCodeDic['1'] = "完成";
    gameEndingCodeDic['2'] = "經過終點線了,差一點好可惜";
    gameEndingCodeDic['3'] = "駛出地圖_失敗";
    gameEndingCodeDic['4'] = "撞到障礙物_失敗";
    gameEndingCodeDic['5'] = "編譯失敗";
    gameEndingCodeDic['6'] = "被炸彈炸死";
    init_setup();

    iscreateImg = 1;
}
function init_setup() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(this.responseText);
            Res_data = JSON.parse(JSON.stringify(data));
            loadData();
        }
    };
    xmlhttp.open("GET", "../json/map/maptest.json", true);
    xmlhttp.send();

    //測試 code sheet 能不能用
    var testcode = `#include <iostream>
    using namespace std; 
    int main(int argc, char* argv[]) {
      cout<<"system_test_codesheet_sucess";
      return 0;
    }`
    var runInput = "";
    const url = `${runApi}/${lang}?platform=codesheet&args=${encodeURIComponent(runInput)}`;
    call_codesheet_Api(url, user1.key, testcode);

}

function loadData() {
    let mapNumber = data;
    map = mapNumber['mapValue'];
    mapSize = Math.sqrt(mapNumber['mapSize']);
    people_init = mapNumber['people_init'];
    end_init = mapNumber['end_init'];
    mapObject = mapNumber['obj'];
    mapwinLinit = mapNumber['winLinit'];
    var s1 = mapwinLinit["threeStar"], s2 = mapwinLinit["twoStar"];
    var linit = "/* 三星限:" + s1 + "個動作  \n   二星限:" + s2 + "個動作  \n   一星限至為滿足過關條件即可*/ \n";
    var stemp = textarea_0.value.substr(textarea_0.value.indexOf('#'));
    textarea_0.value = linit + stemp;

    arrowObject = [];
    for (var i = 0; i < mapObject.length; ++i) {
        var obj = mapObject[i];
        if (obj["type"] == "arrow") {
            arrowObject.push([obj, i]);
        }
    }
    for (var i = 0; i < mapSize; ++i) {
        quicklyCD.push([]);
        for (var j = 0; j < mapSize; ++j) {
            quicklyCD[i].push(0);
        }
    }
    var canvas = createCanvas((windowWidth * 0.4), (windowHeight * 0.89));
    canvas.parent('divcanvas');
    canvas.background(211, 211, 211);
    width = canvas.width;
    height = canvas.height;
    edgeToWidth = width / mapSize;
    edgeToHeight = height / mapSize;
    iscreatecanvas = 1;
    action_now = 0;
}
function endgame() {
    onChanged = false;
    onChanging = false;
    action_code = [];

    for (var i = 0; i < end_init.length; ++i) {
        var dx = end_init[i]["postion"][0] * edgeToWidth, dy = end_init[i]["postion"][1] * edgeToHeight, drotate = (360 - end_init[i]["postion"][2] * 90) % 180;
        if (dx == old_PeooleX && dy == old_PeooleY) {
            if (drotate == (((old_PeooleEESW + 360) % 180) + 90) % 180) {
                gameEndingCode = 1;
            }
            else {
                gameEndingCode = 2;
            }
        }
    }
    // var coinN = true;
    for (var i = 0; i < mapObject.length; ++i) {
        if (mapObject[i]["type"] == "'coin") {
            // coinN = false;
            gameEndingCode = 0;
            break;
        }
    }

    var result = "";
    if (gameEndingCode == 1) {
        //actionCode
        var str = textarea_0.value, temp = "";
        var systemCall = ["step", "step(", "step()", "step();",
            "turnRight", "turnRight(", "turnRight()", "turnRight();",
            "turnLeft", "turnLeft(", "turnLeft()", "turnLeft();",
            "fire", "fire(", "fire()", "fire();"];
        var counter = 0;
        temp = str;
        var words = temp.split('\n');
        for (var i = 0; i < words.length; ++i) {
            var wt = words[i].split(' ');
            for (var wi = 0; wi < wt.length; ++wi) {
                for (var di = 0; di < systemCall.length; ++di) {
                    if (wt[wi] == systemCall[di]) {
                        ++counter;
                        break;
                    }
                }
            }
        }
        //fun
        var splitstr = str.substr(0, str.indexOf("main"));

        console.log(splitstr);
        var numofPostive = 0, wIndex = false;
        for (var i = str.indexOf("main"); i < str.length; ++i) {
            if (str[i] == '{') {
                if (!wIndex) {
                    numofPostive = 1;
                    wIndex = true;
                } else {
                    ++wIndex;
                    console.log("777");

                }
            } else if (str[i] == '}') {
                --numofPostive;

                console.log("---");
                if (numofPostive == 0) {
                    numofPostive = i;
                    break;
                }
            }
        }
        splitstr = splitstr + str.substr(numofPostive);
        console.log(splitstr);




        temp = splitstr.split('').reverse().join('');//字串反轉 int ad(){ abc } -> }  cba { )(ad tin
        // console.log(temp);
        var funname = [];
        var funcounter = 0;
        var tempStr;
        index = 0;
        while (index > -1) {
            index = temp.indexOf('{');
            if (index > -1) {
                tempStr = temp.substr(index + 1);  // '{'.len=1
                temp = tempStr;
                index = temp.indexOf('(');
                tempStr = temp.substr(index + 1);  // '('.len=1
                temp = tempStr;
                var ws = temp.split(' ');
                if (ws[0] != "niam") {
                    funname.push(ws[0].split('').reverse().join('')); //補正回來 } cba { )(cba --> abc
                }
                index = 0;
            }
        }
        index = str.indexOf("main");
        tempStr = str.substr(index + 4);   // 'main'.len=4
        index = tempStr.indexOf("}");
        temp = tempStr.substr(0, index); //取main 函是裡頭的
        console.log(funname);

        for (var i = 0; i < funname.length; ++i) {
            var tp = temp.split(funname[i]);
            if (tp.length > 1) {
                for (var i = 0; i < tp.length - 1; ++i) {
                    if (tp[i][tp[i].length - 1] == " " && (tp[i + 1][0] == " " || tp[i + 1][0] == "(")) {
                        console.log();
                        ++funcounter;
                    }
                    else {
                        console.log(tp[i][tp[i].length - 1], tp[i + 1][0]);
                    }
                }
            }
        }
        // console.log("counter:", counter);
        // console.log("funcounter:", funcounter);

        console.log("counter" + counter);
        console.log("funcounter" + funcounter);
        var tc = counter + funcounter;
        console.log("總動作為:", tc);

        // if(coinN){
        if (mapwinLinit["threeStar"][0] >= tc) {
            result = "拍手!恭喜你獲得三星! \n~來繼續挑戰下關吧~";
        }
        else if (mapwinLinit["twoStar"][0] >= tc) {
            result = "恭喜你二星! \n~差一點就有一星了!加油~";
        }
        else {
            result = "好可惜只有一星! \n~在檢查看看有沒有可以縮減的~";
        }

        // }
        // else{
        //     result="好可惜只有一星! \n~在檢查看看有沒有可以縮減的~";
        //     // alert(gameEndingCodeDic[gameEndingCode]);
        // }

    }
    else {
        result = gameEndingCodeDic[gameEndingCode];
        console.log(gameEndingCodeDic[gameEndingCode]);
        // alert(gameEndingCodeDic[gameEndingCode]);
    }
    alert(result);
}

function collisionDetection() {
    if (!(old_PeooleX >= 0 && old_PeooleY >= 0 && old_PeooleX < edgeToWidth * mapSize && old_PeooleY < edgeToHeight * mapSize)) {
        gameEndingCode = 3;
        return true;
        // endgame();
    }
    var ox = Math.floor(old_PeooleX / edgeToWidth), oy = Math.floor(old_PeooleY / edgeToHeight);
    if (quicklyCD[ox][oy] == 1) {
        return false;
    }
    else {
        for (var i = 0; i < mapObject.length; ++i) {
            var obj = mapObject[i];
            if (!(obj["type"] == "coin" || obj["type"] == "arrow" || obj["type"] == "questionMark" || obj["type"] == "arrowWite")) {
                if (!(obj["type"] == "boon" || obj["type"] == "L") || obj["type"] == "R" || obj["type"] == "F") {
                    // var dx = obj["postion"][0], dy = obj["postion"][1];
                    // console.log(obj["type"], dx, dy, old_PeooleX, old_PeooleY);
                    if (obj["postion"][0] == ox && obj["postion"][1] == oy) {
                        gameEndingCode = 4;
                        quicklyCD[ox][oy] = 1;
                        return true;
                        // endgame();
                    }
                }
            }
        }
        for (var i = 0; i < end_init.length; ++i) {
            var dx = end_init[i]["postion"][0], dy = end_init[i]["postion"][1];
            if (dx == ox && dy == oy) {
                gameEndingCode = 2;
                break;
            }
        }
        quicklyCD[ox][oy] = 1;
        return false;
    }
}
function draw() {
    // //
    if (iscreatecanvas == 1 && iscreateImg == 1) {
        var dx = people_init["postion"][0] * edgeToWidth, dy = people_init["postion"][1] * edgeToHeight, drotate = 360 - people_init["postion"][2] * 90;
        old_PeooleX = dx, old_PeooleY = dy, old_PeooleEESW = drotate;
        now_PeooleX = dx, now_PeooleY = dy, now_PeooleEESW = drotate;
        updateCanvas();
        iscreatecanvas = 2;
    }
    if (iscreatecanvas > 1 && iscreatecanvas < 100) {
        ++iscreatecanvas;
        if (iscreatecanvas - 50 == 0) {
            updateCanvas();
        }
    }

    if (onChanged) {
        // console.log("running");
        if (!onChanging) {
            now_PeooleEESW = old_PeooleEESW;
            now_PeooleX = old_PeooleX;
            now_PeooleY = old_PeooleY;
            coinEatSpeed = 5;

        }
        ////new/////
        while (action_code.length - action_now > 0) {
            // console.log(action_now,action_code);

            switch (action_code[action_now]) {
                /////step/////
                case "system_action_stepUp":
                    if (!onChanging) {
                        old_PeooleY -= edgeToHeight;
                        onChanging = true;
                    }
                    else {
                        now_PeooleY -= stepSpeed;
                        if (now_PeooleY <= old_PeooleY) {
                            onChanging = false;
                            ++action_now;
                            onChanged = !collisionDetection();
                        }
                    }
                    break;
                case "system_action_stepDown":
                    if (!onChanging) {
                        old_PeooleY += edgeToHeight;
                        onChanging = true;
                    }
                    else {
                        now_PeooleY += stepSpeed;
                        if (now_PeooleY >= old_PeooleY) {
                            onChanging = false;
                            ++action_now;
                            onChanged = !collisionDetection();
                        }
                    }
                    break;
                case "system_action_stepRight":
                    if (!onChanging) {
                        old_PeooleX += edgeToWidth;
                        onChanging = true;
                    }
                    else {
                        now_PeooleX += stepSpeed;
                        if (now_PeooleX >= old_PeooleX) {
                            onChanging = false;
                            ++action_now;
                            onChanged = !collisionDetection();
                        }
                    }
                    break;
                case "system_action_stepLeft":
                    if (!onChanging) {
                        old_PeooleX -= edgeToWidth;
                        onChanging = true;
                    }
                    else {
                        now_PeooleX -= stepSpeed;
                        if (now_PeooleX <= old_PeooleX) {
                            onChanging = false;
                            ++action_now;
                            onChanged = !collisionDetection();
                        }
                    }
                    break;
                case "system_action_turnRight":
                    if (!onChanging) {
                        now_PeooleEESW = old_PeooleEESW;
                        old_PeooleEESW += 90;
                        old_PeooleEESW = (old_PeooleEESW + 360) % 360;
                        onChanging = true;
                    }
                    else {
                        now_PeooleEESW += turnSpeed;
                        now_PeooleEESW = (now_PeooleEESW + 360) % 360;
                        if (now_PeooleEESW == old_PeooleEESW) {
                            onChanging = false;
                            ++action_now;
                        }
                    }
                    break;
                case "system_action_turnLeft":
                    if (!onChanging) {
                        now_PeooleEESW = old_PeooleEESW;
                        old_PeooleEESW -= 90;
                        old_PeooleEESW = (old_PeooleEESW + 360) % 360;
                        onChanging = true;
                    }
                    else {
                        now_PeooleEESW -= turnSpeed;
                        now_PeooleEESW = (now_PeooleEESW + 360) % 360;
                        if (now_PeooleEESW == old_PeooleEESW) {
                            onChanging = false;
                            ++action_now;
                        }
                    }
                    break;
                //////////
                case "system_eatcoin":
                    if (!onChanging) {
                        coinEatSpeed = 5;
                        onChanging = true;
                    }
                    else {
                        ++coinEatSpeed;
                        if (coinEatSpeed == 10) {
                            var index = 0;
                            for (var i = 0; i < mapObject.length; ++i) {
                                var obj = mapObject[i];
                                var dx = obj["postion"][0] * edgeToWidth, dy = obj["postion"][1] * edgeToHeight;
                                if (obj["type"] == "coin" && dx == old_PeooleX && dy == old_PeooleY) {
                                    index = i;
                                    break;
                                }
                            }
                            var tempObj = mapObject.splice(index, 1);
                            console.log(tempObj);
                            console.log(mapObject);
                            // mapObject=tempObj;
                            onChanging = false;
                            ++action_now;
                        }
                    }
                    break;

                case "system_displayR":
                    if (!onChanging) {
                        coinEatSpeed = 5;
                        onChanging = true;
                    }
                    else {
                        ++coinEatSpeed;
                        if (coinEatSpeed == 10) {
                            var index = 0;
                            var event = 0;
                            for (var i = 0; i < mapObject.length; ++i) {
                                // questionstone  questionMark
                                var obj = mapObject[i];
                                if (obj["type"] == "questionMark") {
                                    mapObject[i]['type'] = "R";
                                    ++event;
                                    if (event == 2) {
                                        break;
                                    }
                                }
                                else if (obj["type"] == "questionstone" && obj["postion"][2] == (old_PeooleEESW + 3) % 4) {
                                    var dx = obj["postion"][0] * edgeToWidth, dy = obj["postion"][1] * edgeToHeight;
                                    var dt = Math.abs(old_PeooleX - dx) + Math.abs(old_PeooleY - dy);
                                    if (dt == edgeToWidth || dt == edgeToHeight) {
                                        ++event;
                                        index = i;
                                        if (event == 2) {
                                            break;
                                        }
                                    }
                                }
                            }
                            mapObject.splice(index, 1);
                            onChanging = false;
                            ++action_now;
                        }
                    }
                    break;
                case "system_displayL":
                    if (!onChanging) {
                        coinEatSpeed = 5;
                        onChanging = true;
                    }
                    else {
                        ++coinEatSpeed;
                        if (coinEatSpeed == 10) {
                            var index = 0;
                            var event = 0;
                            for (var i = 0; i < mapObject.length; ++i) {
                                // questionstone  questionMark
                                var obj = mapObject[i];
                                if (obj["type"] == "questionMark") {
                                    mapObject[i]['type'] = "L";
                                    ++event;
                                    if (event == 2) {
                                        break;
                                    }
                                }
                                else if (obj["type"] == "questionstone" && obj["postion"][2] == (old_PeooleEESW + 1) % 4) {
                                    var dx = obj["postion"][0] * edgeToWidth, dy = obj["postion"][1] * edgeToHeight;
                                    var dt = Math.abs(old_PeooleX - dx) + Math.abs(old_PeooleY - dy);
                                    if (dt == edgeToWidth || dt == edgeToHeight) {
                                        ++event;
                                        index = i;
                                        if (event == 2) {
                                            break;
                                        }
                                    }
                                }
                            }
                            mapObject.splice(index, 1);
                            onChanging = false;
                            ++action_now;
                        }
                    }
                    break;
                case "system_displayF":
                    if (!onChanging) {
                        coinEatSpeed = 5;
                        onChanging = true;
                    }
                    else {
                        ++coinEatSpeed;
                        if (coinEatSpeed == 10) {
                            var index = 0;
                            var event = 0;
                            for (var i = 0; i < mapObject.length; ++i) {
                                // questionstone  questionMark
                                var obj = mapObject[i];
                                if (obj["type"] == "questionMark") {
                                    mapObject[i]['type'] = "L";
                                    ++event;
                                    if (event == 2) {
                                        break;
                                    }
                                }
                                else if (obj["type"] == "questionstone" && obj["postion"][2] == (old_PeooleEESW) % 4) {
                                    var dx = obj["postion"][0] * edgeToWidth, dy = obj["postion"][1] * edgeToHeight;
                                    var dt = Math.abs(old_PeooleX - dx) + Math.abs(old_PeooleY - dy);
                                    if (dt == edgeToWidth || dt == edgeToHeight) {
                                        ++event;
                                        index = i;
                                        if (event == 2) {
                                            break;
                                        }
                                    }
                                }
                            }
                            mapObject.splice(index, 1);
                            onChanging = false;
                            ++action_now;
                        }
                    }
                    break;
                case "system_arrow_finish":
                    var index = 0;
                    for (var i = 0; i < arrowObject.length; ++i) {
                        var obj = arrowObject[i][0];
                        // console.log(arrowObject.length,obj);
                        var dx = obj["postion"][0] * edgeToWidth, dy = obj["postion"][1] * edgeToHeight;
                        if (dx == old_PeooleX && dy == old_PeooleY) {
                            mapObject[arrowObject[i][1]]["type"] = "arrowWite";
                            arrowObject.splice(i, 1);

                            break;
                        }
                    }
                    onChanging = false;
                    ++action_now;
                    break;
                case "system_arrow_unlock":
                    if (!onChanging) {
                        coinEatSpeed = 5;
                        onChanging = true;
                    }
                    else {
                        ++coinEatSpeed;
                        if (coinEatSpeed == 10) {
                            var index = 0;
                            for (var i = 0; i < mapObject.length; ++i) {
                                // questionstone  questionMark
                                var obj = mapObject[i];
                                if (obj["type"] == "lock" && obj["unlock"] == "lock_arrow") {
                                    index = i;
                                    break;
                                }
                            }
                            mapObject.splice(index, 1);
                            onChanging = false;
                            ++action_now;
                        }
                    }
                    break;
                case "system_output_unlock":
                    if (!onChanging) {
                        coinEatSpeed = 5;
                        onChanging = true;
                    }
                    else {
                        ++coinEatSpeed;
                        if (coinEatSpeed == 10) {
                            var index = 0;
                            for (var i = 0; i < mapObject.length; ++i) {
                                var obj = mapObject[i];
                                if (obj["type"] == "lock2" && obj["unlock"] == "lock_output") {
                                    var dx = obj["postion"][0] * edgeToWidth, dy = obj["postion"][1] * edgeToHeight;
                                    var dt = Math.abs(old_PeooleX - dx) + Math.abs(old_PeooleY - dy);
                                    if (dt == edgeToWidth || dt == edgeToHeight) {

                                        // textSize(14);
                                        // textStyle(BOLD);
                                        // text(obj["response"],dx+1,dy+1);
                                        // for(var ii=0;ii<1000;++ii){

                                        // }
                                        index = i;
                                        mapObject.splice(index, 1);
                                        onChanging = false;
                                        ++action_now;
                                        break;
                                    }
                                    else {
                                        onChanging = false;
                                        ++action_now;
                                    }
                                }
                            }

                        }
                    }
                    break;
                case "system_fire_hit":
                    if (!onChanging) {
                        onChanging = true;
                        coinEatSpeed = 5;
                    }
                    else {
                        if (boonAnimation(old_PeooleX, old_PeooleY, coinEatSpeed)) {
                            onChanging = false;
                            ++action_now;
                            break;
                        }
                        ++coinEatSpeed;
                    }
                    break;
                case "system_fire_oneDistHit":
                    if (!onChanging) {
                        var bullet = {
                            "type": "bullet",
                            "postion": [old_PeooleX, old_PeooleY, parseInt(old_PeooleEESW / 90) % 4],
                        };
                        mapObject.push(bullet);
                        // console.log(mapObject);
                        onChanging = true;
                        coinEatSpeed = 5;
                    }
                    else {
                        var tempObj = mapObject[mapObject.length - 1], dx = 0, dy = 0;
                        if (tempObj["postion"][2] == 0) {
                            tempObj["postion"][0] += stepSpeed;
                            dx = 1 * edgeToWidth;
                        }
                        else if (tempObj["postion"][2] == 1) {
                            tempObj["postion"][1] += stepSpeed;
                            dy = 1 * edgeToHeight;
                        }
                        else if (tempObj["postion"][2] == 2) {
                            tempObj["postion"][0] -= stepSpeed;
                            dx = -1 * edgeToWidth;
                        }
                        else if (tempObj["postion"][2] == 3) {
                            tempObj["postion"][1] -= stepSpeed;
                            dy = -1 * edgeToHeight;
                        }
                        var dt = Math.abs(old_PeooleX - tempObj["postion"][0]) + Math.abs(old_PeooleY - tempObj["postion"][1]);
                        if (dt - (edgeToWidth * 3 / 4) >= 0) {
                            var dt = Math.abs(old_PeooleX - tempObj["postion"][0]) + Math.abs(old_PeooleY - tempObj["postion"][1]);
                            if (boonAnimation(old_PeooleX + dx, old_PeooleY + dy, coinEatSpeed)) {

                                onChanging = false;
                                ++action_now;
                                break;
                            }
                            ++coinEatSpeed;
                        }
                    }
                    break;
                case "system_fire_twoDistHit":
                    if (!onChanging) {
                        var bullet = {
                            "type": "bullet",
                            "postion": [old_PeooleX, old_PeooleY, parseInt(old_PeooleEESW / 90) % 4],
                        };
                        mapObject.push(bullet);
                        // console.log(mapObject);
                        onChanging = true;
                        coinEatSpeed = 5;
                    }
                    else {
                        var tempObj = mapObject[mapObject.length - 1], dx = 0, dy = 0;
                        if (tempObj["postion"][2] == 0) {
                            tempObj["postion"][0] += stepSpeed;
                            dx = 2 * edgeToWidth;
                        }
                        else if (tempObj["postion"][2] == 1) {
                            tempObj["postion"][1] += stepSpeed;
                            dy = 2 * edgeToHeight;
                        }
                        else if (tempObj["postion"][2] == 2) {
                            tempObj["postion"][0] -= stepSpeed;
                            dx = -2 * edgeToHeight;
                        }
                        else if (tempObj["postion"][2] == 3) {
                            tempObj["postion"][1] -= stepSpeed;
                            dy = -2 * edgeToWidth;
                        }
                        var dt = Math.abs(old_PeooleX - tempObj["postion"][0]) + Math.abs(old_PeooleY - tempObj["postion"][1]);
                        if (dt - (edgeToWidth + edgeToWidth * 3 / 4) >= 0) {
                            if (boonAnimation(old_PeooleX + dx, old_PeooleY + dy, coinEatSpeed)) {

                                onChanging = false;
                                ++action_now;
                            }
                            ++coinEatSpeed;
                        }
                    }
                    break;
                case "system_fire_oneDistEnd":
                    if (!onChanging) {
                        var bullet = {
                            "type": "bullet",
                            "postion": [old_PeooleX, old_PeooleY, parseInt(old_PeooleEESW / 90) % 4],
                        };
                        mapObject.push(bullet);
                        // console.log(mapObject);
                        onChanging = true;
                    }
                    else {
                        var tempObj = mapObject[mapObject.length - 1];
                        if (tempObj["postion"][2] == 0) {
                            tempObj["postion"][0] += stepSpeed;
                        }
                        else if (tempObj["postion"][2] == 1) {
                            tempObj["postion"][1] += stepSpeed;
                        }
                        else if (tempObj["postion"][2] == 2) {
                            tempObj["postion"][0] -= stepSpeed;
                        }
                        else if (tempObj["postion"][2] == 3) {
                            tempObj["postion"][1] -= stepSpeed;
                        }
                        var dt = Math.abs(old_PeooleX - tempObj["postion"][0]) + Math.abs(old_PeooleY - tempObj["postion"][1]);
                        if (dt - (edgeToWidth * 3 / 4) >= 0) {
                            mapObject.splice(mapObject.length - 1, 1);
                            onChanging = false;
                            ++action_now;
                            break;
                        }
                    }
                    break;
                case "system_fire_twoDistEnd":
                    if (!onChanging) {
                        var bullet = {
                            "type": "bullet",
                            "postion": [old_PeooleX, old_PeooleY, parseInt(old_PeooleEESW / 90) % 4],
                        };
                        mapObject.push(bullet);
                        // console.log(mapObject);
                        onChanging = true;
                    }
                    else {
                        var tempObj = mapObject[mapObject.length - 1];
                        if (tempObj["postion"][2] == 0) {
                            tempObj["postion"][0] += stepSpeed;
                        }
                        else if (tempObj["postion"][2] == 1) {
                            tempObj["postion"][1] += stepSpeed;
                        }
                        else if (tempObj["postion"][2] == 2) {
                            tempObj["postion"][0] -= stepSpeed;
                        }
                        else if (tempObj["postion"][2] == 3) {
                            tempObj["postion"][1] -= stepSpeed;
                        }
                        var dt = Math.abs(old_PeooleX - tempObj["postion"][0]) + Math.abs(old_PeooleY - tempObj["postion"][1]);
                        if (dt - (edgeToWidth + edgeToWidth * 3 / 4) >= 0) {
                            mapObject.splice(mapObject.length - 1, 1);
                            onChanging = false;
                            ++action_now;
                            break;
                        }
                    }
                    break;
                case "system_fire_boring":
                    if (!onChanging) {
                        var bullet = {
                            "type": "bullet",
                            "postion": [old_PeooleX, old_PeooleY, parseInt(old_PeooleEESW / 90) % 4],
                        };
                        mapObject.push(bullet);
                        // console.log(mapObject);
                        onChanging = true;
                    }
                    else {
                        var tempObj = mapObject[mapObject.length - 1];
                        if (tempObj["postion"][2] == 0) {
                            tempObj["postion"][0] += stepSpeed;
                        }
                        else if (tempObj["postion"][2] == 1) {
                            tempObj["postion"][1] += stepSpeed;
                        }
                        else if (tempObj["postion"][2] == 2) {
                            tempObj["postion"][0] -= stepSpeed;
                        }
                        else if (tempObj["postion"][2] == 3) {
                            tempObj["postion"][1] -= stepSpeed;
                        }
                        var dt = Math.abs(old_PeooleX - tempObj["postion"][0]) + Math.abs(old_PeooleY - tempObj["postion"][1]);
                        if (dt - (edgeToWidth * 2 + edgeToWidth / 2) >= 0) {
                            mapObject.splice(mapObject.length - 1, 1);
                            onChanging = false;
                            ++action_now;
                            break;
                        }
                    }

                    break;
                case "system_finish":
                    if (!onChanging) {
                        coinEatSpeed = 5;
                        onChanging = true;
                    }
                    else {
                        if (coinEatSpeed == 10) {
                            onChanging = false;
                            ++action_now;
                        }
                        ++coinEatSpeed;
                    }

                    break;
                default:
                    console.log("error here");

                    break;

            }
            break;
        }
        //////////
        updateCanvas();

        ////old///
        if (!onChanged || action_code.length - action_now == 0) {
            endgame();
        }

    }
    function boonAnimation(x, y, t) {
        var dx = Math.floor(x / edgeToWidth), dy = Math.floor(y / edgeToWidth);
        // console.log("gggggggg");
        if (t == 5) {
            temporaryStorageX = dx, temporaryStorageY = dy;
            if (mapObject[mapObject.length - 1]["type"] == "bullet") {
                mapObject.splice(mapObject.length - 1, 1);
            }
            var bullet = { "type": "boon_hit", "postion": [dx, dy] };
            mapObject.push(bullet);
            bullet = { "type": "boon_hit", "postion": [dx + 1, dy] };
            mapObject.push(bullet);
            bullet = { "type": "boon_hit", "postion": [dx - 1, dy] };
            mapObject.push(bullet);
            bullet = { "type": "boon_hit", "postion": [dx, dy + 1] };
            mapObject.push(bullet);
            bullet = { "type": "boon_hit", "postion": [dx, dy - 1] };
            mapObject.push(bullet);
            var px = Math.floor(now_PeooleX / edgeToWidth), py = Math.floor(now_PeooleY / edgeToWidth);
            var dist = Math.abs(px - dx) + Math.abs(py - dy);
            if (dist == 1 || dist == 0) {
                now_PeooleX = mapSize * edgeToWidth;
                now_PeooleY = mapSize * edgeToWidth;
                old_PeooleX = mapSize * edgeToWidth;
                old_PeooleY = mapSize * edgeToWidth;
            }
        }
        else if (t == 20) {
            dx = temporaryStorageX, dy = temporaryStorageY;
            for (var i = mapObject.length - 1; i > -1; --i) {
                var obj = mapObject[i];
                if (obj["type"] == "boon_hit" || (obj["type"] == "boon" && obj["postion"][0] == dx && obj["postion"][1] == dy)) {
                    mapObject.splice(i, 1);
                }
                if (!(obj["type"] == "arrow" || obj["type"] == "lock" || obj["type"] == "lock2" || obj["type"] == "coin")) {
                    if (obj["postion"][0] == dx + 1 && obj["postion"][1] == dy) {
                        mapObject.splice(i, 1);
                    }
                    else if (obj["postion"][0] == dx - 1 && obj["postion"][1] == dy) {
                        mapObject.splice(i, 1);
                    }
                    else if (obj["postion"][0] == dx && obj["postion"][1] == dy + 1) {
                        mapObject.splice(i, 1);
                    }
                    else if (obj["postion"][0] == dx && obj["postion"][1] == dy - 1) {
                        mapObject.splice(i, 1);
                    }
                }
            }
            if (now_PeooleX == mapSize * edgeToWidth && now_PeooleY == mapSize * edgeToWidth) {
                onChanged = false;
                updateCanvas();
                gameEndingCode = 6;
            }
            return true;
        }
        else {
            return false;
        }
    }
    // console.log(width);
    // line(0, 0, 20, 0);
}
function updateCanvas() {
    noStroke();
    for (var y = 0; y < mapSize; ++y) {
        for (var x = 0; x < mapSize; ++x) {
            var i = y * mapSize + x;
            if (map[i] == '0') {
                fill('#bafba7');
            }
            else if (map[i] == '1') {
                fill('#FFE599');
            }
            else if (map[i] == '2') {
                fill('#CCE5FF');
            }
            else {
                console.log(map[i]);
            }
            rect(x * edgeToWidth, y * edgeToHeight, edgeToWidth, edgeToHeight);
        }
    }
    stroke(0);
    for (var i = 1; i < mapSize; ++i) {
        // line(i * edgeToHeight, 0, i * edgeToHeight, height);
        // line(0, i * edgeToWidth, width, i * edgeToWidth);
        line(0, i * edgeToHeight, width, i * edgeToHeight);
        line(i * edgeToWidth, 0, i * edgeToWidth, height);
        // line(0,i * edgeToHeight,width, i * edgeToHeight);
        // line(i * edgeToWidth,0, i * edgeToWidth, height);
    }

    for (var i = 0; i < mapObject.length; ++i) {
        var obj = mapObject[i];
        var dx = obj["postion"][0] * edgeToWidth, dy = obj["postion"][1] * edgeToHeight;
        var img = imgObject[parseInt(imgDic[obj["type"]])];
        if (obj["type"] == "arrow" || obj["type"] == "arrowWite" || obj["type"] == "enemyTank") {
            var drotate = 360 - obj["postion"][2] * 90;
            var pg = createGraphics(edgeToWidth, edgeToHeight);
            pg.translate(pg.width / 2, pg.height / 2);
            pg.rotate(PI / 180 * drotate);
            pg.image(img, -edgeToWidth / 2, -edgeToHeight / 2, edgeToWidth, edgeToHeight);
            image(pg, dx, dy, edgeToWidth, edgeToHeight);
        }
        else if (obj["type"] == "bullet") {
            dx = obj["postion"][0], dy = obj["postion"][1];
            var drotate = obj["postion"][2] * 90 + 90;
            var pg = createGraphics(edgeToWidth, edgeToHeight);
            pg.translate(pg.width / 2, pg.height / 2);
            pg.rotate(PI / 180 * drotate);
            pg.image(img, -edgeToWidth / 2, -edgeToHeight / 2, edgeToWidth, edgeToHeight);
            image(pg, dx, dy, edgeToWidth, edgeToHeight);
        }
        else {
            image(img, dx, dy, edgeToWidth, edgeToHeight);
        }

    }

    for (var i = 0; i < end_init.length; ++i) {
        var pg = createGraphics(edgeToWidth, edgeToHeight);
        var dx = end_init[i]["postion"][0] * edgeToWidth, dy = end_init[i]["postion"][1] * edgeToHeight, drotate = 360 - end_init[i]["postion"][2] * 90;
        var img = imgObject[parseInt(imgDic[end_init[i]["type"]])];
        pg.translate(pg.width / 2, pg.height / 2);
        pg.rotate(PI / 180 * drotate);
        pg.image(img, -edgeToWidth / 2, -edgeToHeight / 2, edgeToWidth, edgeToHeight);
        image(pg, dx, dy, edgeToWidth, edgeToHeight);
    }

    var pg = createGraphics(edgeToWidth, edgeToHeight);
    var dx = now_PeooleX, dy = now_PeooleY, drotate = now_PeooleEESW;
    var img = imgObject[parseInt(imgDic[people_init["type"]])];
    pg.translate(pg.width / 2, pg.height / 2);
    pg.rotate(PI / 180 * drotate);
    pg.image(img, -edgeToWidth / 2, -edgeToHeight / 2, edgeToWidth, edgeToHeight);
    image(pg, dx, dy, edgeToWidth, edgeToHeight);

    return true;
}

function codeToCompiler() {
    //輸出字串處理
    var addfun = codeValue;
    var indexof = textarea_0.value.indexOf("int main(");
    var tempStr = textarea_0.value.indexOf("{", indexof);
    var tempBefore = textarea_0.value.substr(0, tempStr + 1);
    var tempAfter = textarea_0.value.substr(tempStr + 1);
    tempBefore += "input_init();";
    tempBefore += tempAfter;
    tempStr = tempBefore;
    tempBefore = tempStr.substr(0, indexof - 1);
    tempAfter = tempStr.substr(indexof);
    tempBefore += addfun;
    tempBefore += tempAfter;
    // console.log(tempBefore);

    var mapStr = map;
    // console.log("map為:",mapStr);
    var peopleStr = people_init["postion"][0].toString() + " " + people_init["postion"][1].toString() + " " + people_init["postion"][2].toString();
    if (people_init["hp"]) {
        peopleStr = peopleStr + " " + people_init["hp"] + " " + people_init["armor"] + " " + people_init["atk"];
    }
    else {
        peopleStr = peopleStr + " 5  5  5";
    }
    if (people_init["type"] == "car") {
        peopleStr = peopleStr + " 0";
    } else if (people_init["type"] == "tank") {
        peopleStr = peopleStr + " 1";
    }
    else if (people_init["type"] == "bot") {
        peopleStr = peopleStr + " 2";
    }

    
    // console.log("people初始位置:",peopleStr);
    var endlineStr = end_init.length.toString();
    for (var i = 0; i < end_init.length; ++i) {
        endlineStr = endlineStr + " " + end_init[i]["postion"][0] + " " + end_init[i]["postion"][1] + " " + end_init[i]["postion"][2];
    }
    // console.log("endline數量 [初始位置]:",endlineStr);
    var mpaobjStr = mapObject.length.toString();
    for (var i = 0; i < mapObject.length; ++i) {
        if (mapObject[i]['type'] == 'arrow') { //有方向性的 ex:箭頭
            mpaobjStr = mpaobjStr + " " + mapObject[i]["type"] + " " + mapObject[i]["postion"][0] + " " + mapObject[i]["postion"][1] + " " + mapObject[i]["postion"][2];
        }
        else if (mapObject[i]['type'] == 'questionMark') { //問號 要有  n種 隨機 n=2 左右 n=3 f前
            var rand = Math.floor(Math.random() * mapObject[i]['chooseNum'].length);
            mpaobjStr = mpaobjStr + " " + mapObject[i]["type"] + " " + mapObject[i]["postion"][0] + " " + mapObject[i]["postion"][1] + " " + mapObject[i]['chooseNum'][rand];
        }
        else if (mapObject[i]['type'] == 'lock' || mapObject[i]['type'] == 'lock2') { //鎖頭 要分  箭頭解鎖 or　輸出解鎖
            mpaobjStr = mpaobjStr + " " + mapObject[i]["unlock"] + " " + mapObject[i]["postion"][0] + " " + mapObject[i]["postion"][1];
        }
        else if (mapObject[i]['type'] == 'enemyTank') { //敵人
            mpaobjStr = mpaobjStr + " " + mapObject[i]["type"] + " " + mapObject[i]["postion"][0] + " " + mapObject[i]["postion"][1];
            mpaobjStr = mpaobjStr + " " + mapObject[i]["postion"][2] + " " + mapObject[i]["hp"] + " " + mapObject[i]["atk"];
        }
        else {
            mpaobjStr = mpaobjStr + " " + mapObject[i]["type"] + " " + mapObject[i]["postion"][0] + " " + mapObject[i]["postion"][1];
        }
    }
    // console.log("mpaobjStr 數量 [初始位置]:",mpaobjStr);
    var str = [mapStr, peopleStr, endlineStr, mpaobjStr].join('\n');
    inputStr = str;
    // console.log("inputStr :")


    console.log(inputStr);
    // var runInput = inputStr;
    // if (decodeMod == 0) {
    //     const url = `${runApi}/${lang}?platform=codesheet&args=${encodeURIComponent(runInput)}`;
    //     codeStr = tempBefore;
    //     call_codesheet_Api(url, user1.key, tempBefore);
    // }  //編譯結果在  decodeOutput
    // else {
    //     console.log("要用 JDOODLE_api 編譯了QQ");
    //     call_JDOODLE_api(tempBefore, runInput);

    // }  //編譯結果在  decodeOutput
}
function clearcodeAndInit() {
    textarea_0.value = [
        '#include <stdio.h>',
        '#include <stdlib.h>',
        '',
        'int main(int argc, char* argv[]) {',
        '  ', ' ', '  ', '  ', '   ',
        '  return 0;',
        '}'
    ].join('\n');

}

function codeOutputTranstionAction() {
    var source = decodeOutput;
    var temp = [];
    var unlockAns = "";
    var systemCall = ["system_action_stepUp", "system_action_stepDown", "system_action_stepRight",
        "system_action_stepLeft", "system_action_turnRight", "system_action_turnLeft",
        "system_fire_oneDistHit", "system_fire_twoDistHit", "system_fire_oneDistEnd",
        "system_fire_twoDistEnd", "system_fire_boring", "system_arrow_finish",
        "system_arrow_unlock", "system_displayR", "system_displayL",
        "system_displayF", "system_displayR", "system_unlockOutput_",
        "system_eatcoin", "system_fire_hit"]
    // console.log(source);
    while (source.length > 0) {
        var indexof = source.indexOf("system_");
        if (indexof > -1) {
            var newStr = source.substr(indexof);//13
            var eroflag = true;
            for (var i = 0; i < systemCall.length; ++i) {
                if (newStr.indexOf(systemCall[i]) == 0) {
                    if (systemCall[i] == "system_unlockOutput_") {
                        // if (unlockAns.length < 1) {
                        for (var i = 0; i < mapObject.length; ++i) {
                            var obj = mapObject[i];
                            if ((obj["type"] == "lock2" || obj["type"] == "lock") && obj["unlock"] == "lock_output") {
                                if (unlockAns.length < 1) {
                                    unlockAns = obj["ans"];
                                }
                                if (newStr.indexOf("system_unlockOutput_" + unlockAns) == 0) {
                                    var tempStr = "system_output_unlock";
                                    temp.push(tempStr);
                                    source = newStr.substr(tempStr.length);
                                }
                                else {
                                    var tempStr = "system_unlockOutput_";
                                    source = newStr.substr(tempStr.length);
                                }
                                break;
                            }
                        }
                    }
                    else {
                        temp.push(systemCall[i]);
                        source = newStr.substr(systemCall[i].length);
                    }
                    eroflag = false;
                    break;
                }
            }
            if (eroflag) {
                console.log("~系統指令輸出錯誤,可能打錯字囉~");
                console.log(source);
                break;
            }
        } else {
            break;
        }
    }
    if (temp.length > 0) {
        onChanged = true;
        onChanging = false;
        temp.push("system_finish");
        textarea_1.value = temp.join('\n');
        action_code = temp;
        // console.log(action_code);
        gameEndingCode = 0;
    }
    else {
        action_code = [];
        gameEndingCode = 0;
        onChanged = false;
        onChanging = false;
        textarea_1.value = "";
        endgame();
    }

}









function call_codesheet_Api(url, apiKey, code) {
    fetch(url, {
        method: 'post',
        headers: { 'x-api-key': apiKey },
        //   body: platformMap[platform]['pages'][page].getCode()
        body: code
    })
        .then(res => res.json())
        .then((resp) => {
            decode_codesheet_api(resp);
        })
        .catch((error) => {
            console.error('Error:', error);
            iscodesheetTeseLive = false;
            decodeMod = 1;
            console.log("test_codesheet Api is dead  切換為 JDOODLE_Api _fail");
            // console.log("test output " + code);
            call_JDOODLE_api(code, inputStr);
        })
}
function decode_codesheet_api(resp) {
    if (resp.status === 'Successful') {
        // runOutput.classList.remove('error')
        // runOutput.value = resp.stdout || resp.stderr
        decodeOutput = resp.stdout;
        if (iscodesheetTeseLive == false) {
            var test_codesheet = decodeOutput.indexOf("system_test_codesheet_sucess");
            if (test_codesheet > -1) {
                decodeMod = 0;
                iscodesheetTeseLive = true;
                console.log("test_codesheet Api is live_sucess");
            }
            else {
                console.log("test_codesheet Api is dead  切換為 JDOODLE_Api _fail");
                decodeMod = 1;
            }
        }
        else {
            codeOutputTranstionAction()
        }
        // alert("Output = \n"+resp.stdout)
    } else if (resp.status === 'Failed' || resp.status === 'BadRequest' || resp.message === 'Forbidden') {
        console.log('Run response', resp);
        // runOutput.value = `Failed: ${resp.error}${resp.stdout}` // stdout for php which puts error in stdout
        resp.stdout = "compiler error";
        if (iscodesheetTeseLive == false) {
            console.log("test_codesheet Api is dead  切換為 JDOODLE_Api _fail");
            decodeMod = 1;
        } else {
            if (reap.status === "Failed" && reap.stderr === "" && reap.stdout === "compiler error") {
                decodeMod = 1;
                call_JDOODLE_api(codeStr, inputStr);
            }
            else {
                textarea_1.value = "";
                gameEndingCode = 5;
                console.log("Error =  compiler error");
                endgame();
            }
        }
    } else {
        call_JDOODLE_api(codeStr, inputStr);
    }
    // runBtn.disabled = false // enable run button
}
function call_JDOODLE_api(scriptData, inputData) {
    var scriptData = {
        input: inputData,
        script: scriptData,
        language: "cpp",
        id: "001"
    }
    // console.log(scriptData);
    var socket = io();
    socket.emit('script', scriptData);
    //   output.innerHTML = "編譯中....\n";
    socket.on('answer', function (obj) {
        console.log(obj);
        //   output.innerHTML = "輸出:\n" + obj.body.output;
        decode_JDOODLE_api(obj.body.output)

    });
}
function decode_JDOODLE_api(str) {
    console.log(str);
    decodeOutput = str;
    codeOutputTranstionAction();
}

function challengeGameAgain() {
    data = JSON.parse(JSON.stringify(Res_data));
    loadData();
    updateCanvas();
    gameEndingCode = 0;
    decodeOutput = "";
    action_code = [];
    action_now = 0;
}

btn1.onclick = function () {
    challengeGameAgain();

    textarea_1.value = "   .....編譯中~請稍後....."
    codeToCompiler();

    //測試用//
    // decodeOutput = textarea_1.value
    // codeOutputTranstionAction();
    ////

}
var colleges = ['test', '01', '02', '03', '04', '05',
    '06', '07', '08', '09', '10',
    '11', '12', '13', '14', '15',
    '16', '17', '18', '19', '20',
    '21', '22', '23', '24', '25',];
// 'game06', 'game07', 'game08', 'game09', 'game10', 'game17', 'testMap'];
var collegeSelect = document.getElementById("college-list");
var inner = "";
var selectedIndex;
for (var i = 0; i < colleges.length; i++) {
    inner = inner + '<option value=i>' + colleges[i] + '</option>';
    if (colleges[i] == mapNum) {
        selectedIndex = i;
    }

}

collegeSelect.innerHTML = inner;
collegeSelect.selectedIndex = selectedIndex;

function changeCollege(index) {
    mapNum = colleges[index];

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(this.responseText);
            // Res_data = JSON.parse(JSON.stringify(data));
            // console.log(data);
            Res_data = JSON.parse(JSON.stringify(data));
            loadData();//


            var dx = people_init["postion"][0] * edgeToWidth, dy = people_init["postion"][1] * edgeToHeight, drotate = 360 - people_init["postion"][2] * 90;
            var img = imgObject[parseInt(imgDic[people_init["type"]])];
            old_PeooleX = dx, old_PeooleY = dy, old_PeooleEESW = drotate;
            now_PeooleX = dx, now_PeooleY = dy, now_PeooleEESW = drotate;
            updateCanvas();
        }
    };
    var url = "../json/map/map" + mapNum + ".json"
    // console.log(url);

    xmlhttp.open("GET", url, true);
    xmlhttp.send();


    // // loadData();


}