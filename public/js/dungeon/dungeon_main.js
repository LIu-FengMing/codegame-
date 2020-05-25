var gameRoomId;
var LevelMap;
var app2 = {
  game: function(roomId, mapName) {
    gameRoomId = roomId;
    LevelMap = mapName;
  }
};

let lang = 'cpp',
  inputStr = "",
  codeStr = "";
var mapNum = "01";
var map = []; ///0 是草地  1是沙漠  2是海洋
var people_init, people_init2, people_init3, people_init4; //x,y,面相   0->  1^  2<-  3 down
var end_init = []; //x,y,面相        0- 1 |
var mapObject = []; //問號石頭[2] 是對於問號的方向
var imgObject = [],
  mapwinLinit;
var imgDic = new Array(); //0 是石頭 1是樹
var mapSize;
var edgeToWidth, edgeToHeight;
var mode = "easygame";
var data, Res_data, width, height;
var action_code = [],
  action_now = 0;
var onChanged = false;
var onChanging = false;
var stepSpeed = 2,
  turnSpeed = 5,
  delayResSpeed = 5,
  pipleLineSpeed = 0,
  pipleLineO = 0,
  tempAction, ActionLen;
var now_PeooleEESW, old_PeooleEESW, now_PeooleEESW2, old_PeooleEESW2, now_PeooleEESW3, old_PeooleEESW3, now_PeooleEESW4, old_PeooleEESW4;
var now_PeooleX, old_PeooleX, now_PeooleX2, old_PeooleX2, now_PeooleX3, old_PeooleX3, now_PeooleX4, old_PeooleX4;
var now_PeooleY, old_PeooleY, now_PeooleY2, old_PeooleY2, now_PeooleY3, old_PeooleY3, now_PeooleY4, old_PeooleY4;
var gameEndingCode = 0; //0 未完成 1完成 2經過終點線 3駛出地圖_失敗 4撞到障礙物_失敗  5編譯失敗    10
var decodeOutput = "";
var textarea_0 = document.getElementById('textarea_0');
var textarea_1 = document.getElementById('textarea_1');
var btn1 = document.getElementById('btn1');
var backgroundGraph, objectGraph, peopleGraph, peopleGraph2, peopleGraph3, peopleGraph4, HPObject = [];
var iscreatecanvas = 0; //0 fase 1 true 2 load success
var iscreateImg = 0; //0 fase 1 true 2 load success
var haveFoggy = false,
  complementStep = false;
var lock2DelObjpos = 0;
var codeValue;
var xmlhttp = new XMLHttpRequest();
var computeEndCode;
var errMessage;
var player;
var players = [];
var p1_x, p1_y, p1_z, p2_x, p2_y, p2_z, p3_x, p3_y, p3_z, p4_x, p4_y, p4_z;
//var ip1_x, ip1_y, ip2_x, ip2_y, ip3_x, ip3_y, ip4_x, ip4_y;
var ip_x = [],
  ip_y = [];
var initFlag = false;
var ip1Flag = false,
  ip2Flag = false,
  ip3Flag = false,
  ip4Flag = false;
var delFlag = false;
var triggerFlag = false;
var inputFlag = false;
var inputNum;
var userNum = 0;
var loopNum = 0;
// var peopleAtk = equipmentData.weaponLevel[user.weaponLevel].attack;
// var peopleArmor = equipmentData.armorLevel[user.armorLevel].attack;
// console.log(peopleAtk, peopleArmor);
var socket = io('/game');

xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    codeValue = this.responseText;
  }
};
xmlhttp.open("GET", "/gameNew/gameNew/json/dungeon_code.cpp", true);
xmlhttp.send();


// var equipmentData;
// var xmlhttp = new XMLHttpRequest();
// xmlhttp.onreadystatechange = function () {
//     if (this.readyState == 4 && this.status == 200) {
//         equipmentData = JSON.parse(this.responseText);
//     }
// };
// xmlhttp.open("GET", "json/equipment.json", true);
// xmlhttp.send();

/*socket.on("test", function(n) {
  if (n == 1) {
    //console.log("updateBack");
    updateBackgroundGraph();
  } else if (n == 2) {
    //console.log("updateObject");
    updateObjectGraph();
  } else if (n == 3) {
    //console.log("updatePeople");
    updatePeopleGraph();
    updatePeopleGraph2();

  } else if (n == 4) {
    //console.log("updateCanvas");
    updateCanvas();
  }
});*/
socket.on('answer', function(obj) {
  if (obj.cpuUsage != null && obj.memoryUsage != null) {
    decode_JDOODLE_api(obj.stdout);
  }
});
/*socket.on("go", function(s, u) {
  decodeOutput = s;
  player = u;
  console.log("player :", player);
  console.log("decode :", decodeOutput);
  codeOutputTranstionAction();
});*/
var initCode = [
  `
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
int main(int argc, char *argv[])
{    /*請在此處輸入程式碼(ps:我是註解)*/

    return 0;
 }
`
].join('\n')
$('#textarea_0').text(initCode);


function setup() {
  var path = ["start", "car", "car2", "car3", "car4", "dungeon", "endline", "bullet", "boon_hit",
    "stone", "statue", "door", "door_open", "rune_table", "trap", "unmoveble",
    "trigger", "loop_flame", "loop_done", "loop_door", "array_table", "box_closed", "box_open"
  ]
  for (var i = 0; i < path.length; ++i) {
    // var imgpath = "gameNew/gameNew/image/" + path[i] + ".png";
    var imgpath = "/GameImage/Dungeon/" + path[i] + ".png";
    var img = loadImage(imgpath);
    imgObject.push(img), imgDic[path[i]] = i.toString();
  }

  var divcanvas = document.getElementById('divcanvas');
  var winW = divcanvas.offsetWidth;
  var winH = divcanvas.offsetHeight;
  //console.log(winW,winH);
  // var winW = Math.max($(window).width()* 0.4,windowWidth * 0.4, 506);
  // var winH = Math.max($(window).height()* 0.892,windowHeight * 0.892, 500);
  // var canvas = createCanvas((windowWidth * 0.4)-6, (windowHeight * 0.895)-5);
  var canvas = createCanvas(winW + 1, winH - 6);
  canvas.parent('divcanvas');
  canvas.background(211);
  width = canvas.width;
  height = canvas.height;
  init_setup();
  iscreateImg = 1;

  /*777777 */
  textSize(12);

}

function init_setup() {

  let nowurl = new URL(window.location.href);
  let params = nowurl.searchParams;




  var map_level = LevelMap.split("p"); //從map的p切開
  mapNum = map_level[1]-1;//第幾關，減一是因為從0開始



  $.ajax({
    url: "/loadThisGameRoomLevelGameMapMap", // 要傳送的頁面
    method: 'POST', // 使用 POST 方法傳送請求
    dataType: 'json', // 回傳資料會是 json 格式
    data: {
      level: mapNum
    }, //
    success: function(res) {
      data = JSON.parse(res);
      console.log(data);
      Res_data = JSON.parse(res);
      if (data.presetCode) {
        var file = data.presetCode;
        xmlhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            initCode = this.responseText.toString();
            // console.log(initCode);
            mapwinLinit = data['winLinit'];
            var s1 = mapwinLinit["threeStar"],
              s2 = mapwinLinit["twoStar"];
            var linit = "/* 3星:" + s1 + "個動作包含" + s1 + "個動作以內  \n   2星:" + s2 + "個動作包含" + s2 + "個動作以內" + s1 + "個動作以上  \n   1星:滿足過關條件即可*/ \n\n";
            var stemp;
            if (initCode.indexOf('#') > 0) {
              stemp = initCode.substr(initCode.indexOf('#') - 1);
            } else {
              stemp = initCode;
            }
            textarea_0.value = linit + stemp;
            // stemp = initCode.substr(initCode.indexOf('#') - 1);
            initCode = linit + stemp;
            // console.log("linit + stemp=",linit,stemp);
            // console.log("initCode=",initCode);

            loadData();
            updateCanvas();
            //socket.emit("update", 4);
          }
        };
        var url = "gameNew/gameNew/json/" + file + ".cpp"
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
      } else {
        loadData();
        updateCanvas();
        //socket.emit("update", 4);
      }
    }
  })
  var href = document.location.href;
  href += "/loadThisGameRoomPlayer";

  setTimeout(function() {
    $.ajax({
      url: href, // 要傳送的頁面
      method: 'POST', // 使用 POST 方法傳送請求
      dataType: 'json', // 回傳資料會是 json 格式
      success: function(res) {
        players = res;
        players.forEach((item, i) => {
          console.log("player" + (i + 1) + ":" + item.userId);
        });
      }
    })
  }, 200);

}

