if (JSON && JSON.stringify && JSON.parse) var Session = Session || (function() {

  // cache window 物件
  var win = window.top || window;

  // 將資料都存入 window.name 這個 property
  var store = (win.name ? JSON.parse(win.name) : {});

  // 將要存入的資料轉成 json 格式
  function Save() {
    win.name = JSON.stringify(store);
  };

  // 在頁面 unload 的時候將資料存入 window.name
  if (window.addEventListener) window.addEventListener("unload", Save, false);
  else if (window.attachEvent) window.attachEvent("onunload", Save);
  else window.onunload = Save;

  // public methods
  return {

    // 設定一個 session 變數
    set: function(name, value) {
      store[name] = value;
    },

    // 列出指定的 session 資料
    get: function(name) {
      return (store[name] ? store[name] : undefined);
    },

    // 清除資料 ( session )
    clear: function() { store = {}; },

    // 列出所有存入的資料
    dump: function() { return JSON.stringify(store); }

  };

 })();
function back() {
 var index = 0;
 var href = window.location.href;
 for (var i = 0; i < href.length; ++i) {
   if (href[i] == '/' || href[i] == "\\") {
       index = i;
   }
 }
 href = href.substr(0, index + 1);
 href+="oblivionUser";
 window.location.replace(href);
 console.log(href);
}
var href = window.location.href;
var user,equipmentData,achievemenData,dictionaryData;
var swordLevel = 0, shieldLevel = 0, levelUpLevel = 0, musicLevel = 1,bkMusicSwitch,bkMusicVolumn = 0.1,args,gameSpeed;
var musicData;
var scriptData = {
    type: "init"
}

$.ajax({
    url: href,              // 要傳送的頁面
    method: 'POST',               // 使用 POST 方法傳送請求
    dataType: 'json',             // 回傳資料會是 json 格式
    data: scriptData,  // 將表單資料用打包起來送出去
    success: function (res) {
      // console.log(res);
      user = res;
      /*loadmusicData();*/
      // console.log(user);
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
              equipmentData = JSON.parse(this.responseText);
              initHome();
          }
      };
      xmlhttp.open("GET", "json/equipment.json", true);
      xmlhttp.send();
  }
})

function error() {
    alert("有不當的操作發生");
    window.location.replace(href);

}
function initHome() {
  console.log("???");
  let nowurl = new URL(window.location.href);
  let params = nowurl.searchParams;
  if (params.has('mapID')) {
    var thisLevelNum = params.get('mapID').toString();    // "react"
    console.log(thisLevelNum);
  }
  if(Session.get("bkMusicVolumn") != null && Session.get("bkMusicSwitch") != null && Session.get("musicLevel") != null && Session.get("gameSpeed") != null){
    //
    bkMusicVolumn = Session.get("bkMusicVolumn");
    bkMusicSwitch = Session.get("bkMusicSwitch");
    musicLevel = Session.get("musicLevel");
    gameSpeed = Session.get("gameSpeed");
  }else{
    bkMusicVolumn = 0.1;
    bkMusicSwitch = 2;
    musicLevel = 1;
    gameSpeed = 5;
  }
  myVid=document.getElementById("bkMusic");
  myVid.volume = --bkMusicSwitch * ((musicLevel) * bkMusicVolumn);
  myVid.play();
  bkMusicSwitch++;
  //console.log(myVid.volume);
  sendSession();
  var userName = document.getElementById("userName");
  var starNumber = document.getElementById("starNumber");
  var text = user.name;
  userName.textContent = text;
  starNumber.textContent = user.starNum;

  levelUpLevel = user.levelUpLevel;
  swordLevel = user.weaponLevel;
  shieldLevel = user.armorLevel;

  var passLevel;
  if(user.MediumEmpire.codeLevel.length != 0){
    passLevel = user.MediumEmpire.codeLevel.length;
    passLevel+=24;
  }else{
    if(user.EasyEmpire.codeLevel.length > user.EasyEmpire.blockLevel.length){
      passLevel = user.EasyEmpire.codeLevel.length;
      passLevel++;
    }else{
      passLevel = user.EasyEmpire.blockLevel.length;
      passLevel++;
    }
  }

  selectFunc(passLevel);
}

//---------紀錄關卡資訊---------//
function recordLevel(scriptData) {
    var NowDate = new Date();
    scriptData.submitTime = NowDate
    $.ajax({
        url: href,              // 要傳送的頁面
        method: 'POST',               // 使用 POST 方法傳送請求
        dataType: 'json',             // 回傳資料會是 json 格式
        data: scriptData,  // 將表單資料用打包起來送出去
        success: function (res) {
            user = res
            console.log(user);
        }
    })
}
function logout() {
    // console.log("dddddd");
    var href = "/logout";
    window.location.replace(href);
}

//////////////////////////////////////////////////
//              right.js                        //
//////////////////////////////////////////////////

var myVid;
var divID, divID2, divTag, b;
var userdataFont;
var dataTitle = ["帳&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp號：",
    "使用者名稱：",
    "主&nbsp要&nbsp進&nbsp&nbsp度：",
    "成&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp就：",
    "上架地圖數：",
    "已獲得星星數："];