function loadData() {
  var mapNumber = data;
  if (mapNumber.foggy) {
    haveFoggy = true;
  } else {
    haveFoggy = false;
  }

  map = mapNumber['mapValue'];
  mapSize = Math.sqrt(mapNumber['mapSize']); //平方根(計算地圖是幾乘幾)
  people_init = mapNumber['people_init'];
  people_init2 = mapNumber['people_init2'];
  people_init3 = mapNumber['people_init3'];
  people_init4 = mapNumber['people_init4'];
  end_init = mapNumber['end_init'];
  mapObject = mapNumber['obj'];
  mapwinLinit = mapNumber['winLinit'];


  var s1 = mapwinLinit["threeStar"]
  var s2 = mapwinLinit["twoStar"]

  linit = `/*3星:${s1}個動作包含${s1}個動作以內\n`
  linit += `  2星:${s2}個動作包含${s2}個動作以內${s1}個動作以上\n`
  linit += `  1星:滿足過關條件即可 */\n`

  var stemp;
  if (textarea_0.value.indexOf('#') > 0) {
    stemp = textarea_0.value.substr(textarea_0.value.indexOf('#') - 1);
  } else {
    stemp = textarea_0.value;
  }
  $("#textarea_0").val(linit + stemp);


  var dx = people_init["postion"][0] * edgeToWidth,
    dy = people_init["postion"][1] * edgeToHeight,
    drotate = 360 - people_init["postion"][2] * 90;
  old_PeooleX = dx, old_PeooleY = dy, old_PeooleEESW = drotate;
  now_PeooleX = dx, now_PeooleY = dy, now_PeooleEESW = drotate;
  var dx2 = people_init2["postion"][0] * edgeToWidth,
    dy2 = people_init2["postion"][1] * edgeToHeight,
    drotate2 = 360 - people_init2["postion"][2] * 90;
  old_PeooleX2 = dx2, old_PeooleY2 = dy2, old_PeooleEESW2 = drotate2;
  now_PeooleX2 = dx2, now_PeooleY2 = dy2, now_PeooleEESW2 = drotate2;
  var dx3 = people_init3["postion"][0] * edgeToWidth,
    dy3 = people_init3["postion"][1] * edgeToHeight,
    drotate3 = 360 - people_init3["postion"][2] * 90;
  old_PeooleX3 = dx3, old_PeooleY3 = dy3, old_PeooleEESW3 = drotate3;
  now_PeooleX3 = dx3, now_PeooleY3 = dy3, now_PeooleEESW3 = drotate3;
  var dx4 = people_init4["postion"][0] * edgeToWidth,
    dy4 = people_init4["postion"][1] * edgeToHeight,
    drotate4 = 360 - people_init4["postion"][2] * 90;
  old_PeooleX4 = dx4, old_PeooleY4 = dy4, old_PeooleEESW4 = drotate4;
  now_PeooleX4 = dx4, now_PeooleY4 = dy4, now_PeooleEESW4 = drotate4;

  p1_x = people_init["postion"][0];
  p1_y = people_init["postion"][1];
  p1_z = people_init["postion"][2];
  p2_x = people_init2["postion"][0];
  p2_y = people_init2["postion"][1];
  p2_z = people_init2["postion"][2];
  p3_x = people_init3["postion"][0];
  p3_y = people_init3["postion"][1];
  p3_z = people_init3["postion"][2];
  p4_x = people_init4["postion"][0];
  p4_y = people_init4["postion"][1];
  p4_z = people_init4["postion"][2];

  edgeToWidth = width / mapSize;
  edgeToHeight = height / mapSize;
  iscreatecanvas = 1;
  action_now = 0;
  peopleGraph = createGraphics(width, height);
  peopleGraph2 = createGraphics(width, height);
  peopleGraph3 = createGraphics(width, height);
  peopleGraph4 = createGraphics(width, height);
  objectGraph = createGraphics(width, height);
  backgroundGraph = createGraphics(width, height);
  pg = createGraphics(edgeToWidth, edgeToHeight);
  updateBackgroundGraph();
  updateObjectGraph();
  updatePeopleGraph();
  updatePeopleGraph2();
  updatePeopleGraph3();
  updatePeopleGraph4();
  /*socket.emit("update", 1);
  socket.emit("update", 2);
  socket.emit("update", 3);*/
  setTimeout(function() {
    codeToCompiler();
  }, 250);

}


// var timeD = new Date().getTime();
function endgame() {
  // console.log((new Date().getTime())- timeD);
  /* onChanged = false;
   onChanging = false;
   action_code = [];
   clear();*/
  updateCanvas();
  //socket.emit("update", 4);
  for (var i = 0; i < end_init.length; ++i) {
    var dx = end_init[i]["postion"][0],
      dy = end_init[i]["postion"][1];

    //console.log("test:", dx, " test ", old_PeooleX);
    // console.log(ddx, " ", ddy);
    //if (ddx < stepSpeed * 2 && ddy < stepSpeed * 2) {
    if (dx == p1_x && dy == p1_y /*&& dx == p2_x && dy == p2_y && dx == p3_x && dy == p3_y && dx == p4_x && dy == p4_y*/ ) {
      //if (drotate == (((old_PeooleEESW + 360) % 180) + 90) % 180) {
      gameEndingCode = 1;
    } else {
      gameEndingCode = 2;
    }
    //}
    /* var dx = end_init[i]["postion"][0], dy = end_init[i]["postion"][1];
     console.log("end: ", dx,dy);
     if(p1_x == dx && p1_y == dy){
         gameEndingCode = 1;
     }
     else{
         gameEndingCode = 2;
     }*/
  }


  var str = computeEndCode,
    temp = "";
  // /*        fun       */
  var splitstr = str.substr(0, str.indexOf("main"));
  var numofPostive = 0,
    wIndex = false;
  for (var i = str.indexOf("main"); i < str.length; ++i) {
    if (str[i] == '{') {
      if (!wIndex) {
        numofPostive = 1;
        wIndex = true;
      } else {
        ++numofPostive;
      }
    } else if (str[i] == '}') {
      --numofPostive;
      if (numofPostive == 0) {
        numofPostive = i;
        break;
      }
    }
  }
  splitstr = splitstr + str.substr(numofPostive);
  // console.log(splitstr);
  /*    find funName     */
  temp = splitstr.split('').reverse().join(''); //字串反轉 int ad(){ abc } -> }  cba { )(ad tin
  // console.log(temp);
  var funname = [];
  var tempStr;
  index = 0;
  var nonFun = ["for", "while", "switch()", "if", ";if(",
    "else", "else(", "do", "do("
  ]
  while (index > -1) {
    index = temp.indexOf('{');
    if (index > -1) {
      tempStr = temp.substr(index + 1); // '{'.len=1
      temp = tempStr;
      index = temp.indexOf('(');
      tempStr = temp.substr(index + 1); // '('.len=1
      temp = tempStr;
      var ws = temp.split(' ');
      if (ws[0] != "niam" && ws[0] != "rof") {
        var wss = temp.split('\n');
        var bk = false
        for (let indexWss = 0; indexWss < wss.length; indexWss++) {
          const element = wss[indexWss];
          for (let iNF = 0; iNF < nonFun.length; iNF++) {
            const ele = nonFun[iNF].split('').reverse().join('');
            if (element == ele) {
              bk = true
              break
            }
          }
        }
        if (bk == false) {
          funname.push(ws[0].split('').reverse().join('')); //補正回來 } cba { )(cba --> abc
        }

      }
      index = 0;
    }
  }


  /*     actionCode       */
  var systemCall = ["moveForward", "moveForward(", "moveForward()", "moveForward();", ";moveForward();",
    "turnRight", "turnRight(", "turnRight()", "turnRight();", ";turnRight();",
    "turnLeft", "turnLeft(", "turnLeft()", "turnLeft();", ";turnLeft();",
    "printf", "printf(", "scanf", "scanf("
  ];
  for (var i = 0; i < funname.length; ++i) {
    var e0 = funname[i];
    var e1 = e0 + '(';
    var e2 = e1 + ')';
    var e3 = e2 + ';';
    systemCall.push(e0);
    systemCall.push(e1);
    systemCall.push(e2);
    systemCall.push(e3);
  }

  var counter = 0;
  temp = str;
  var words = temp.split('\n');
  for (var i = 1; i < words.length; ++i) {
    var wwt = words[i].split(';');
    for (var wwi = 0; wwi < wwt.length; ++wwi) {
      var wt = wwt[wwi].split(' ');
      for (var wi = 0; wi < wt.length; ++wi) {
        if (wt[wi].length > 1) {
          for (var di = 0; di < systemCall.length; ++di) {
            var pos = wt[wi].indexOf(systemCall[di]);
            if (pos > -1) {
              if (pos > 0) {
                if (!(wt[wi][pos - 1] == '\t' || wt[wi][pos - 1] == ',' || wt[wi][pos - 1] == ';' || wt[wi][pos - 1] == '(' || wt[wi][pos - 1] == '{')) {
                  continue;
                }
              }
              if (pos + systemCall[di].length < wt[wi].length - 1) {
                var del = systemCall[di].length;
                if (!(wt[wi][pos + del] == ',' || wt[wi][pos + del] == ';' || wt[wi][pos + del] == '(')) {
                  continue;
                }
              }
              ++counter;
              var strTemp = wt[wi].substr(pos + systemCall[di].length);
              wt[wi] = strTemp;
              --wi;
              break;
            }
          }
        }
      }

    }


  }

  var result = "";
  var tc = counter - funname.length;

  if (gameEndingCode == 1) {
    console.log("counter:", counter);
    console.log("funname:", funname);
    // console.log("funname.length:", funname.length);
    // console.log("funcounter:", funcounter);
    console.log("總動作為:", tc);

    if (mapwinLinit["threeStar"][0] >= tc) {
      result = "拍手!恭喜你獲得三星! \n~來繼續挑戰下關吧~";
      createEndView(3, result, tc, computeEndCode);
    } else if (mapwinLinit["twoStar"][0] >= tc) {
      result = "恭喜你二星! \n~差一點就有一星了!加油~";
      createEndView(2, result, tc, computeEndCode);
    } else {
      result = "好可惜只有一星! \n~在檢查看看有沒有可以縮減的~";
      createEndView(1, result, tc, computeEndCode);
    }
  }


  // alert(result);
}



function draw() {
  // //
  if (iscreatecanvas == 1 && iscreateImg == 1) {
    var dx = people_init["postion"][0] * edgeToWidth,
      dy = people_init["postion"][1] * edgeToHeight,
      drotate = 360 - people_init["postion"][2] * 90;
    old_PeooleX = dx, old_PeooleY = dy, old_PeooleEESW = drotate;
    now_PeooleX = dx, now_PeooleY = dy, now_PeooleEESW = drotate;
    var dx2 = people_init2["postion"][0] * edgeToWidth,
      dy2 = people_init2["postion"][1] * edgeToHeight,
      drotate2 = 360 - people_init2["postion"][2] * 90;
    old_PeooleX2 = dx2, old_PeooleY2 = dy2, old_PeooleEESW2 = drotate2;
    now_PeooleX2 = dx2, now_PeooleY2 = dy2, now_PeooleEESW2 = drotate2;
    var dx3 = people_init3["postion"][0] * edgeToWidth,
      dy3 = people_init3["postion"][1] * edgeToHeight,
      drotate3 = 360 - people_init3["postion"][2] * 90;
    old_PeooleX3 = dx3, old_PeooleY3 = dy3, old_PeooleEESW3 = drotate3;
    now_PeooleX3 = dx3, now_PeooleY3 = dy3, now_PeooleEESW3 = drotate3;
    var dx4 = people_init4["postion"][0] * edgeToWidth,
      dy4 = people_init4["postion"][1] * edgeToHeight,
      drotate4 = 360 - people_init4["postion"][2] * 90;
    old_PeooleX4 = dx4, old_PeooleY4 = dy4, old_PeooleEESW4 = drotate4;
    now_PeooleX4 = dx4, now_PeooleY4 = dy4, now_PeooleEESW4 = drotate4;
    updateObjectGraph();
    updatePeopleGraph();
    updatePeopleGraph2();
    updatePeopleGraph3();
    updatePeopleGraph4();
    updateBackgroundGraph();
    updateCanvas();
    /*socket.emit("update", 2);
    socket.emit("update", 3);
    socket.emit("update", 1);
    socket.emit("update", 4);*/
    iscreatecanvas = 2;
  }
  if (iscreatecanvas > 1 && iscreatecanvas < 400) {
    ++iscreatecanvas;
    if (iscreatecanvas % 50 == 0) {
      // console.log(iscreatecanvas);
      updateBackgroundGraph();
      updateObjectGraph();
      updatePeopleGraph();
      updatePeopleGraph2();
      updatePeopleGraph3();
      updatePeopleGraph4();
      updateCanvas();
      /*socket.emit("update", 1);
      socket.emit("update", 2);
      socket.emit("update", 3);
      socket.emit("update", 4);*/
    }
  }

  // console.log(createGraphics(width, height));

  if (onChanged) {
    // console.log("running");
    if (!onChanging) {
      /*優化部分*/
      ActionLen = action_code.length;
      if (ActionLen - action_now > 0) {
        tempAction = action_code[action_now];
      }
      /*  */
      now_PeooleEESW = old_PeooleEESW;
      now_PeooleX = old_PeooleX;
      now_PeooleY = old_PeooleY;
      now_PeooleEESW2 = old_PeooleEESW2;
      now_PeooleX2 = old_PeooleX2;
      now_PeooleY2 = old_PeooleY2;
      now_PeooleEESW3 = old_PeooleEESW3;
      now_PeooleX3 = old_PeooleX3;
      now_PeooleY3 = old_PeooleY3;
      now_PeooleEESW4 = old_PeooleEESW4;
      now_PeooleX4 = old_PeooleX4;
      now_PeooleY4 = old_PeooleY4;
      //stepSpeed = 7; //控制車子速度
      stepSpeed = gameSpeed; //控制車子速度
      //stepSpeed = gameSpeed + 1 + Math.floor(ActionLen / 50); //控制車子速度
      delayResSpeed = 30 - (gameSpeed - 6) * 5;
      //delayResSpeed = 1;
      turnSpeed = 2 + Math.floor(stepSpeed / 2);
    }
    while (ActionLen - action_now > 0) {
      var mapObjectChange = true;
      // console.log(action_now);
      if (pipleLineSpeed > 0) {
        // console.log(pipleLineSpeed);
        --pipleLineSpeed;
      } else if (pipleLineO > 0) {
        var temp = pipleLineO - 1
        pipleLineO = -1 * (2 + action_now);
        action_now = temp;
        tempAction = action_code[action_now];
      } else if (pipleLineO < -1) {
        pipleLineO = -1 * (2 + pipleLineO);
        action_now = pipleLineO;
        pipleLineO = 0;
        tempAction = action_code[action_now];
      }

      var type = tempAction.type;
      if (type == "E") {
        var value = tempAction.value; // 3駛出地圖 4 碰壁 6被炸死  9金幣未完成 10金幣完成  7沒血了
        if (value == 2) {
          gameEndingCode = value;
        } else if (value == 3 || value == 4) {
          break; //撞壁直接跳出
        } else {
          alert("'E'還未處理,", value);
          console.log("'E'還未處理,", value);
        }
        ++action_now;
      } else if (type == "M") {
        if (!(ActionLen > action_now + 1 && action_code[action_now + 1].type == "E" && action_code[action_now + 1].value != 2)) {

          var value = tempAction.value;
          if (!onChanging) {
            for (var i = 0; i < value.length; ++i) {
              var nowValue = value[i];
              if (nowValue.obj == -1) {
                if (player == 1) {
                  // console.log("old:",old_PeooleX,old_PeooleY,old_PeooleEESW);
                  old_PeooleX = old_PeooleX + nowValue.value[0] * edgeToWidth;
                  old_PeooleY = old_PeooleY + nowValue.value[1] * edgeToHeight;
                  old_PeooleEESW = old_PeooleEESW - nowValue.value[2] * 90;
                  p1_x = p1_x + nowValue.value[0];
                  p1_y = p1_y + nowValue.value[1];
                  p1_z = (p1_z + nowValue.value[2] + 4) % 4;
                  console.log("P1 xyz: ", p1_x, p1_y, p1_z);
                  // console.log("now:",old_PeooleX,old_PeooleY,old_PeooleEESW);
                } else if (player == 2) {
                  old_PeooleX2 = old_PeooleX2 + nowValue.value[0] * edgeToWidth;
                  old_PeooleY2 = old_PeooleY2 + nowValue.value[1] * edgeToHeight;
                  old_PeooleEESW2 = old_PeooleEESW2 - nowValue.value[2] * 90;
                  p2_x = p2_x + nowValue.value[0];
                  p2_y = p2_y + nowValue.value[1];
                  p2_z = (p2_z + nowValue.value[2] + 4) % 4;
                  console.log("P2 xyz: ", p2_x, p2_y, p2_z);
                } else if (player == 3) {
                  old_PeooleX3 = old_PeooleX3 + nowValue.value[0] * edgeToWidth;
                  old_PeooleY3 = old_PeooleY3 + nowValue.value[1] * edgeToHeight;
                  old_PeooleEESW3 = old_PeooleEESW3 - nowValue.value[2] * 90;
                  p3_x = p3_x + nowValue.value[0];
                  p3_y = p3_y + nowValue.value[1];
                  p3_z = (p3_z + nowValue.value[2] + 4) % 4;
                  console.log("P3 xyz: ", p3_x, p3_y, p3_z);
                } else if (player == 4) {
                  old_PeooleX4 = old_PeooleX4 + nowValue.value[0] * edgeToWidth;
                  old_PeooleY4 = old_PeooleY4 + nowValue.value[1] * edgeToHeight;
                  old_PeooleEESW4 = old_PeooleEESW4 - nowValue.value[2] * 90;
                  p4_x = p4_x + nowValue.value[0];
                  p4_y = p4_y + nowValue.value[1];
                  p4_z = (p4_z + nowValue.value[2] + 4) % 4;
                  console.log("P4 xyz: ", p4_x, p4_y, p4_z);
                }
                endgame();
              } else {
                var dx = mapObject[nowValue.obj].postion[0];
                var dy = mapObject[nowValue.obj].postion[1];
                mapObject[nowValue.obj].oldX = dx + nowValue.value[0] * edgeToWidth;
                mapObject[nowValue.obj].oldY = dy + nowValue.value[1] * edgeToHeight;
                // console.log(mapObject[nowValue.obj]);
              }
            }
            onChanging = true;
          } else {
            for (var i = 0; i < value.length; ++i) {
              var nowValue = value[i];
              if (nowValue.obj == -1) { //人
                if (nowValue.value[0] + nowValue.value[1] + nowValue.value[2] == -3) {
                  //-1,-1,-1 丟到世界外
                  if (player == 1) {
                    now_PeooleX = mapSize * edgeToWidth;
                    now_PeooleY = mapSize * edgeToHeight;
                    old_PeooleX = mapSize * edgeToWidth;
                    old_PeooleY = mapSize * edgeToHeight;
                  } else if (player == 2) {
                    now_PeooleX2 = mapSize * edgeToWidth;
                    now_PeooleY2 = mapSize * edgeToHeight;
                    old_PeooleX2 = mapSize * edgeToWidth;
                    old_PeooleY2 = mapSize * edgeToHeight;
                  } else if (player == 3) {
                    now_PeooleX3 = mapSize * edgeToWidth;
                    now_PeooleY3 = mapSize * edgeToHeight;
                    old_PeooleX3 = mapSize * edgeToWidth;
                    old_PeooleY3 = mapSize * edgeToHeight;
                  } else if (player == 4) {
                    now_PeooleX4 = mapSize * edgeToWidth;
                    now_PeooleY4 = mapSize * edgeToHeight;
                    old_PeooleX4 = mapSize * edgeToWidth;
                    old_PeooleY4 = mapSize * edgeToHeight;
                  }
                  onChanging = false;
                } else {
                  if (pipleLineSpeed == 0) {
                    if (player == 1) {
                      now_PeooleX = now_PeooleX + (stepSpeed * nowValue.value[0]);
                      now_PeooleY = now_PeooleY + (stepSpeed * nowValue.value[1]);
                      now_PeooleEESW = now_PeooleEESW - (turnSpeed * nowValue.value[2]);
                      var difX = Math.abs(now_PeooleX - old_PeooleX)
                      var difY = Math.abs(now_PeooleY - old_PeooleY)
                      var difE = Math.abs(now_PeooleEESW - old_PeooleEESW)
                      var dif = difX + difY + difE;

                      if (complementStep) {
                        complementStep = false;
                        now_PeooleX = old_PeooleX;
                        now_PeooleY = old_PeooleY;
                        now_PeooleEESW = old_PeooleEESW;


                        onChanging = false;
                      } else if (dif <= stepSpeed) {
                        complementStep = true;
                      }
                      /*

                      */
                    } else if (player == 2) {
                      now_PeooleX2 = now_PeooleX2 + (stepSpeed * nowValue.value[0]);
                      now_PeooleY2 = now_PeooleY2 + (stepSpeed * nowValue.value[1]);
                      now_PeooleEESW2 = now_PeooleEESW2 - (turnSpeed * nowValue.value[2]);
                      var difX2 = Math.abs(now_PeooleX2 - old_PeooleX2)
                      var difY2 = Math.abs(now_PeooleY2 - old_PeooleY2)
                      var difE2 = Math.abs(now_PeooleEESW2 - old_PeooleEESW2)
                      var dif2 = difX2 + difY2 + difE2;

                      if (complementStep) {
                        complementStep = false;
                        now_PeooleX2 = old_PeooleX2;
                        now_PeooleY2 = old_PeooleY2;
                        now_PeooleEESW2 = old_PeooleEESW2;


                        onChanging = false;
                      } else if (dif2 <= stepSpeed) {
                        complementStep = true;
                      }
                    } else if (player == 3) {
                      now_PeooleX3 = now_PeooleX3 + (stepSpeed * nowValue.value[0]);
                      now_PeooleY3 = now_PeooleY3 + (stepSpeed * nowValue.value[1]);
                      now_PeooleEESW3 = now_PeooleEESW3 - (turnSpeed * nowValue.value[2]);
                      var difX3 = Math.abs(now_PeooleX3 - old_PeooleX3)
                      var difY3 = Math.abs(now_PeooleY3 - old_PeooleY3)
                      var difE3 = Math.abs(now_PeooleEESW3 - old_PeooleEESW3)
                      var dif3 = difX3 + difY3 + difE3;

                      if (complementStep) {
                        complementStep = false;
                        now_PeooleX3 = old_PeooleX3;
                        now_PeooleY3 = old_PeooleY3;
                        now_PeooleEESW3 = old_PeooleEESW3;


                        onChanging = false;
                      } else if (dif3 <= stepSpeed) {
                        complementStep = true;
                      }
                    } else if (player == 4) {
                      now_PeooleX4 = now_PeooleX4 + (stepSpeed * nowValue.value[0]);
                      now_PeooleY4 = now_PeooleY4 + (stepSpeed * nowValue.value[1]);
                      now_PeooleEESW4 = now_PeooleEESW4 - (turnSpeed * nowValue.value[2]);
                      var difX4 = Math.abs(now_PeooleX4 - old_PeooleX4)
                      var difY4 = Math.abs(now_PeooleY4 - old_PeooleY4)
                      var difE4 = Math.abs(now_PeooleEESW4 - old_PeooleEESW4)
                      var dif4 = difX4 + difY4 + difE4;

                      if (complementStep) {
                        complementStep = false;
                        now_PeooleX4 = old_PeooleX4;
                        now_PeooleY4 = old_PeooleY4;
                        now_PeooleEESW4 = old_PeooleEESW4;


                        onChanging = false;
                      } else if (dif4 <= stepSpeed) {
                        complementStep = true;
                      }
                    }
                  }
                }
                updatePeopleGraph();
                updatePeopleGraph2();
                updatePeopleGraph3();
                updatePeopleGraph4();
                //socket.emit("update", 3);
                break;
              } else { //物件的
                var difX = Math.abs(mapObject[nowValue.obj].postion[0] - mapObject[nowValue.obj].oldX);
                var difY = Math.abs(mapObject[nowValue.obj].postion[1] - mapObject[nowValue.obj].oldY);
                var dif = difX + difY;
                // console.log(dif);
                if (dif > stepSpeed) {
                  for (var ssi = 0; ssi < 2; ++ssi) {
                    if (Math.abs(nowValue.value[ssi]) > 0.1) {
                      if (nowValue.value[ssi] > 0) {
                        mapObject[nowValue.obj].postion[ssi] += stepSpeed;
                      } else {
                        mapObject[nowValue.obj].postion[ssi] -= stepSpeed;
                      }
                    }
                  }
                  onChanging = true;
                } else if (complementStep) {
                  complementStep = false;
                  mapObject[nowValue.obj].postion[0] = mapObject[nowValue.obj].oldX;
                  mapObject[nowValue.obj].postion[1] = mapObject[nowValue.obj].oldY;
                  onChanging = false;
                } else {
                  complementStep = true;
                }
                // else {
                //     onChanging = false;
                // }
                updateObjectGraph();
                //socket.emit("update", 2);
                break;
              }
            }
          }
        }
        if (onChanging == false) {
          ++action_now;
        }
        if (triggerFlag) {
          for (let k = 0; k < 4; k++) {
            if (p1_x == ip_x[k] && p1_y == ip_y[k]) {
              ip1Flag = true;
            } else if (p2_x == ip_x[k] && p2_y == ip_y[k]) {
              ip2Flag = true;
            } else if (p3_x == ip_x[k] && p3_y == ip_y[k]) {
              ip3Flag = true;
            } else if (p4_x == ip_x[k] && p4_y == ip_y[k]) {
              ip4Flag = true;
            }
            /*if ( (p1_x == ip_x[k] && p1_y == ip_y[k]) && (p2_x == ip_x[(k+1)%4] && p2_y == ip_y[(k+1)%4]) && (p3_x == ip_x[(k+2)%4] && p3_y == ip_y[(k+2)%4]) && (p4_x == ip_x[(k+3)%4] && p4_y == ip_y[(k+3)%4]) ) {
                break;
            } else if ( (p1_x == ip_x[k] && p1_y == ip_y[k]) && (p2_x == ip_x[(k+2)%4] && p2_y == ip_y[(k+2)%4]) && (p3_x == ip_x[(k+1)%4] && p3_y == ip_y[(k+1)%4]) && (p4_x == ip_x[(k+3)%4] && p4_y == ip_y[(k+3)%4]) ) {
                break;
            }*/
          }
          if (!delFlag && ip1Flag /* && ip2Flag && ip3Flag && ip4Flag*/ ) {
            delFlag = true;
            for (let d = 0; d < mapObject.length; d++) {
              if (mapObject[d].type == "unmoveble") {
                mapObject.splice(d, 1);
                d--;
                console.log("del count");
              }
            }
            updateObjectGraph();

          } else {
            ip1Flag = false;
            ip2Flag = false;
            ip3Flag = false;
            ip4Flag = false;
          }
        }


      } else if (type == "C") {
        if (onChanging == false) {
          var value = tempAction.value;
          for (var i = 0; i < value.length; ++i) {
            //var o = -1;
            var nowValue = value[i];
            if (nowValue.obj == -1) {
              if (player == 1) {
                people_init["type"] = nowValue.type;
              } else if (player == 2) {
                people_init2["type"] = nowValue.type;
              } else if (player == 3) {
                people_init3["type"] = nowValue.type;
              } else if (player == 4) {
                people_init4["type"] = nowValue.type;
              }
            } else {
              mapObject[nowValue.obj].type = nowValue.type;
              /*if (nowValue.x > -1 && nowValue.y > -1) {
                for (let ssi = 0; ssi < mapObject.length && o < 0; ssi++) {
                  // console.log(mapObject[ssi].type);
                  //if (mapObject[ssi].type == "lock2" || mapObject[ssi].type == "unlockfail2") {
                  if (mapObject[ssi].type == "door") {
                    if (mapObject[ssi].postion[0] == nowValue.x && mapObject[ssi].postion[1] == nowValue.y) {
                      o = ssi;
                      lock2DelObjpos = o;
                      break;
                    }
                  }
                }
              } else {
                o = nowValue.obj;
              }
              if (nowValue.type && o > -1) {
                // console.log(nowValue.type);
                // console.log(o,mapObject[o]);
                mapObject[o].type = nowValue.type;
              }*/
            }
          }
        }
        var delayAnimn = tempAction.value[0].type;
        //if (delayAnimn == "unlock" || delayAnimn == "unlock2" || delayAnimn == "unlockfail2" || delayAnimn == "enemyDead") {
        if (delayAnimn == "door_open") {
          onChanging = true;
          --delayResSpeed;
          if (delayResSpeed < 0) {
            onChanging = false;
            ++action_now;
          }
        } else {
          onChanging = false;
          ++action_now;
        }
        updateObjectGraph();
        //socket.emit("update", 2);
      } else if (type == "D") {
        var value = tempAction.value;
        // console.log(mapObject);
        for (var i = 0; i < value.length; ++i) {
          var nowValue = value[i];
          var o = -1;
          // console.log("und Test:",nowValue,nowValue.x,nowValue.y);
          if (nowValue.x > -1 && nowValue.y > -1) {
            for (let ssi = 0; ssi < mapObject.length && o < 0; ssi++) {
              // console.log(mapObject[ssi].type);
              //if (mapObject[ssi].type == "lock2" || mapObject[ssi].type == "unlock2") {
              if (mapObject[ssi].type == "door" || mapObject[ssi].type == "door_open") {
                if (mapObject[ssi].postion[0] == nowValue.x && mapObject[ssi].postion[1] == nowValue.y) {
                  o = ssi;
                  break;
                }
              }
            }
            // console.log("test O:",o);
          } else if (nowValue.forgetDel > 0) {
            // if(nowValue.obj<=lock2DelObjpos+nowValue.forgetDel){
            //     o = nowValue.obj+nowValue.forgetDel;
            // }
            console.log(nowValue.obj, nowValue.forgetDel, lock2DelObjpos);

            if (nowValue.obj + nowValue.forgetDel < lock2DelObjpos) {
              o = nowValue.obj + nowValue.forgetDel;
            } else {
              o = nowValue.obj;

            }
          } else {
            o = nowValue.obj;
          }
          mapObject.splice(o, 1);
        }
        // console.log(mapObject);
        updateObjectGraph();
        //socket.emit("update", 2);
        ++action_now;
      }
      break;
    }
    // sleep(50);
    if (mapObjectChange == true) {
      updateCanvas();
      //socket.emit("update", 4);
    }
    ////old///
    /*if (pipleLineSpeed == 0 && (!onChanged || action_code.length - action_now == 0)) {
        endgame();

    }*/
  }

}