function userData() {
    divID = "userDataView";
    divID2 = "userDataBkView";
    divTag = document.getElementById("center");
    b = document.createElement("div");
    b.setAttribute("id", "userDataBkView");
    b.setAttribute("onclick", "clossFunc(divID,divID2)");
    divTag.appendChild(b);
    b = document.createElement("div");
    b.setAttribute("id", "userDataView");
    divTag.appendChild(b);
    divTag = document.getElementById("userDataView");
    b = document.createElement("input");
    b.setAttribute("type", "button");
    b.setAttribute("id", "clossDiv");
    b.setAttribute("value", "X");
    b.setAttribute("onclick", "clossFunc(divID,divID2)");
    divTag.appendChild(b);
    createUserView(divID);
}
function clossFunc(thisDiv, thisDiv2) {
    divTag = document.getElementById(thisDiv);
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
    divTag = document.getElementById(thisDiv2);
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
    levelDivAlive = false;
}
function createUserView(mainDiv) {
    divTag = document.getElementById(mainDiv);
    b = document.createElement("h1");
    b.setAttribute("id", "allTitle");
    divTag.appendChild(b);
    document.getElementById("allTitle").innerHTML = "個人資料";
    b = document.createElement("div");
    b.setAttribute("id", "userInnerDiv");
    divTag.appendChild(b);
    divTag = document.getElementById("userInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "userH3Div");
    divTag.appendChild(b);
    divTag = document.getElementById("userH3Div");
    for (var i = 0; i < dataTitle.length; i++) {
        b = document.createElement("h3");
        b.setAttribute("id", "titleDatah3" + i);
        b.setAttribute("align", "left");
        divTag.appendChild(b);
        if(i == 0){
          userdataFont = user.username;
        }else if(i == 1){
          userdataFont = user.name;
        }else if(i == 2){
          if(user.MediumEmpire.HighestLevel > user.EasyEmpire.codeHighestLevel || user.MediumEmpire.HighestLevel > user.EasyEmpire.blockHighestLevel){
            userdataFont = "庫魯瑪帝國-第" + user.MediumEmpire.HighestLevel + "關";
          }else{
            if(user.EasyEmpire.codeHighestLevel > user.EasyEmpire.blockHighestLevel){
              userdataFont = "普魯斯帝國-第" + user.EasyEmpire.codeHighestLevel + "關";
            }else{
              userdataFont = "普魯斯帝國-第" + user.EasyEmpire.blockHighestLevel + "關";
            }
          }
        }else if(i == 3){
          userdataFont = "5/10";
        }else if(i == 4){
          userdataFont = user.createMap.length;
        }else if(i ==5){
          userdataFont = user.starNum;
        }
        document.getElementById("titleDatah3" + i).innerHTML = dataTitle[i] + userdataFont;
        for (var j = 0; j < 3; j++) {
            b = document.createElement("br");
            divTag.appendChild(b);
        }
    }
}

/*讀取網址資訊*/
function getArgs() {
   var args = new Object();
   var query = location.search.substring(1);
   var pairs = query.split("&");
   for(var i=0;i<pairs.length;i++) {
      var pos = pairs[i].indexOf("=");
      if (pos == -1) continue;
      var argname = pairs[i].substring(0,pos);
      var value = pairs[i].substring(pos+1);
      args[argname] = decodeURIComponent(value);
   }
   if (args.levelName){
     divTag = document.getElementById("titleFont");
     divTag.innerHTML = "";
     divTag.innerHTML = args.levelName;
   }
}

/*小幫手*/
function helper(mainDiv) {
  divID = "equipageView";
  divTag = document.getElementById(mainDiv.id);
  b = document.createElement("div");
  b.setAttribute("id","helperView");
  divTag.appendChild(b);
  divTag = document.getElementById("helperView");
  b = document.createElement("input");
  b.setAttribute("type","button");
  b.setAttribute("id","clossDiv");
  b.setAttribute("value","X");
  b.setAttribute("onclick","clossFunc(\"helperView\")");
  divTag.appendChild(b);
  b = document.createElement("h1");
  b.setAttribute("id","allTitle");
  divTag.appendChild(b);
  document.getElementById("allTitle").innerHTML = "關卡說明";
  b = document.createElement("textarea");
  b.setAttribute("id","helperTextarea0");
  divTag.appendChild(b);
  document.getElementById("helperTextarea0").innerHTML = "文字塊1";
  b = document.createElement("img");
  b.setAttribute("id","helperImg0");
  b.setAttribute("class","helperImg");
  divTag.appendChild(b);
  b = document.createElement("img");
  b.setAttribute("id","helperImg1");
  b.setAttribute("class","helperImg");
  divTag.appendChild(b);
  b = document.createElement("textarea");
  b.setAttribute("id","helperTextarea1");
  divTag.appendChild(b);
  document.getElementById("helperTextarea1").innerHTML = "文字塊2";
}

/*XX按鈕*/
function clossFunc(thisDiv,thisDiv2) {
  var divTag = document.getElementById(thisDiv);
  try {
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
  } catch (e) {}
  divTag = document.getElementById(thisDiv2);
  try {
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
  } catch (e) {}
  levelDivAlive = false;
}

/*清除指令*/
function clearButton(thisTextarea) {
  document.getElementById(thisTextarea.id).value = "";
}

/*設定*/
function settingAllView(mainDiv) {
    divID = "settingAllView";
    divID2 = "equipageBkView";
    divTag = document.getElementById(mainDiv.id);
    b = document.createElement("div");
    b.setAttribute("id", "equipageBkView");
    b.setAttribute("onclick", "clossFunc(\"settingAllView\",\"equipageBkView\")");
    divTag.appendChild(b);
    b = document.createElement("div");
    b.setAttribute("id", "settingAllView");
    divTag.appendChild(b);
    divTag = document.getElementById("settingAllView");
    b = document.createElement("input");
    b.setAttribute("type", "button");
    b.setAttribute("id", "clossDiv");
    b.setAttribute("value", "X");
    b.setAttribute("onclick", "clossFunc(\"settingAllView\",\"equipageBkView\")");
    divTag.appendChild(b);
    b = document.createElement("h1");
    b.setAttribute("id", "allTitle");
    divTag.appendChild(b);
    document.getElementById("allTitle").innerHTML = "設定";
    b = document.createElement("table");
    b.setAttribute("id", "settingAllTable");
    divTag.appendChild(b);

    /*設定音樂開或關*/
    divTag = document.getElementById("settingAllTable");
    b = document.createElement("tr");
    b.setAttribute("id", "tr0");
    divTag.appendChild(b);
    divTag = document.getElementById("tr0");
    b = document.createElement("td");
    b.setAttribute("id", "row0_0");
    divTag.appendChild(b);
    divTag = document.getElementById("row0_0");
    b = document.createElement("h2");
    b.setAttribute("id", "settingMusic");
    divTag.appendChild(b);
    document.getElementById("settingMusic").innerHTML = "遊戲音樂";
    divTag = document.getElementById("tr0");
    b = document.createElement("td");
    b.setAttribute("id", "row0_1");
    b.setAttribute("colspan", "2");
    divTag.appendChild(b);
    divTag = document.getElementById("row0_1");
    b = document.createElement("form");
    b.setAttribute("id", "musicForm");
    b.setAttribute("name", "form1");
    divTag.appendChild(b);
    divTag = document.getElementById("musicForm");
    b = document.createElement("input");
    b.setAttribute("type", "checkbox");
    b.setAttribute("id", "musicOpen");
    b.setAttribute("name", "c1");
    b.setAttribute("value", "1");
    b.setAttribute("onclick", "return chk(this);");
    if(bkMusicSwitch == 2){
      b.setAttribute("checked", "true");
    }
    divTag.appendChild(b);
    b = document.createElement("font");
    b.setAttribute("id", "openText");
    divTag.appendChild(b);
    document.getElementById("openText").innerHTML = "開";
    b = document.createElement("input");
    b.setAttribute("type", "checkbox");
    b.setAttribute("id", "musicClose");
    b.setAttribute("name", "c1");
    b.setAttribute("value", "2");
    b.setAttribute("onclick", "return chk(this);");
    if(bkMusicSwitch == 1){
      b.setAttribute("checked", "true");
    }
    divTag.appendChild(b);
    b = document.createElement("font");
    b.setAttribute("id", "closeText");
    divTag.appendChild(b);
    document.getElementById("closeText").innerHTML = "關";
    /*設定音量大小*/
    divTag = document.getElementById("settingAllTable");
    b = document.createElement("tr");
    b.setAttribute("id", "tr1");
    divTag.appendChild(b);
    divTag = document.getElementById("tr1");
    b = document.createElement("td");
    b.setAttribute("id", "row1_0");
    divTag.appendChild(b);
    divTag = document.getElementById("row1_0");
    b = document.createElement("h2");
    b.setAttribute("id", "musicVolume");
    divTag.appendChild(b);
    document.getElementById("musicVolume").innerHTML = "音樂大小";
    divTag = document.getElementById("tr1");
    b = document.createElement("td");
    b.setAttribute("id", "row1_1");
    divTag.appendChild(b);
    divTag = document.getElementById("row1_1");
    b = document.createElement("input");
    b.setAttribute('type', 'button');
    b.setAttribute('id', 'volumeButtonSub');
    b.setAttribute('onclick', 'musicLevelDown()');
    b.setAttribute('value', '-');
    divTag.appendChild(b);

    divTag = document.getElementById("tr1");
    b = document.createElement("td");
    b.setAttribute("id", "row1_2");
    divTag.appendChild(b);
    divTag = document.getElementById("row1_2");
    b = document.createElement("div");
    b.setAttribute('id', 'musicVolumeDiv');
    divTag.appendChild(b);
    divTag = document.getElementById("musicVolumeDiv");
    b = document.createElement("table");
    b.setAttribute("id", "musicVolumeTable");
    b.setAttribute("rules", "rows");
    divTag.appendChild(b);
    divTag = document.getElementById("musicVolumeTable");
    b = document.createElement("tr");
    b.setAttribute("id", "musicVolumeTr");
    divTag.appendChild(b);
    divTag = document.getElementById("musicVolumeTr");
    for (var i = 0; i < 10; i++) {
        b = document.createElement("td");
        b.setAttribute("id", "musicVolumeTd" + i);
        divTag.appendChild(b);
        divTag = document.getElementById("musicVolumeTd" + i);
        b = document.createElement("div");
        if (i == 0) {
            b.setAttribute('class', 'musicVolumeInnerDiv');
            b.setAttribute('id', 'musicVolumeInnerDiv' + i);
        } else {
            b.setAttribute('class', 'musicVolumeInnerDivDefault');
            b.setAttribute('id', 'musicVolumeInnerDiv' + i);
        }
        divTag.appendChild(b);
        divTag = document.getElementById("musicVolumeTr");
    }

    divTag = document.getElementById("tr1");
    b = document.createElement("td");
    b.setAttribute("id", "row1_3");
    divTag.appendChild(b);
    divTag = document.getElementById("row1_3");
    b = document.createElement("input");
    b.setAttribute('type', 'button');
    b.setAttribute('id', 'volumeButtonSub');
    b.setAttribute('onclick', 'musicLevelUp()');
    b.setAttribute('value', '+');
    divTag.appendChild(b);

    /*調整遊戲速度*/
    divTag = document.getElementById("settingAllTable");
    b = document.createElement("tr");
    b.setAttribute("id", "tr2");
    divTag.appendChild(b);
    divTag = document.getElementById("tr2");
    b = document.createElement("td");
    b.setAttribute("id", "row2_0");
    divTag.appendChild(b);
    divTag = document.getElementById("row2_0");
    b = document.createElement("h2");
    b.setAttribute("id", "settingSpeed");
    divTag.appendChild(b);
    document.getElementById("settingSpeed").innerHTML = "遊戲速度";
    divTag = document.getElementById("tr2");
    b = document.createElement("td");
    b.setAttribute("id", "row2_1");
    b.setAttribute("colspan", "2");
    divTag.appendChild(b);
    divTag = document.getElementById("row2_1");
    b = document.createElement("form");
    b.setAttribute("id", "speedForm");
    b.setAttribute("name", "form2");
    divTag.appendChild(b);
    divTag = document.getElementById("speedForm");
    b = document.createElement("input");
    b.setAttribute("type", "checkbox");
    b.setAttribute("id", "speedLow");
    b.setAttribute("name", "c1");
    b.setAttribute("value", "1");
    b.setAttribute("onclick", "return chk2(this);");
    if(gameSpeed == 3){
      b.setAttribute("checked", "true");
    }
    divTag.appendChild(b);
    b = document.createElement("font");
    b.setAttribute("id", "speedLowText");
    divTag.appendChild(b);
    document.getElementById("speedLowText").innerHTML = "慢";
    b = document.createElement("input");
    b.setAttribute("type", "checkbox");
    b.setAttribute("id", "speedMid");
    b.setAttribute("name", "c1");
    b.setAttribute("value", "2");
    b.setAttribute("onclick", "return chk2(this);");
    if(gameSpeed == 5){
      b.setAttribute("checked", "true");
    }
    divTag.appendChild(b);
    b = document.createElement("font");
    b.setAttribute("id", "speedMidText");
    divTag.appendChild(b);
    document.getElementById("speedMidText").innerHTML = "中";
    b = document.createElement("input");
    b.setAttribute("type", "checkbox");
    b.setAttribute("id", "speedQuick");
    b.setAttribute("name", "c1");
    b.setAttribute("value", "3");
    b.setAttribute("onclick", "return chk2(this);");
    if(gameSpeed == 7){
      b.setAttribute("checked", "true");
    }
    divTag.appendChild(b);
    b = document.createElement("font");
    b.setAttribute("id", "speedQuickText");
    divTag.appendChild(b);
    document.getElementById("speedQuickText").innerHTML = "快";

    for(var i=0;i<musicLevel;i++){
      b = document.getElementById("musicVolumeInnerDiv" + i);
      b.className = "musicVolumeInnerDiv";
    }
}
function musicLevelUp() {
    b = document.getElementById("musicVolumeInnerDiv" + musicLevel);
    if (musicLevel <= 9) {
        b.className = "musicVolumeInnerDiv";
        musicLevel++;
    }
    if (musicLevel > 9) {
        musicLevel = 10;
    }
    myVid=document.getElementById("bkMusic");
    myVid.volume = --bkMusicSwitch * (musicLevel * bkMusicVolumn);
    //console.log("音量=" + bkMusicSwitch * (musicLevel * bkMusicVolumn));
    bkMusicSwitch++;
    sendSession();
}
function musicLevelDown() {
    if (musicLevel < 9) {
      b = document.getElementById("musicVolumeInnerDiv" + musicLevel);
      b.className = "musicVolumeInnerDivDefault";
      musicLevel--;
      if (musicLevel < 0) {
          musicLevel = 0;
      }
    } else if (musicLevel == 9) {
      b = document.getElementById("musicVolumeInnerDiv" + musicLevel);
      b.className = "musicVolumeInnerDivDefault";
      musicLevel--;
    }else if(musicLevel > 9){
      musicLevel--;
      b = document.getElementById("musicVolumeInnerDiv" + musicLevel);
      b.className = "musicVolumeInnerDivDefault";
    }
    myVid=document.getElementById("bkMusic");
    myVid.volume = --bkMusicSwitch * (musicLevel * bkMusicVolumn);
    bkMusicSwitch++;
    sendSession();
}

function chk(input) {

  for (var i = 0; i < document.form1.c1.length; i++) {
    document.form1.c1[i].checked = false;
  }
  input.checked = true;
  myVid=document.getElementById("bkMusic");
  if(input.id == "musicOpen"){
    bkMusicSwitch = 2;
  }else{
    bkMusicSwitch = 1;
  }
  myVid.volume = --bkMusicSwitch * (musicLevel * bkMusicVolumn);
  bkMusicSwitch++;
  sendSession();
  return true;
}
function chk2(input) {
    for (var i = 0; i < document.form2.c1.length; i++) {
        document.form2.c1[i].checked = false;
    }
    input.checked = true;
    if(input.id == "speedLow"){
      gameSpeed = 3;
    }else if(input.id == "speedMid"){
      gameSpeed = 5;
    }else if(input.id == "speedQuick"){
      gameSpeed = 7;
    }
    sendSession();
    return true;
}
function sendSession() {
  // console.log("bkMusicSwitch:" + bkMusicSwitch);
  // console.log("musicLevel:" + musicLevel);
  // console.log("bkMusicVolumn:" + bkMusicVolumn);
  //console.log("gameSpeed:" + gameSpeed);
  Session.set("bkMusicVolumn", bkMusicVolumn);
  Session.set("bkMusicSwitch", bkMusicSwitch);
  Session.set("musicLevel", musicLevel);
  Session.set("gameSpeed", gameSpeed);
  return ;
}

/*選擇可用函式*/
function selectFunc(levelNumber) {
  console.log(directiveData.instruction[levelNumber]);
  var classSize = directiveData.instruction[levelNumber].class.length, usableSize;
  var className, usableValue;
  var divString = "";
  divTag = document.getElementById("funcDiv");
  for (var i = 0; i < classSize; i++) {
    className = directiveData.instruction[levelNumber].class[i].name;
    usableSize = directiveData.instruction[levelNumber].class[i].usable.length;
    if (className == "函式") {
      divTag = document.getElementById("func");
      divString = "main(&nbsp)<br>";
      for (var j = 0; j < usableSize; j++) {
        usableValue = directiveData.instruction[levelNumber].class[i].usable[j].value;
        divString = divString + blocklyUsable(className, usableValue);
      }
    } else if (className == "動作") {
      document.getElementById("step").style.display = "";
      for (var j = 0; j < usableSize; j++) {
        divTag = document.getElementById("step");
        usableValue = directiveData.instruction[levelNumber].class[i].usable[j].value;
        divString = divString + blocklyUsable(className, usableValue);
      }
    } else if (className == "判斷式") {
      document.getElementById("judgment").style.display = "";
      for (var j = 0; j < usableSize; j++) {
        divTag = document.getElementById("judgment");
        usableValue = directiveData.instruction[levelNumber].class[i].usable[j].value;
        divString = divString + blocklyUsable(className, usableValue);
      }
    }
    divTag.innerHTML = divString;
    divString = "";
  }
}
function blocklyUsable(thisClassID, thisValue) {
  var blockType;
  switch (thisValue) {
    case "step":
      blockType = "step(&nbsp)<br>";
      break;
    case "turnRight":
      blockType = "turnRight(&nbsp)<br>";
      break;
    case "turnLeft":
      blockType = "turnLeft(&nbsp)<br>";
      break;
    case "fire":
      blockType = "fire(&nbsp)<br>";
      break;
    case "printf":
      blockType = "printf(&nbsp)<br>";
      break;
    case "var":
      blockType = " ";
      break;
    case "for":
      blockType = "for(&nbsp)<br>";
      break;
    case "function":
      blockType = "function&nbspX(&nbsp)<br>";
      break;
    case "call":
      blockType = " ";
      break;
    case "if":
      blockType = "if(&nbsp)<br>";
      break;
    case "if_else":
      blockType = "if(&nbsp)...else<br>";
      break;
    case "switch":
      blockType = "switch(&nbsp)<br>";
      break;
    case "switch":
      blockType = "switch(&nbsp)<br>";
      break;
    case "becameCar(&nbsp)":
      blockType = "becameCar(&nbsp)<br>";
      break;
    case "becameTank(&nbsp)":
      blockType = "becameTank(&nbsp)<br>";
      break;
    case "becameShip(&nbsp)":
      blockType = "becameShip(&nbsp)<br>";
      break;
    case "getKeyArray(&nbsp)":
      blockType = "getKeyArray(&nbsp)<br>";
      break;
    case "getDistance(&nbsp)":
      blockType = "getDistance(&nbsp)<br>";
      break;
    case "getKey(&nbsp)":
      blockType = "getKey(&nbsp)<br>";
      break;
    case "getBox(&nbsp)":
      blockType = "getBox(&nbsp)<br>";
      break;
    case "getString(&nbsp)":
      blockType = "getString(&nbsp)<br>";
      break;
    case "getKeyArray(&nbsp)":
      blockType = "getKeyArray(&nbsp)<br>";
      break;
    case "getKeyMap(&nbsp)":
      blockType = "getKeyMap(&nbsp)<br>";
      break;
  }
  return blockType;
}

/*遊戲結果*/
function createEndView(starNum,gameResult,instructionNum,code) {
  console.log(starNum,gameResult,instructionNum,code);

  divID = "createEndView";
  divID2 = "createEndBkView";
  divTag = document.getElementById("center");
  b = document.createElement("div");
  b.setAttribute("id", "createEndBkView");
  divTag.appendChild(b);
  b = document.createElement("div");
  b.setAttribute("id", "createEndView");
  divTag.appendChild(b);
  divTag = document.getElementById("createEndView");
  b = document.createElement("h1");
  b.setAttribute("id","endViewTitle");
  divTag.appendChild(b);
  // if(gameResult == "sucess"){
  //   document.getElementById("endViewTitle").innerHTML = "檢測成功";
  // }
  if(starNum>0){
    document.getElementById("endViewTitle").innerHTML = "檢測成功";
    console.log(mapID);
    b = document.createElement("input");
    b.setAttribute("type", "button");
    b.setAttribute("id", "backToMapBtn");
    b.setAttribute("class", "successBackBtn");
    b.setAttribute("value", "返回");
    b.setAttribute("onclick", "backToMapBtn();");
    divTag.appendChild(b);
    var scriptData = {
      type: "updateMapCheck",
      mapId:mapID
    }
    $.ajax({
      url: href,              // 要傳送的頁面
      method: 'POST',               // 使用 POST 方法傳送請求
      dataType: 'json',             // 回傳資料會是 json 格式
      data: scriptData,  // 將表單資料用打包起來送出去
      success: function (res) {
        console.log(res);
      }
    })

  }else{
    document.getElementById("endViewTitle").innerHTML = "檢測失敗";
    b = document.createElement("input");
    b.setAttribute("type", "button");
    b.setAttribute("id", "restartGameBtn");
    b.setAttribute("value", "重新挑戰");
    b.setAttribute("onclick", "clossFunc(\"createEndView\",\"createEndBkView\")");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("type", "button");
    b.setAttribute("id", "backToMapBtn");
    b.setAttribute("value", "返回");
    b.setAttribute("class", "failBackBtn");
    b.setAttribute("onclick", "backToMapBtn();");
    divTag.appendChild(b);
  }
}
function backToMapBtn() {
  // href = href.substr(0, index + 1) + "oblivion";
  var href = "/oblivionUser";
  window.location.replace(href);
}

/*loading*/
function createLoadingView() {
  divTag = document.getElementById("blocklyDiv");
  b = document.createElement("div");
  b.setAttribute("id", "loadingBkView");
  b.setAttribute("onclick", "clossFunc(\"loadingBkView\",\"loadingView\")");
  divTag.appendChild(b);
  b = document.createElement("div");
  b.setAttribute("id", "loadingView");
  b.setAttribute("class", "loadEffect");
  divTag.appendChild(b);
  divTag = document.getElementById("loadingView");
  for(var i=0;i<8;i++){
    b = document.createElement("span");
    divTag.appendChild(b);
  }
}

function closeLoadingView() {
  var divTag = document.getElementById("loadingView");
  try {
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
  } catch (e) {}
  var divTag = document.getElementById("loadingBkView");
  try {
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
  } catch (e) {}


}

/*textarea tab鍵*/
function insertAtCursor(myValue) {
  myField = document.getElementById("textarea_0");
  //IE support
  if (document.selection) {
    myField.focus();
    sel = document.selection.createRange();
    sel.text = myValue;
  }
  //MOZILLA and others
  else if (myField.selectionStart || myField.selectionStart == '0') {
    var startPos = myField.selectionStart;
    var endPos = myField.selectionEnd;
    myField.value = myField.value.substring(0, startPos)
      + myValue
      + myField.value.substring(endPos, myField.value.length);
    myField.selectionStart = startPos + myValue.length;
    myField.selectionEnd = startPos + myValue.length;
  } else {
    myField.value += myValue;
  }
}
document.getElementById('textarea_0').onkeydown = function (e) {
  if (e.keyCode == 9) {
    insertAtCursor('\t');
    return false;
  }
}

directiveData = {
  "instruction":[
    {
      "level":1,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            }
          ]
        }
      ]
    },
    {
      "level":2,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            }
          ]
        }
      ]
    },
    {
      "level":3,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            }
          ]
        }
      ]
    },
    {
      "level":4,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            }
          ]
        }
      ]
    },
    {
      "level":5,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            }
          ]
        }
      ]
    },
    {
      "level":6,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            }
          ]
        }
      ]
    },
    {
      "level":7,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"switch"
            }
          ]
        }
      ]
    },
    {
      "level":8,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            }
          ]
        }
      ]
    },
    {
      "level":9,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            }
          ]
        }
      ]
    },
    {
      "level":10,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            }
          ]
        }
      ]
    },
    {
      "level":11,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            }
          ]
        }
      ]
    },
    {
      "level":12,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            }
          ]
        }
      ]
    },
    {
      "level":13,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            },
            {
              "value":"fire"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            }
          ]
        }
      ]
    },
    {
      "level":14,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            },
            {
              "value":"fire"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            }
          ]
        }
      ]
    },
    {
      "level":15,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            },
            {
              "value":"fire"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            },
            {
              "value":"function"
            },
            {
              "value":"call"
            }
          ]
        }
      ]
    },
    {
      "level":16,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            },
            {
              "value":"fire"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            },
            {
              "value":"function"
            },
            {
              "value":"call"
            }
          ]
        }
      ]
    },
    {
      "level":17,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            },
            {
              "value":"fire"
            },
            {
              "value":"printf"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            },
            {
              "value":"function"
            },
            {
              "value":"call"
            }
          ]
        }
      ]
    },
    {
      "level":18,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            },
            {
              "value":"fire"
            },
            {
              "value":"printf"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            },
            {
              "value":"function"
            },
            {
              "value":"call"
            }
          ]
        }
      ]
    },
    {
      "level":19,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            },
            {
              "value":"fire"
            },
            {
              "value":"printf"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            },
            {
              "value":"function"
            },
            {
              "value":"call"
            }
          ]
        }
      ]
    },
    {
      "level":20,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            },
            {
              "value":"fire"
            },
            {
              "value":"printf"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            },
            {
              "value":"function"
            },
            {
              "value":"call"
            }
          ]
        }
      ]
    },
    {
      "level":21,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            },
            {
              "value":"fire"
            },
            {
              "value":"printf"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            },
            {
              "value":"function"
            },
            {
              "value":"call"
            }
          ]
        }
      ]
    },
    {
      "level":22,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            },
            {
              "value":"fire"
            },
            {
              "value":"printf"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            },
            {
              "value":"function"
            },
            {
              "value":"call"
            }
          ]
        }
      ]
    },
    {
      "level":23,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            },
            {
              "value":"fire"
            },
            {
              "value":"printf"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            },
            {
              "value":"function"
            },
            {
              "value":"call"
            }
          ]
        }
      ]
    },
    {
      "level":24,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            },
            {
              "value":"fire"
            },
            {
              "value":"printf"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            },
            {
              "value":"function"
            },
            {
              "value":"call"
            }
          ]
        }
      ]
    },
    {
      "level":25,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            },
            {
              "value":"fire"
            },
            {
              "value":"printf"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            },
            {
              "value":"function"
            },
            {
              "value":"call"
            }
          ]
        }
      ]
    },
    {
      "level":26,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            },
            {
              "value":"fire"
            },
            {
              "value":"printf"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            },
            {
              "value":"function"
            },
            {
              "value":"call"
            }
          ]
        }
      ]
    },
    {
      "level":27,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            },
            {
              "value":"fire"
            },
            {
              "value":"printf"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            },
            {
              "value":"function"
            },
            {
              "value":"call"
            },
            {
              "value":"becameCar(&nbsp)"
            },
            {
              "value":"becameTank(&nbsp)"
            },
            {
              "value":"becameShip(&nbsp)"
            }
          ]
        }
      ]
    },
    {
      "level":28,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            },
            {
              "value":"fire"
            },
            {
              "value":"printf"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            },
            {
              "value":"function"
            },
            {
              "value":"call"
            },
            {
              "value":"becameCar(&nbsp)"
            },
            {
              "value":"becameTank(&nbsp)"
            },
            {
              "value":"becameShip(&nbsp)"
            }
          ]
        }
      ]
    },
    {
      "level":29,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            },
            {
              "value":"fire"
            },
            {
              "value":"printf"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            },
            {
              "value":"function"
            },
            {
              "value":"call"
            },
            {
              "value":"becameCar(&nbsp)"
            },
            {
              "value":"becameTank(&nbsp)"
            },
            {
              "value":"becameShip(&nbsp)"
            }
          ]
        }
      ]
    },
    {
      "level":30,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            },
            {
              "value":"fire"
            },
            {
              "value":"printf"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            },
            {
              "value":"function"
            },
            {
              "value":"call"
            },
            {
              "value":"becameCar(&nbsp)"
            },
            {
              "value":"becameTank(&nbsp)"
            },
            {
              "value":"becameShip(&nbsp)"
            }
          ]
        }
      ]
    },
    {
      "level":31,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            },
            {
              "value":"fire"
            },
            {
              "value":"printf"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            },
            {
              "value":"function"
            },
            {
              "value":"call"
            },
            {
              "value":"becameCar(&nbsp)"
            },
            {
              "value":"becameTank(&nbsp)"
            },
            {
              "value":"becameShip(&nbsp)"
            }
          ]
        }
      ]
    },
    {
      "level":32,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            },
            {
              "value":"fire"
            },
            {
              "value":"printf"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            },
            {
              "value":"function"
            },
            {
              "value":"call"
            },
            {
              "value":"becameCar(&nbsp)"
            },
            {
              "value":"becameTank(&nbsp)"
            },
            {
              "value":"becameShip(&nbsp)"
            },
            {
              "value":"getKeyArray(&nbsp)"
            }
          ]
        }
      ]
    },
    {
      "level":33,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            },
            {
              "value":"fire"
            },
            {
              "value":"printf"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            },
            {
              "value":"function"
            },
            {
              "value":"call"
            },
            {
              "value":"becameCar(&nbsp)"
            },
            {
              "value":"becameTank(&nbsp)"
            },
            {
              "value":"becameShip(&nbsp)"
            },
            {
              "value":"getKeyArray(&nbsp)"
            },
            {
              "value":"getDistance(&nbsp)"
            }
          ]
        }
      ]
    },
    {
      "level":34,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            },
            {
              "value":"fire"
            },
            {
              "value":"printf"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            },
            {
              "value":"function"
            },
            {
              "value":"call"
            },
            {
              "value":"becameCar(&nbsp)"
            },
            {
              "value":"becameTank(&nbsp)"
            },
            {
              "value":"becameShip(&nbsp)"
            },
            {
              "value":"getKeyArray(&nbsp)"
            },
            {
              "value":"getDistance(&nbsp)"
            }
          ]
        }
      ]
    },
    {
      "level":35,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            },
            {
              "value":"fire"
            },
            {
              "value":"printf"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            },
            {
              "value":"function"
            },
            {
              "value":"call"
            },
            {
              "value":"becameCar(&nbsp)"
            },
            {
              "value":"becameTank(&nbsp)"
            },
            {
              "value":"becameShip(&nbsp)"
            },
            {
              "value":"getKeyArray(&nbsp)"
            },
            {
              "value":"getDistance(&nbsp)"
            }
          ]
        }
      ]
    },
    {
      "level":36,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            },
            {
              "value":"fire"
            },
            {
              "value":"printf"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            },
            {
              "value":"function"
            },
            {
              "value":"call"
            },
            {
              "value":"becameCar(&nbsp)"
            },
            {
              "value":"becameTank(&nbsp)"
            },
            {
              "value":"becameShip(&nbsp)"
            },
            {
              "value":"getKeyArray(&nbsp)"
            },
            {
              "value":"getDistance(&nbsp)"
            }
          ]
        }
      ]
    },
    {
      "level":37,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            },
            {
              "value":"fire"
            },
            {
              "value":"printf"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            },
            {
              "value":"function"
            },
            {
              "value":"call"
            },
            {
              "value":"becameCar(&nbsp)"
            },
            {
              "value":"becameTank(&nbsp)"
            },
            {
              "value":"becameShip(&nbsp)"
            },
            {
              "value":"getKeyArray(&nbsp)"
            },
            {
              "value":"getDistance(&nbsp)"
            },
            {
              "value":"getKey(&nbsp)"
            }
          ]
        }
      ]
    },
    {
      "level":38,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            },
            {
              "value":"fire"
            },
            {
              "value":"printf"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            },
            {
              "value":"function"
            },
            {
              "value":"call"
            },
            {
              "value":"becameCar(&nbsp)"
            },
            {
              "value":"becameTank(&nbsp)"
            },
            {
              "value":"becameShip(&nbsp)"
            },
            {
              "value":"getKeyArray(&nbsp)"
            },
            {
              "value":"getDistance(&nbsp)"
            },
            {
              "value":"getKey(&nbsp)"
            },
            {
              "value":"getBox(&nbsp)"
            }
          ]
        }
      ]
    },
    {
      "level":39,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            },
            {
              "value":"fire"
            },
            {
              "value":"printf"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            },
            {
              "value":"function"
            },
            {
              "value":"call"
            },
            {
              "value":"becameCar(&nbsp)"
            },
            {
              "value":"becameTank(&nbsp)"
            },
            {
              "value":"becameShip(&nbsp)"
            },
            {
              "value":"getKeyArray(&nbsp)"
            },
            {
              "value":"getDistance(&nbsp)"
            },
            {
              "value":"getKey(&nbsp)"
            },
            {
              "value":"getBox(&nbsp)"
            },
            {
              "value":"getString(&nbsp)"
            }
          ]
        }
      ]
    },
    {
      "level":40,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            },
            {
              "value":"fire"
            },
            {
              "value":"printf"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            },
            {
              "value":"function"
            },
            {
              "value":"call"
            },
            {
              "value":"becameCar(&nbsp)"
            },
            {
              "value":"becameTank(&nbsp)"
            },
            {
              "value":"becameShip(&nbsp)"
            },
            {
              "value":"getKeyArray(&nbsp)"
            },
            {
              "value":"getDistance(&nbsp)"
            },
            {
              "value":"getKey(&nbsp)"
            },
            {
              "value":"getBox(&nbsp)"
            },
            {
              "value":"getString(&nbsp)"
            }
          ]
        }
      ]
    },
    {
      "level":41,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            },
            {
              "value":"fire"
            },
            {
              "value":"printf"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            },
            {
              "value":"function"
            },
            {
              "value":"call"
            },
            {
              "value":"becameCar(&nbsp)"
            },
            {
              "value":"becameTank(&nbsp)"
            },
            {
              "value":"becameShip(&nbsp)"
            },
            {
              "value":"getKeyArray(&nbsp)"
            },
            {
              "value":"getDistance(&nbsp)"
            },
            {
              "value":"getKey(&nbsp)"
            },
            {
              "value":"getBox(&nbsp)"
            },
            {
              "value":"getString(&nbsp)"
            }
          ]
        }
      ]
    },
    {
      "level":42,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            },
            {
              "value":"fire"
            },
            {
              "value":"printf"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            },
            {
              "value":"function"
            },
            {
              "value":"call"
            },
            {
              "value":"becameCar(&nbsp)"
            },
            {
              "value":"becameTank(&nbsp)"
            },
            {
              "value":"becameShip(&nbsp)"
            },
            {
              "value":"getKeyArray(&nbsp)"
            },
            {
              "value":"getDistance(&nbsp)"
            },
            {
              "value":"getKey(&nbsp)"
            },
            {
              "value":"getBox(&nbsp)"
            },
            {
              "value":"getString(&nbsp)"
            },
            {
              "value":"getKeyArray(&nbsp)"
            }
          ]
        }
      ]
    },
    {
      "level":43,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            },
            {
              "value":"fire"
            },
            {
              "value":"printf"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            },
            {
              "value":"function"
            },
            {
              "value":"call"
            },
            {
              "value":"becameCar(&nbsp)"
            },
            {
              "value":"becameTank(&nbsp)"
            },
            {
              "value":"becameShip(&nbsp)"
            },
            {
              "value":"getKeyArray(&nbsp)"
            },
            {
              "value":"getDistance(&nbsp)"
            },
            {
              "value":"getKey(&nbsp)"
            },
            {
              "value":"getBox(&nbsp)"
            },
            {
              "value":"getString(&nbsp)"
            },
            {
              "value":"getKeyArray(&nbsp)"
            }
          ]
        }
      ]
    },
    {
      "level":44,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            },
            {
              "value":"fire"
            },
            {
              "value":"printf"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            },
            {
              "value":"function"
            },
            {
              "value":"call"
            },
            {
              "value":"becameCar(&nbsp)"
            },
            {
              "value":"becameTank(&nbsp)"
            },
            {
              "value":"becameShip(&nbsp)"
            },
            {
              "value":"getKeyArray(&nbsp)"
            },
            {
              "value":"getDistance(&nbsp)"
            },
            {
              "value":"getKey(&nbsp)"
            },
            {
              "value":"getBox(&nbsp)"
            },
            {
              "value":"getString(&nbsp)"
            },
            {
              "value":"getKeyArray(&nbsp)"
            },
            {
              "value":"getKeyMap(&nbsp)"
            }
          ]
        }
      ]
    },
    {
      "level":45,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            },
            {
              "value":"fire"
            },
            {
              "value":"printf"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            },
            {
              "value":"function"
            },
            {
              "value":"call"
            },
            {
              "value":"becameCar(&nbsp)"
            },
            {
              "value":"becameTank(&nbsp)"
            },
            {
              "value":"becameShip(&nbsp)"
            },
            {
              "value":"getKeyArray(&nbsp)"
            },
            {
              "value":"getDistance(&nbsp)"
            },
            {
              "value":"getKey(&nbsp)"
            },
            {
              "value":"getBox(&nbsp)"
            },
            {
              "value":"getString(&nbsp)"
            },
            {
              "value":"getKeyArray(&nbsp)"
            },
            {
              "value":"getKeyMap(&nbsp)"
            }
          ]
        }
      ]
    },
    {
      "level":46,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            },
            {
              "value":"fire"
            },
            {
              "value":"printf"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            },
            {
              "value":"function"
            },
            {
              "value":"call"
            },
            {
              "value":"becameCar(&nbsp)"
            },
            {
              "value":"becameTank(&nbsp)"
            },
            {
              "value":"becameShip(&nbsp)"
            },
            {
              "value":"getKeyArray(&nbsp)"
            },
            {
              "value":"getDistance(&nbsp)"
            },
            {
              "value":"getKey(&nbsp)"
            },
            {
              "value":"getBox(&nbsp)"
            },
            {
              "value":"getString(&nbsp)"
            },
            {
              "value":"getKeyArray(&nbsp)"
            },
            {
              "value":"getKeyMap(&nbsp)"
            }
          ]
        }
      ]
    },
    {
      "level":47,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            },
            {
              "value":"fire"
            },
            {
              "value":"printf"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            },
            {
              "value":"function"
            },
            {
              "value":"call"
            },
            {
              "value":"becameCar(&nbsp)"
            },
            {
              "value":"becameTank(&nbsp)"
            },
            {
              "value":"becameShip(&nbsp)"
            },
            {
              "value":"getKeyArray(&nbsp)"
            },
            {
              "value":"getDistance(&nbsp)"
            },
            {
              "value":"getKey(&nbsp)"
            },
            {
              "value":"getBox(&nbsp)"
            },
            {
              "value":"getString(&nbsp)"
            },
            {
              "value":"getKeyArray(&nbsp)"
            },
            {
              "value":"getKeyMap(&nbsp)"
            }
          ]
        }
      ]
    },
    {
      "level":48,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            },
            {
              "value":"fire"
            },
            {
              "value":"printf"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            },
            {
              "value":"function"
            },
            {
              "value":"call"
            },
            {
              "value":"becameCar(&nbsp)"
            },
            {
              "value":"becameTank(&nbsp)"
            },
            {
              "value":"becameShip(&nbsp)"
            },
            {
              "value":"getKeyArray(&nbsp)"
            },
            {
              "value":"getDistance(&nbsp)"
            },
            {
              "value":"getKey(&nbsp)"
            },
            {
              "value":"getBox(&nbsp)"
            },
            {
              "value":"getString(&nbsp)"
            },
            {
              "value":"getKeyArray(&nbsp)"
            },
            {
              "value":"getKeyMap(&nbsp)"
            }
          ]
        }
      ]
    },
    {
      "level":49,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            },
            {
              "value":"fire"
            },
            {
              "value":"printf"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            },
            {
              "value":"function"
            },
            {
              "value":"call"
            },
            {
              "value":"becameCar(&nbsp)"
            },
            {
              "value":"becameTank(&nbsp)"
            },
            {
              "value":"becameShip(&nbsp)"
            },
            {
              "value":"getKeyArray(&nbsp)"
            },
            {
              "value":"getDistance(&nbsp)"
            },
            {
              "value":"getKey(&nbsp)"
            },
            {
              "value":"getBox(&nbsp)"
            },
            {
              "value":"getString(&nbsp)"
            },
            {
              "value":"getKeyArray(&nbsp)"
            },
            {
              "value":"getKeyMap(&nbsp)"
            }
          ]
        }
      ]
    },
    {
      "level":50,
      "class":[
        {
          "name":"動作",
          "usable":[
            {
              "value":"step"
            },
            {
              "value":"turnRight"
            },
            {
              "value":"turnLeft"
            },
            {
              "value":"fire"
            },
            {
              "value":"printf"
            }
          ]
        },
        {
          "name":"判斷式",
          "usable":[
            {
              "value":"if"
            },
            {
              "value":"if_else"
            },
            {
              "value":"switch"
            }
          ]
        },
        {
          "name":"函式",
          "usable":[
            {
              "value":"for"
            },
            {
              "value":"function"
            },
            {
              "value":"call"
            },
            {
              "value":"becameCar(&nbsp)"
            },
            {
              "value":"becameTank(&nbsp)"
            },
            {
              "value":"becameShip(&nbsp)"
            },
            {
              "value":"getKeyArray(&nbsp)"
            },
            {
              "value":"getDistance(&nbsp)"
            },
            {
              "value":"getKey(&nbsp)"
            },
            {
              "value":"getBox(&nbsp)"
            },
            {
              "value":"getString(&nbsp)"
            },
            {
              "value":"getKeyArray(&nbsp)"
            },
            {
              "value":"getKeyMap(&nbsp)"
            }
          ]
        }
      ]
    }
  ]
};