function updateBackgroundGraph() {
  // backgroundGraph = createGraphics(width, height);
  backgroundGraph.clear();
  backgroundGraph.noStroke();
  var imgDungeon = imgObject[parseInt(imgDic["dungeon"])];

  for (var y = 0; y < mapSize; ++y) {
    for (var x = 0; x < mapSize; ++x) {
      var i = y * mapSize + x;

      if (map[i] == '0') {
        // backgroundGraph.fill('#bafba7');
        backgroundGraph.image(imgDungeon, x * edgeToWidth, y * edgeToHeight, edgeToWidth, edgeToHeight);
      } else {
        console.log("mapValue err:", map[i]);
      }
    }
  }


  for (var i = 0; i < end_init.length; ++i) {
    // var pg = createGraphics(edgeToWidth, edgeToHeight);
    pg.clear();
    pg.push();
    var dx = end_init[i]["postion"][0] * edgeToWidth,
      dy = end_init[i]["postion"][1] * edgeToHeight,
      drotate = 360 - end_init[i]["postion"][2] * 90;
    var img = imgObject[parseInt(imgDic[end_init[i]["type"]])];
    pg.translate(pg.width / 2, pg.height / 2);
    pg.rotate(PI / 180 * drotate);
    pg.image(img, -edgeToWidth / 2, -edgeToHeight / 2, edgeToWidth, edgeToHeight);
    backgroundGraph.image(pg, dx, dy, edgeToWidth, edgeToHeight);
    pg.pop();
  }
  var img = imgObject[parseInt(imgDic["start"])];
  backgroundGraph.image(img, people_init["postion"][0] * edgeToWidth, people_init["postion"][1] * edgeToHeight, edgeToWidth, edgeToHeight);
  backgroundGraph.image(img, people_init2["postion"][0] * edgeToWidth, people_init2["postion"][1] * edgeToHeight, edgeToWidth, edgeToHeight);
  backgroundGraph.image(img, people_init3["postion"][0] * edgeToWidth, people_init3["postion"][1] * edgeToHeight, edgeToWidth, edgeToHeight);
  backgroundGraph.image(img, people_init4["postion"][0] * edgeToWidth, people_init4["postion"][1] * edgeToHeight, edgeToWidth, edgeToHeight);
}

function updateObjectGraph() {
  HPObject = [];
  // objectGraph = createGraphics(width, height);
  objectGraph.clear();
  // console.log(mapObject);

  for (var i = 0; i < mapObject.length; ++i) {
    var obj = mapObject[i];
    var dx = obj["postion"][0] * edgeToWidth,
      dy = obj["postion"][1] * edgeToHeight;
    var img = imgObject[parseInt(imgDic[obj["type"]])];
    if (obj["type"] == "bullet") {
      dx = obj["postion"][0], dy = obj["postion"][1];
      // var drotate = obj["postion"][2] * 90 + 90;

      var drotate = (4 - obj["postion"][2]) * 90 + 90;
      // var drotate = obj["postion"][2] * 90 + 270;
      // var pg = createGraphics(edgeToWidth, edgeToHeight);
      pg.clear();
      pg.push(); //   pg.pop();
      pg.translate(pg.width / 2, pg.height / 2);
      pg.rotate(PI / 180 * drotate);
      pg.image(img, -edgeToWidth / 2, -edgeToHeight / 2, edgeToWidth, edgeToHeight);
      objectGraph.image(pg, dx, dy, edgeToWidth, edgeToHeight);
      pg.pop();

    } else if (obj["type"] == "HPandArmor" || obj["type"] == "HP") {
      HPObject.push(obj);
    } else {
      objectGraph.image(img, dx, dy, edgeToWidth, edgeToHeight);
    }

  }

}

function updatePeopleGraph() {
  // console.log("updatePeopleGraph");
  if (people_init) {
    // peopleGraph = createGraphics(width, height);
    peopleGraph.clear();
    // var pg = createGraphics(edgeToWidth, edgeToHeight);
    pg.clear();
    pg.push();
    var dx = now_PeooleX,
      dy = now_PeooleY,
      drotate = now_PeooleEESW;
    var img = imgObject[parseInt(imgDic[people_init["type"]])];
    pg.translate(pg.width / 2, pg.height / 2);
    pg.rotate(PI / 180 * drotate);
    pg.image(img, -edgeToWidth / 2, -edgeToHeight / 2, edgeToWidth, edgeToHeight);
    peopleGraph.image(pg, dx, dy, edgeToWidth, edgeToHeight);

    pg.pop();
  }
}

function updatePeopleGraph2() {
  if (people_init2) {
    // peopleGraph = createGraphics(width, height);
    peopleGraph2.clear();
    // var pg = createGraphics(edgeToWidth, edgeToHeight);
    pg.clear();
    pg.push();
    var dx2 = now_PeooleX2,
      dy2 = now_PeooleY2,
      drotate2 = now_PeooleEESW2;
    var img2 = imgObject[parseInt(imgDic[people_init2["type"]])];
    pg.translate(pg.width / 2, pg.height / 2);
    pg.rotate(PI / 180 * drotate2);
    pg.image(img2, -edgeToWidth / 2, -edgeToHeight / 2, edgeToWidth, edgeToHeight);
    peopleGraph2.image(pg, dx2, dy2, edgeToWidth, edgeToHeight);

    pg.pop();
  }
}

function updatePeopleGraph3() {
  if (people_init3) {
    // peopleGraph = createGraphics(width, height);
    peopleGraph3.clear();
    // var pg = createGraphics(edgeToWidth, edgeToHeight);
    pg.clear();
    pg.push();
    var dx3 = now_PeooleX3,
      dy3 = now_PeooleY3,
      drotate3 = now_PeooleEESW3;
    var img3 = imgObject[parseInt(imgDic[people_init3["type"]])];
    pg.translate(pg.width / 2, pg.height / 2);
    pg.rotate(PI / 180 * drotate3);
    pg.image(img3, -edgeToWidth / 2, -edgeToHeight / 2, edgeToWidth, edgeToHeight);
    peopleGraph3.image(pg, dx3, dy3, edgeToWidth, edgeToHeight);

    pg.pop();
  }
}

function updatePeopleGraph4() {
  if (people_init4) {
    // peopleGraph = createGraphics(width, height);
    peopleGraph4.clear();
    // var pg = createGraphics(edgeToWidth, edgeToHeight);
    pg.clear();
    pg.push();
    var dx4 = now_PeooleX4,
      dy4 = now_PeooleY4,
      drotate4 = now_PeooleEESW4;
    var img4 = imgObject[parseInt(imgDic[people_init4["type"]])];
    pg.translate(pg.width / 2, pg.height / 2);
    pg.rotate(PI / 180 * drotate4);
    pg.image(img4, -edgeToWidth / 2, -edgeToHeight / 2, edgeToWidth, edgeToHeight);
    peopleGraph4.image(pg, dx4, dy4, edgeToWidth, edgeToHeight);

    pg.pop();
  }
}

function updateCanvas() {
  // clear();
  if (haveFoggy) {
    // console.log("sucess");
    var img = imgObject[parseInt(imgDic["foggy"])];
    var peopleFoggyImg = imgObject[parseInt(imgDic["peopleFoggy"])];

    var dx = now_PeooleX - edgeToWidth,
      dy = now_PeooleY - edgeToHeight;
    var dx2 = now_PeooleX2 - edgeToWidth,
      dy2 = now_PeooleY2 - edgeToHeight;
    var dx3 = now_PeooleX3 - edgeToWidth,
      dy3 = now_PeooleY3 - edgeToHeight;
    var dx4 = now_PeooleX4 - edgeToWidth,
      dy4 = now_PeooleY4 - edgeToHeight;

    var dWidth = edgeToWidth * 3,
      dHight = edgeToHeight * 3;
    // console.log(dWidth, dHight);
    image(img, 0, 0, width, height);
    image(backgroundGraph, dx, dy, dWidth, dHight, dx, dy, dWidth, dHight);
    image(objectGraph, dx, dy, dWidth, dHight, dx, dy, dWidth, dHight);
    image(peopleGraph, dx, dy, dWidth, dHight, dx, dy, dWidth, dHight);

    image(backgroundGraph, dx2, dy2, dWidth, dHight, dx2, dy2, dWidth, dHight);
    image(objectGraph, dx2, dy2, dWidth, dHight, dx2, dy2, dWidth, dHight);
    image(peopleGraph2, dx2, dy2, dWidth, dHight, dx2, dy2, dWidth, dHight);

    image(backgroundGraph, dx3, dy3, dWidth, dHight, dx3, dy3, dWidth, dHight);
    image(objectGraph, dx3, dy3, dWidth, dHight, dx3, dy3, dWidth, dHight);
    image(peopleGraph3, dx3, dy3, dWidth, dHight, dx3, dy3, dWidth, dHight);

    image(backgroundGraph, dx4, dy4, dWidth, dHight, dx4, dy4, dWidth, dHight);
    image(objectGraph, dx4, dy4, dWidth, dHight, dx4, dy4, dWidth, dHight);
    image(peopleGraph4, dx4, dy4, dWidth, dHight, dx4, dy4, dWidth, dHight);

    for (let HPi = 0; HPi < HPObject.length; HPi++) {
      var obj = HPObject[HPi];
      var img = imgObject[parseInt(imgDic[obj["type"]])];
      var dx = obj["postion"][0] * edgeToWidth;
      var dy = obj["postion"][1] * edgeToHeight + 0.85 * edgeToHeight;
      hp = obj["hp"];
      if (obj["type"] == "HPandArmor") {
        armor = obj["armor"];
        // console.log(dx, dy, )
        console.log(" hp:", hp, " armor:", armor);
        // fill(0);
        // text(hp, dx+0.35*edgeToWidth, dy);
        // text(armor, dx+0.85*edgeToWidth, dy);
        if (hp >= 10) { //30 40
          var d10 = imgObject[parseInt(imgDic[Math.floor(hp / 10).toString()])];
          var d = imgObject[parseInt(imgDic[Math.floor(hp % 10).toString()])];
          image(d10, dx + 0.3 * edgeToWidth, dy, edgeToWidth * 0.1, edgeToHeight * 0.15);
          image(d, dx + 0.4 * edgeToWidth, dy, edgeToWidth * 0.1, edgeToHeight * 0.15);
        } else { //35
          // var d = imgObject[parseInt(imgDic[Math.floor(hp % 10).toString()])];
          // image(d, dx + 0.30 * edgeToWidth, dy, edgeToWidth * 0.1, edgeToHeight * 0.15);
          if (hp < 0) {
            var d = imgObject[parseInt(imgDic["0".toString()])];
            image(d, dx + 0.45 * edgeToWidth, dy, edgeToWidth * 0.1, edgeToHeight * 0.15);
          } else {
            var d = imgObject[parseInt(imgDic[Math.floor(hp % 10).toString()])];
            image(d, dx + 0.35 * edgeToWidth, dy, edgeToWidth * 0.1, edgeToHeight * 0.15);
          }
        }
        if (armor >= 10) { //60 70
          var d10 = imgObject[parseInt(imgDic[Math.floor(armor / 10).toString()])];
          var d = imgObject[parseInt(imgDic[Math.floor(armor % 10).toString()])];
          image(d10, dx + 0.65 * edgeToWidth, dy, edgeToWidth * 0.1, edgeToHeight * 0.15);
          image(d, dx + 0.75 * edgeToWidth, dy, edgeToWidth * 0.1, edgeToHeight * 0.15);
        } else {
          if (armor < 0) {
            var d = imgObject[parseInt(imgDic["0".toString()])];
            image(d, dx + 0.65 * edgeToWidth, dy, edgeToWidth * 0.1, edgeToHeight * 0.15);
          } else {
            var d = imgObject[parseInt(imgDic[Math.floor(armor % 10).toString()])];
            image(d, dx + 0.65 * edgeToWidth, dy, edgeToWidth * 0.1, edgeToHeight * 0.15);
          }
        }
        image(img, dx, dy, edgeToWidth, edgeToHeight * 0.15);
      } else if (obj["type"] == "HP") {
        /*777777 */
        // console.log(dx, dy, "hp:", hp);
        // fill(0);
        // var ndy = dy + 0.10 * edgeToHeight;
        var ndy = dy;
        // text(hp, dx+0.65*edgeToWidth, dy);
        if (hp >= 10) { //40 50
          var d10 = imgObject[parseInt(imgDic[Math.floor(hp / 10).toString()])];
          var d = imgObject[parseInt(imgDic[Math.floor(hp % 10).toString()])];
          image(d10, dx + 0.45 * edgeToWidth, ndy, edgeToWidth * 0.1, edgeToHeight * 0.15);
          image(d, dx + 0.55 * edgeToWidth, ndy, edgeToWidth * 0.1, edgeToHeight * 0.15);
        } else { //45
          if (hp < 0) {
            var d = imgObject[parseInt(imgDic["0".toString()])];
            image(d, dx + 0.65 * edgeToWidth, ndy, edgeToWidth * 0.1, edgeToHeight * 0.15);
          } else {
            var d = imgObject[parseInt(imgDic[Math.floor(hp).toString()])];
            image(d, dx + 0.65 * edgeToWidth, ndy, edgeToWidth * 0.1, edgeToHeight * 0.15);
          }
        }
        image(img, dx, ndy, edgeToWidth, edgeToHeight * 0.15);
      }
    }

    image(peopleFoggyImg, dx, dy, dWidth, dHight);


  } else {
    image(backgroundGraph, 0, 0, width, height);
    image(objectGraph, 0, 0, width, height);
    image(peopleGraph, 0, 0, width, height);
    image(peopleGraph2, 0, 0, width, height);
    image(peopleGraph3, 0, 0, width, height);
    image(peopleGraph4, 0, 0, width, height);
    for (let HPi = 0; HPi < HPObject.length; HPi++) {
      var obj = HPObject[HPi];
      var img = imgObject[parseInt(imgDic[obj["type"]])];
      var dx = obj["postion"][0] * edgeToWidth;
      var dy = obj["postion"][1] * edgeToHeight + 0.85 * edgeToHeight;
      hp = obj["hp"];
      if (obj["type"] == "HPandArmor") {
        armor = obj["armor"];
        // console.log(dx, dy, )
        console.log(" hp:", hp, " armor:", armor);
        // fill(0);
        // text(hp, dx+0.35*edgeToWidth, dy);
        // text(armor, dx+0.85*edgeToWidth, dy);
        if (hp >= 10) { //30 40
          var d10 = imgObject[parseInt(imgDic[Math.floor(hp / 10).toString()])];
          var d = imgObject[parseInt(imgDic[Math.floor(hp % 10).toString()])];
          image(d10, dx + 0.3 * edgeToWidth, dy, edgeToWidth * 0.1, edgeToHeight * 0.15);
          image(d, dx + 0.4 * edgeToWidth, dy, edgeToWidth * 0.1, edgeToHeight * 0.15);
        } else { //35
          // var d = imgObject[parseInt(imgDic[Math.floor(hp % 10).toString()])];
          // image(d, dx + 0.30 * edgeToWidth, dy, edgeToWidth * 0.1, edgeToHeight * 0.15);
          if (hp < 0) {
            var d = imgObject[parseInt(imgDic["0".toString()])];
            image(d, dx + 0.45 * edgeToWidth, dy, edgeToWidth * 0.1, edgeToHeight * 0.15);
          } else {
            var d = imgObject[parseInt(imgDic[Math.floor(hp % 10).toString()])];
            image(d, dx + 0.35 * edgeToWidth, dy, edgeToWidth * 0.1, edgeToHeight * 0.15);
          }
        }
        if (armor >= 10) { //60 70
          var d10 = imgObject[parseInt(imgDic[Math.floor(armor / 10).toString()])];
          var d = imgObject[parseInt(imgDic[Math.floor(armor % 10).toString()])];
          image(d10, dx + 0.65 * edgeToWidth, dy, edgeToWidth * 0.1, edgeToHeight * 0.15);
          image(d, dx + 0.75 * edgeToWidth, dy, edgeToWidth * 0.1, edgeToHeight * 0.15);
        } else {
          if (armor < 0) {
            var d = imgObject[parseInt(imgDic["0".toString()])];
            image(d, dx + 0.65 * edgeToWidth, dy, edgeToWidth * 0.1, edgeToHeight * 0.15);
          } else {
            var d = imgObject[parseInt(imgDic[Math.floor(armor % 10).toString()])];
            image(d, dx + 0.65 * edgeToWidth, dy, edgeToWidth * 0.1, edgeToHeight * 0.15);
          }
        }
        image(img, dx, dy, edgeToWidth, edgeToHeight * 0.15);
      } else if (obj["type"] == "HP") {
        /*777777 */
        // console.log(dx, dy, "hp:", hp);
        // fill(0);
        // var ndy = dy + 0.10 * edgeToHeight;
        var ndy = dy;
        // text(hp, dx+0.65*edgeToWidth, dy);
        if (hp >= 10) { //40 50
          var d10 = imgObject[parseInt(imgDic[Math.floor(hp / 10).toString()])];
          var d = imgObject[parseInt(imgDic[Math.floor(hp % 10).toString()])];
          image(d10, dx + 0.45 * edgeToWidth, ndy, edgeToWidth * 0.1, edgeToHeight * 0.15);
          image(d, dx + 0.55 * edgeToWidth, ndy, edgeToWidth * 0.1, edgeToHeight * 0.15);
        } else { //45
          if (hp < 0) {
            var d = imgObject[parseInt(imgDic["0".toString()])];
            image(d, dx + 0.45 * edgeToWidth, dy, edgeToWidth * 0.1, edgeToHeight * 0.15);
          } else {
            var d = imgObject[parseInt(imgDic[Math.floor(hp % 10).toString()])];
            image(d, dx + 0.45 * edgeToWidth, ndy, edgeToWidth * 0.1, edgeToHeight * 0.15);
          }
        }
        image(img, dx, ndy, edgeToWidth, edgeToHeight * 0.15);
      }
    }
  }
  return true;
}

function codeToCompiler(stringCode) {
  //輸出字串處理
  //challengeGameAgain();
  createLoadingView();
  textarea_0 = document.getElementById('textarea_0');
  computeEndCode = textarea_0.value;
  // console.log("stringCode:",textarea_0.value);
  // console.log("stringCode:",stringCode);
  if (stringCode) {
    textarea_0.value = stringCode;
  }
  // console.log("stringCode:",textarea_0.value);
  var addfun = codeValue;
  if (data.extendCode) {
    addfun += data.extendCode;
  }

  var indexof = textarea_0.value.indexOf("int main(");
  var tempStr = textarea_0.value.indexOf("{", indexof);
  var tempBefore = textarea_0.value.substr(0, tempStr + 1);
  var tempAfter = textarea_0.value.substr(tempStr + 1);
  tempBefore += "input_init();";
  tempBefore += tempAfter;
  tempStr = tempBefore;
  tempBefore = addfun + tempStr;
  var mapStr = map;
  // console.log("map為:",mapStr);

  /*var peopleAtk = equipmentData.weaponLevel[user.weaponLevel].attack;
  var peopleArmor = equipmentData.armorLevel[user.armorLevel].attack;
  console.log(peopleAtk, peopleArmor);*/
  /*var peopleStr = people_init["postion"][0].toString() + " " + people_init["postion"][1].toString() + " " + people_init["postion"][2].toString();*/

  //console.log("test:",user._id);
  //console.log("test2:",players[0].userId);
  if (!userNum) {
    if (user._id == players[0].userId) {
      userNum = 1;
    } else if (user._id == players[1].userId) {
      userNum = 2;
    } else if (user._id == players[2].userId) {
      userNum = 3;
    } else if (user._id == players[3].userId) {
      userNum = 4;
    }
    console.log("userNum_init");
  }
  if (userNum == 1) { //user._id == players[0].userId
    var peopleStr = p1_x.toString() + " " + p1_y.toString() + " " + p1_z.toString();
    console.log("P1:", peopleStr);
  } else if (userNum == 2) {
    var peopleStr = p2_x.toString() + " " + p2_y.toString() + " " + p2_z.toString();
    console.log("P2:", peopleStr);
  } else if (userNum == 3) {
    var peopleStr = p3_x.toString() + " " + p3_y.toString() + " " + p3_z.toString();
    console.log("P3:", peopleStr);
  } else if (userNum == 4) {
    var peopleStr = p4_x.toString() + " " + p4_y.toString() + " " + p4_z.toString();
    console.log("P4:", peopleStr);
  }


  // if (people_init["hp"]) {
  //     peopleStr = peopleStr + " " + people_init["hp"] + " " + people_init["armor"] + " " + people_init["atk"];
  // }
  // else {
  //     peopleStr = peopleStr + " 5  80  20";
  // }

  //玩家血量護甲攻擊
  //peopleStr = peopleStr + " 5  " + peopleArmor.toString() + " " + peopleAtk.toString();
  peopleStr = peopleStr + " 5  " + "20" + " " + "20" + " 0";



  // console.log("people初始位置:",peopleStr);
  var endlineStr = end_init.length.toString();
  for (var i = 0; i < end_init.length; ++i) {
    endlineStr = endlineStr + " " + end_init[i]["postion"][0] + " " + end_init[i]["postion"][1] + " " + end_init[i]["postion"][2];
  }
  // console.log("endline數量 [初始位置]:",endlineStr);
  var mpaobjStr = mapObject.length.toString();
  for (var i = 0; i < mapObject.length; ++i) {
    if (mapObject[i]['type'] == 'rune_table') {
      mpaobjStr = mpaobjStr + " " + mapObject[i]["type"] + " " + mapObject[i]["postion"][0] + " " + mapObject[i]["postion"][1] + " " + mapObject[i]['Num'];
    } else if (mapObject[i]['type'] == 'trigger') {
      mpaobjStr = mpaobjStr + " " + mapObject[i]["type"] + " " + mapObject[i]["postion"][0] + " " + mapObject[i]["postion"][1] + " " + mapObject[i]['ans'];
      if (!initFlag) {
        triggerFlag = true;
        console.log("triggerFlag to true");
        if (mapObject[i]['ans'] == data.input1) {
          ip_x.push(mapObject[i]["postion"][0]);
          ip_y.push(mapObject[i]["postion"][1]);
          //ip1_x = mapObject[i]["postion"][0];
          //ip1_y = mapObject[i]["postion"][1];
        } else if (mapObject[i]['ans'] == data.input2) {
          ip_x.push(mapObject[i]["postion"][0]);
          ip_y.push(mapObject[i]["postion"][1]);
          //ip2_x = mapObject[i]["postion"][0];
          //ip2_y = mapObject[i]["postion"][1];
        } else if (mapObject[i]['ans'] == data.input3) {
          ip_x.push(mapObject[i]["postion"][0]);
          ip_y.push(mapObject[i]["postion"][1]);
          //ip3_x = mapObject[i]["postion"][0];
          //ip3_y = mapObject[i]["postion"][1];
        } else if (mapObject[i]['ans'] == data.input4) {
          ip_x.push(mapObject[i]["postion"][0]);
          ip_y.push(mapObject[i]["postion"][1]);
          //ip4_x = mapObject[i]["postion"][0];
          //ip4_y = mapObject[i]["postion"][1];
        }
      }
    } else if (mapObject[i]['type'] == 'array_table') {
      mpaobjStr = mpaobjStr + " " + mapObject[i]["type"] + " " + mapObject[i]["postion"][0] + " " + mapObject[i]["postion"][1];
      mpaobjStr = mpaobjStr + " " + mapObject[i]["arr"][0] + " " + mapObject[i]["arr"][1] + " " + mapObject[i]["arr"][2] + " " + mapObject[i]["arr"][3];
    } else if (mapObject[i]['type'] == 'box_closed') {
      mpaobjStr = mpaobjStr + " " + mapObject[i]["type"] + " " + mapObject[i]["postion"][0] + " " + mapObject[i]["postion"][1];
      mpaobjStr = mpaobjStr + " " + mapObject[i]["ans"][0] + " " + mapObject[i]["ans"][1] + " " + mapObject[i]["ans"][2] + " " + mapObject[i]["ans"][3];
      if (mapObject[i]["num"] == 1) {
        mpaobjStr = mpaobjStr + " " + data.input1;
      } else if (mapObject[i]["num"] == 2) {
        mpaobjStr = mpaobjStr + " " + data.input2;
      } else if (mapObject[i]["num"] == 3) {
        mpaobjStr = mpaobjStr + " " + data.input3;
      } else if (mapObject[i]["num"] == 4) {
        mpaobjStr = mpaobjStr + " " + data.input4;
      }

    } else if (mapObject[i]['type'] == 'loop_flame') {
      mpaobjStr = mpaobjStr + " " + mapObject[i]["type"] + " " + mapObject[i]["postion"][0] + " " + mapObject[i]["postion"][1];
      if (!initFlag) {
        loopNum++;
      }
    } else {
      mpaobjStr = mpaobjStr + " " + mapObject[i]["type"] + " " + mapObject[i]["postion"][0] + " " + mapObject[i]["postion"][1];
    }
  }

  console.log("Now ip_x: ", ip_x, ",ip_y: ", ip_y);

  // console.log("mpaobjStr 數量 [初始位置]:",mpaobjStr);
  var str = [mapStr, peopleStr, endlineStr, mpaobjStr].join('\n');
  inputStr = str;
  /*if (data.input != "z0") { //為第 6 關  11
    inputStr = inputStr + " " + data.input;
  } else {
    inputStr = inputStr + data.input;
  }*/
  if (inputFlag) {
    if (inputNum == 1) {
      inputStr = inputStr + data.input1;
    } else if (inputNum == 2) {
      inputStr = inputStr + data.input2;
    } else if (inputNum == 3) {
      inputStr = inputStr + data.input3;
    } else if (inputNum == 4) {
      inputStr = inputStr + data.input4;
    }
    inputFlag = false;
    console.log("inputFlag to flase");
  }

  // console.log("tempBefore:",tempBefore);
  // console.log("inputStr:",inputStr);
  // console.log(tempBefore);
  var runInput = inputStr;
  initFlag = true;

  call_JDOODLE_api(tempBefore, runInput);

}

function clearcodeAndInit() {
  // console.log(initCode);
  textarea_0.value = initCode;
}

function codeOutputTranstionAction() {
  var source = decodeOutput;
  // console.log(source);

  // var temp = new Array();
  var temp = [],
    tempNew = [];
  temp = source.split("$");
  // console.log("das: ",temp);
  for (var i = 0; i < temp.length; ++i) {
    if (temp[i][0] != ' ') {
      if (temp[i][0] != 'I') {
        var spaceT = temp[i].split(' ');
        //  console.log("aaa: ",spaceT[0]);
        tempNew.push(spaceT[0]);
      } else {
        // console.log("77777777");
        // console.log("sad: ",temp[i]);
        tempNew.push(temp[i]);
      }
    }
  }
  // console.log(tempNew);
  // temp = tempNew.slice(0);
  temp.length = 0;

  // textarea_1.value = tempNew.join('\n');
  textarea_1.value = decodeOutput;
  closeLoadingView();
  var forgetDel = 0;

  for (var i = 0; i < tempNew.length; ++i) {
    var spaceT = tempNew[i].split(",,");
    if (spaceT.length < 2) {
      continue;
    }

    if (spaceT[0] == 'M') {
      var spaceList = [];
      for (var di = 1; di < spaceT.length; di = di + 2) {
        var tempList = spaceT[di + 1].split(',');
        var x = parseFloat(tempList[0]);
        var y = parseFloat(tempList[1]);
        var z = parseInt(tempList[2]);
        if (parseInt(spaceT[di]) == -1) {
          var listTranstion = {
            obj: parseInt(spaceT[di]),
            value: [x, y, z]
          }
          spaceList.push(listTranstion);
        } else {
          var listTranstion = {
            obj: parseInt(spaceT[di]) - forgetDel,
            value: [x, y, z]
          }
          spaceList.push(listTranstion);
        }

      }
      var spaceTranstion = {
        type: "M",
        value: spaceList
      }
      temp.push(spaceTranstion);
    } else if (spaceT[0] == 'C') {
      var spaceList = [],
        waitD = [];
      var conditionD = true;
      var loopCount = 0;
      while (conditionD) {
        console.log(spaceT);
        for (var di = 1; di < spaceT.length; di = di + 2) {
          var o = parseInt(spaceT[di]) - forgetDel;
          var o = parseInt(spaceT[di]) - forgetDel;
          if (loopCount > 0 && parseInt(spaceT[di]) == -1) {
            o = -1 - loopCount;
          }
          var listTranstion = {
            obj: o + loopCount,
            type: spaceT[di + 1]
          }
          spaceList.push(listTranstion);
        }
        var ssi = i + 1,
          ssj = i + 2;
        if (ssj < tempNew.length) {
          var sstemp = tempNew[ssi].split(",,");
          var sstempJ = tempNew[ssj].split(",,");
          if (sstemp[0] == 'D' && sstempJ[0] == 'C') {
            waitD.push(tempNew[ssi]);
            i = ssj;
            spaceT = tempNew[i].split(",,");
          } else {
            conditionD = false;
            break;
          }
        } else {
          conditionD = false;
          break;
        }
        ++loopCount;
      }
      var spaceTranstion = {
        type: "C",
        value: spaceList
      }
      temp.push(spaceTranstion);
      if (waitD.length > 0) {
        var spaceListD = [];
        for (var sdi = 0; sdi < waitD.length; ++sdi) {
          spaceT = waitD[sdi].split(",,");
          for (var di = 1; di < spaceT.length; di++) {
            var tempList = spaceT[di];
            var listTranstion = {
              obj: parseInt(tempList) - forgetDel
            }
            spaceListD.push(listTranstion);
          }
        }
        var spaceTranstionD = {
          type: "D",
          value: spaceListD
        }
        temp.push(spaceTranstionD);
      }
    } else if (spaceT[0] == 'I') {
      // var o = parseInt(spaceT[1]);
      var o = -1,
        tlx, tly;
      var tempList = spaceT[1].split(',');
      for (let ssi = 0; ssi < mapObject.length && o < 0; ssi++) {
        // console.log(mapObject[ssi].type);
        //if (mapObject[ssi].type == "lock2") {
        if (mapObject[ssi].type == "door" || mapObject[ssi].type == "loop_flame") {
          tlx = parseInt(tempList[0]);
          tly = parseInt(tempList[1]);
          // console.log(tlx, tly);
          if (mapObject[ssi].postion[0] == tlx && mapObject[ssi].postion[1] == tly) {
            o = ssi;
            break;
          }
        }
      }
      if (o > -1 && spaceT[2].length > 0) {
        // console.log(mapObject[o - forgetDel].ans ,"  ",spaceT[2]);
        var conditionAns = true;
        var inputList = [];
        // if (spaceT[2].indexOf('') > -1) { //c++的空白
        //     let s=spaceT[2].split('');
        //     for (let indexS = 0; indexS < s.length; indexS++) {
        //         var element = s[indexS];
        //         let temp=element[2].split(' ');
        //         for (let indexST = 0; indexST < temp.length; indexST++) {
        //             inputList.push(temp[indexST]);
        //         }
        //     }
        // }
        // else{
        //     inputList = spaceT[2].split(' ');
        // }
        var indexSpace = spaceT[2].indexOf('');
        // while(indexSpace>-1){
        //     console.log(indexSpace,spaceT[2][indexSpace]);
        //     spaceT[2] = spaceT[2].substr(0, indexSpace-1) + ' ' + spaceT[2].substring(indexSpace+1, spaceT[2].length);
        //     // spaceT[2][indexSpace]=" ";
        //     console.log(indexSpace,spaceT[2],spaceT[2][indexSpace]);
        //     indexSpace=spaceT[2].indexOf('');
        // }
        var ns = "";
        if (indexSpace > -1) {
          for (let indexS = 0; indexS < spaceT[2].length; indexS++) {
            if (spaceT[2][indexS] == '') {
              ns = ns + " ";
            } else {
              ns = ns + spaceT[2][indexS];
            }
          }
        } else {
          ns = spaceT[2];
        }
        spaceT[2] = ns;
        inputList = spaceT[2].split(' ');


        //

        var ansList = mapObject[o].ans.split(' ');
        //console.log("ans:", ansList);
        //console.log("input:", inputList);
        // console.log(inputList,ansList);
        for (let ansI = 0; ansI < ansList.length; ansI++) {
          if (ansList[ansI].length < 1) {
            ansList.splice(ansI, 1);
            --ansI;
            continue;
          }
          var haveA = false;
          for (var inputI = 0; inputI < inputList.length; ++inputI) {
            if (inputList[inputI].length < 1) {
              inputList.splice(inputI, 1);
              --inputI;
              continue;
            }
            if (inputList[inputI] == ansList[ansI]) {
              inputList.splice(inputI, 1);
              haveA = true;
              break;
            }
          }
          if (haveA == false) {
            conditionAns = false;
            break;
          }
        }
        // console.log(inputList,ansList,conditionAns);
        for (let sindex = 0; sindex < inputList.length; sindex++) {
          if (inputList[sindex].length < 1) {
            inputList.splice(sindex, 1);
            --sindex;
            continue;
          }
        }

        //console.log("ans:", ansList);
        //console.log("input:", inputList);
        if (inputList.length > 0) {
          conditionAns = false;
        }
        if (conditionAns) {
          if (mapObject[o].type == "door") {
            var listTranstion = {
              obj: o,
              //type: "unlock2",
              type: "door_open",
              x: tlx,
              y: tly
            }
            var spaceTranstion = {
              type: "C",
              value: [listTranstion]
            }
            temp.push(spaceTranstion);
          } else if (mapObject[o].type == "loop_flame") {
            var listTranstion = {
              obj: o,
              //type: "unlock2",
              type: "loop_done",
              x: tlx,
              y: tly
            }
            var spaceTranstion = {
              type: "C",
              value: [listTranstion]
            }
            temp.push(spaceTranstion);

            loopNum--;
            console.log("loopNum: ", loopNum);
            if (loopNum == 0) {
              for (let k = 0; k < mapObject.length; k++) {
                if (mapObject[k].type == "loop_door") {
                  var listTranstion = {
                    obj: k,
                    //type: "unlock2",
                    type: "door_open",
                    x: mapObject[k].postion[0],
                    y: mapObject[k].postion[1]
                  }
                  var spaceTranstion = {
                    type: "C",
                    value: [listTranstion]
                  }
                  temp.push(spaceTranstion);
                  break;
                }
              }
            }
          }

        }
      }

    } else if (spaceT[0] == 'D') {
      var spaceList = [];
      var conditionD = true;
      while (conditionD) {
        for (var di = 1; di < spaceT.length; di++) {
          var tempList = spaceT[di];
          var listTranstion = {
            obj: parseInt(tempList) - forgetDel,
            forgetDel: forgetDel
          }
          spaceList.push(listTranstion);
        }
        var ssi = i + 1;
        if (ssi < tempNew.length) {
          var sstemp = tempNew[ssi].split(",,");
          if (sstemp[0] == 'D') {
            i = ssi;
            spaceT = tempNew[i].split(",,");
          } else {
            conditionD = false;
            break;
          }
        } else {
          conditionD = false;
          break;
        }
      }
      var spaceTranstion = {
        type: "D",
        value: spaceList
      }
      temp.push(spaceTranstion);
    } else if (spaceT[0] == 'E') {
      var spaceTranstion = {
        type: "E",
        value: parseInt(spaceT[1])
      }
      temp.push(spaceTranstion);
    } else if (spaceT[0] == 'S') {
      if (player == userNum) {
        inputNum = parseInt(spaceT[1]);
        console.log("inputNum: ", inputNum);
        inputFlag = true;
        console.log("inputFlag to true");
      }
    } else {
      console.log("error Type: ", spaceT);
    }


  }
  // temp = tempNew.slice(0);
  // timeD = new Date().getTime();
  if (temp.length > 0) {
    onChanged = true;
    onChanging = false;
    action_code = temp;
    gameEndingCode = 0;
    action_now = 0;
    //endgame();
    console.log("指令動作:", action_code);
  } else {
    action_code = [];
    gameEndingCode = 0;
    onChanged = false;
    onChanging = false;
    textarea_1.value = "";
    //endgame();
  }

}


function call_JDOODLE_api(scriptData, inputData) {
  var scriptData = {
    input: inputData,
    script: scriptData,
    language: "cpp",
    id: "001"
  }
  // console.log(scriptData);
  socket.emit('script', scriptData);

}

function decode_JDOODLE_api(str) {
  // console.log(str);
  console.log("gameRoomId: ", gameRoomId);
  /*var userNum;
  if (user._id == players[0].userId) {
    userNum = 1;
  } else if (user._id == players[1].userId) {
    userNum = 2;
  } else if (user._id == players[2].userId) {
    userNum = 3;
  } else if (user._id == players[3].userId) {
    userNum = 4;
  }*/
  console.log("userNum", userNum);
  socket.emit("move", gameRoomId, str, userNum);
  //decodeOutput = str;
  //codeOutputTranstionAction();
}

function challengeGameAgain() {
  data = JSON.parse(JSON.stringify(Res_data));
  // loadData();
  var dx = people_init["postion"][0] * edgeToWidth,
    dy = people_init["postion"][1] * edgeToHeight,
    drotate = 360 - people_init["postion"][2] * 90;
  old_PeooleX = dx, old_PeooleY = dy, old_PeooleEESW = drotate;
  now_PeooleX = dx, now_PeooleY = dy, now_PeooleEESW = drotate;
  var dx2 = people_init2["postion"][0] * edgeToWidth,
    dy2 = people_init2["postion"][1] * edgeToHeight,
    drotate2 = 360 - people_init2["postion"][2] * 90;
  old_PeooleX2 = dx2, old_PeooleY2 = dy2, old_PeooleEESW2 = drotate2;
  now_PeooleX2 = dx2, now_PeooleY2 = dy2, now_PeooleEESW2 = drotate2;
  var dx3 = people_init3["postion"][0] * edgeToWidth,
    dy3 = people_init3["postion"][1] * edgeToHeight,
    drotate3 = 360 - people_init3["postion"][2] * 90;
  old_PeooleX3 = dx3, old_PeooleY3 = dy3, old_PeooleEESW3 = drotate3;
  now_PeooleX3 = dx3, now_PeooleY3 = dy3, now_PeooleEESW3 = drotate3;
  var dx4 = people_init4["postion"][0] * edgeToWidth,
    dy4 = people_init4["postion"][1] * edgeToHeight,
    drotate4 = 360 - people_init4["postion"][2] * 90;
  old_PeooleX4 = dx4, old_PeooleY4 = dy4, old_PeooleEESW4 = drotate4;
  now_PeooleX4 = dx4, now_PeooleY4 = dy4, now_PeooleEESW4 = drotate4;

  edgeToWidth = width / mapSize;
  edgeToHeight = height / mapSize;
  iscreatecanvas = 1;
  action_now = 0;

  var mapNumber = data;
  if (mapNumber.foggy) {
    haveFoggy = true;
  } else {
    haveFoggy = false;
  }
  map = mapNumber['mapValue'];
  mapSize = Math.sqrt(mapNumber['mapSize']);
  people_init = mapNumber['people_init'];
  people_init2 = mapNumber['people_init2'];
  people_init3 = mapNumber['people_init3'];
  people_init4 = mapNumber['people_init4'];
  end_init = mapNumber['end_init'];
  mapObject = null;
  mapObject = mapNumber['obj'];
  mapwinLinit = mapNumber['winLinit'];


  // peopleGraph = createGraphics(width, height);
  // objectGraph = createGraphics(width, height);
  // backgroundGraph = createGraphics(width, height);
  // pg = createGraphics(edgeToWidth, edgeToHeight);
  peopleGraph.clear();
  peopleGraph2.clear();
  peopleGraph3.clear();
  peopleGraph4.clear();
  objectGraph.clear();
  backgroundGraph.clear();
  pg.clear();
  updateBackgroundGraph();
  updateObjectGraph();
  updatePeopleGraph();
  updatePeopleGraph2();
  updatePeopleGraph3();
  updatePeopleGraph4();
  updateCanvas();
  /*socket.emit("update", 1);
  socket.emit("update", 2);
  socket.emit("update", 3);
  socket.emit("update", 4);*/
  gameEndingCode = 0;
  decodeOutput = "";
  action_code = [];
  action_now = 0;
  p1_x = people_init["postion"][0];
  p1_y = people_init["postion"][1];
  p1_z = people_init["postion"][2];
  p2_x = people_init2["postion"][0];
  p2_y = people_init2["postion"][1];
  p2_z = people_init2["postion"][2];
  p3_x = people_init3["postion"][0];
  p3_y = people_init3["postion"][1];
  p3_z = people_init3["postion"][2];
  p4_x = people_init4["postion"][0];
  p4_y = people_init4["postion"][1];
  p4_z = people_init4["postion"][2];
}
