if (JSON && JSON.stringify && JSON.parse) var Session = Session || (function () {

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
    set: function (name, value) {
      store[name] = value;
    },

    // 列出指定的 session 資料
    get: function (name) {
      return (store[name] ? store[name] : undefined);
    },

    // 清除資料 ( session )
    clear: function () { store = {}; },

    // 列出所有存入的資料
    dump: function () { return JSON.stringify(store); }

  };

})();

var href = window.location.href;
var user, directiveData, thisLevelNum, mainDescription, levelDivAlive = true;
var swordLevel = 0, shieldLevel = 0, levelUpLevel = 0, musicLevel = 1, bkMusicSwitch, bkMusicVolumn = 0.1, args, gameSpeed;
var musicData;
var scriptData = {
  type: "init"
}
function back() {
  var index = 0;
  var href = window.location.href;
  for (var i = 0; i < href.length; ++i) {
      if (href[i] == '/' || href[i] == "\\") {
          index = i;
      }
  }
  href = href.substr(0, index + 1);
  let nowurl = new URL(window.location.href);
  let params = nowurl.searchParams;

  if (params.has('level')) {
    var thisLevelNum = params.get('level').toString();    // "react"
    console.log(thisLevelNum);
    if(parseInt(thisLevelNum)>23){
      href +="kuruma";
    }
    else{
      href +="pruss";
    }
  }
  window.location.replace(href);
  console.log(href);
}
$.ajax({
  url: href,              // 要傳送的頁面
  method: 'POST',               // 使用 POST 方法傳送請求
  dataType: 'json',             // 回傳資料會是 json 格式
  data: scriptData,  // 將表單資料用打包起來送出去
  success: function (res) {
    myVid = document.getElementById("bkMusic");
    myVid.volume = 0;
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
// var xmlhttp = new XMLHttpRequest();
// xmlhttp.onreadystatechange = function () {
//     if (this.readyState == 4 && this.status == 200) {
//         mainDescription = JSON.parse(this.responseText);
//         console.log(directiveData);
//         getArgs();
//         // getJson();
//     }
// };
// xmlhttp.open("GET", "json/mainDescription.json", true);
// xmlhttp.send();
function getJson() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
          directiveData = JSON.parse(this.responseText);
          console.log("2");
      }
  };
  xmlhttp.open("GET", "json/directive.json", true);
  xmlhttp.send();
}


function error() {
  alert("有不當的操作發生");
  window.location.replace(href);

}
function initHome() {
  if (Session.get("bkMusicVolumn") != null && Session.get("bkMusicSwitch") != null && Session.get("musicLevel") != null && Session.get("gameSpeed") != null) {
    bkMusicVolumn = Session.get("bkMusicVolumn");
    bkMusicSwitch = Session.get("bkMusicSwitch");
    musicLevel = Session.get("musicLevel");
    gameSpeed = Session.get("gameSpeed");
  } else {
    bkMusicVolumn = 0.1;
    bkMusicSwitch = 2;
    musicLevel = 1;
    gameSpeed = 5;
  }
  myVid = document.getElementById("bkMusic");
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
  getArgs();
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
function updateEasyTextLevel(starNum) {
  var scriptData = {
    type: "updateEasyTextLevel",
    starNum: starNum
  }
  $.ajax({
    url: href,              // 要傳送的頁面
    method: 'POST',               // 使用 POST 方法傳送請求
    dataType: 'json',             // 回傳資料會是 json 格式
    data: scriptData,  // 將表單資料用打包起來送出去
    success: function (res) {
      console.log(res);
      if (res.err) {
        error();
      }
      user = res;
    }
  })
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
    if (i == 0) {
      userdataFont = user.username;
    } else if (i == 1) {
      userdataFont = user.name;
    } else if (i == 2) {
      if (user.MediumEmpire.HighestLevel > user.EasyEmpire.codeHighestLevel || user.MediumEmpire.HighestLevel > user.EasyEmpire.blockHighestLevel) {
        userdataFont = "庫魯瑪帝國-第" + user.MediumEmpire.HighestLevel + "關";
      } else {
        if (user.EasyEmpire.codeHighestLevel > user.EasyEmpire.blockHighestLevel) {
          userdataFont = "普魯斯帝國-第" + user.EasyEmpire.codeHighestLevel + "關";
        } else {
          userdataFont = "普魯斯帝國-第" + user.EasyEmpire.blockHighestLevel + "關";
        }
      }
    } else if (i == 3) {
      userdataFont = "5/10";
    } else if (i == 4) {
      userdataFont = user.createMap.length;
    } else if (i == 5) {
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
  for (var i = 0; i < pairs.length; i++) {
    var pos = pairs[i].indexOf("=");
    if (pos == -1) continue;
    var argname = pairs[i].substring(0, pos);
    var value = pairs[i].substring(pos + 1);
    args[argname] = decodeURIComponent(value);
  }
  if (args.level) {
    selectFunc(args.level);
    divTag = document.getElementById("titleFont");
    divTag.innerHTML = "";
    divTag.innerHTML = "第&nbsp" + ++args.level + "&nbsp關";
    console.log(args.level);
    //changeCollege(--args.level);
    thisLevelNum = args.level-1;
    helper("blocklyDiv");
  }
}

/*小幫手*/
function helper(mainDiv) {
  console.log(mainDescription.oblivionObject[thisLevelNum].mode);
  var selectMod = mainDescription.oblivionObject[thisLevelNum].mode;
  divID = "equipageView";
  divTag = document.getElementById(mainDiv);
  console.log(divTag);
  if (levelDivAlive) {
    divTag = document.getElementById("helperView");
    try {
      parentObj = divTag.parentNode;
      parentObj.removeChild(divTag);
    } catch (e) { }
    levelDivAlive = false;
    divTag = document.getElementById(mainDiv);
  }
  b = document.createElement("div");
  b.setAttribute("id", "helperView");
  divTag.appendChild(b);
  levelDivAlive = true;
  divTag = document.getElementById("helperView");
  divTag.innerHTML = "";
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("id", "clossDiv");
  b.setAttribute("value", "X");
  b.setAttribute("onclick", "clossFunc(\"helperView\")");
  divTag.appendChild(b);
  b = document.createElement("h1");
  b.setAttribute("id", "allTitle");
  divTag.appendChild(b);
  document.getElementById("allTitle").innerHTML = "關卡說明";
  if (selectMod == 2) {
    b = document.createElement("div");
    b.setAttribute("id", "helperTextarea1");
    divTag.appendChild(b);
    /*設定文字塊一*/
    document.getElementById("helperTextarea1").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea1;

    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv1");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv1");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg1");
    b.setAttribute("class", "helperImg");
    b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img1);
    divTag.appendChild(b);

    divTag = document.getElementById("helperView");
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv2");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv2");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg2");
    b.setAttribute("class", "helperImg");
    b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img2);
    divTag.appendChild(b);

    divTag = document.getElementById("helperView");
    b = document.createElement("div");
    b.setAttribute("id", "helperTextarea2");
    divTag.appendChild(b);
    /*設定文字塊二*/
    document.getElementById("helperTextarea2").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea2;
  } else if (selectMod == 1) {
    divTag = document.getElementById("helperView");
    b = document.createElement("div");
    b.setAttribute("id", "helperTextarea3");
    divTag.appendChild(b);
    document.getElementById("helperTextarea3").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea1;
  }
}

/*XX按鈕*/
function clossFunc(thisDiv, thisDiv2) {
  var divTag = document.getElementById(thisDiv);
  try {
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
  } catch (e) { }
  divTag = document.getElementById(thisDiv2);
  try {
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
  } catch (e) { }
  levelDivAlive = false;
}
/*清除指令*/
function clearButton(thisTextarea) {
  document.getElementById(thisTextarea.id).value = "";
  clearcodeAndInit();
  challengeGameAgain();
}
/*清除畫布動作*/
function restartButton(thisTextarea) {
  challengeGameAgain();
}
/*重新開始*/
function restartGame(thisDiv, thisDiv2) {
  clossFunc(thisDiv, thisDiv2);
  // clearButton(document.getElementById("textarea_0"));
  // restartButton(document.getElementById("textarea_0"))
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
  if (bkMusicSwitch == 2) {
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
  if (bkMusicSwitch == 1) {
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
  if (gameSpeed == 3) {
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
  if (gameSpeed == 5) {
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
  if (gameSpeed == 7) {
    b.setAttribute("checked", "true");
  }
  divTag.appendChild(b);
  b = document.createElement("font");
  b.setAttribute("id", "speedQuickText");
  divTag.appendChild(b);
  document.getElementById("speedQuickText").innerHTML = "快";

  for (var i = 0; i < musicLevel; i++) {
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
  myVid = document.getElementById("bkMusic");
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
  } else if (musicLevel > 9) {
    musicLevel--;
    b = document.getElementById("musicVolumeInnerDiv" + musicLevel);
    b.className = "musicVolumeInnerDivDefault";
  }
  myVid = document.getElementById("bkMusic");
  myVid.volume = --bkMusicSwitch * (musicLevel * bkMusicVolumn);
  bkMusicSwitch++;
  sendSession();
}

function chk(input) {

  for (var i = 0; i < document.form1.c1.length; i++) {
    document.form1.c1[i].checked = false;
  }
  input.checked = true;
  myVid = document.getElementById("bkMusic");
  if (input.id == "musicOpen") {
    bkMusicSwitch = 2;
  } else {
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
  if (input.id == "speedLow") {
    gameSpeed = 3;
  } else if (input.id == "speedMid") {
    gameSpeed = 5;
  } else if (input.id == "speedQuick") {
    gameSpeed = 7;
  }
  sendSession();
  return true;
}
function sendSession() {
  //console.log("bkMusicSwitch:" + bkMusicSwitch);
  //console.log("musicLevel:" + musicLevel);
  //console.log("bkMusicVolumn:" + bkMusicVolumn);
  //console.log("gameSpeed:" + gameSpeed);
  Session.set("bkMusicVolumn", bkMusicVolumn);
  Session.set("bkMusicSwitch", bkMusicSwitch);
  Session.set("musicLevel", musicLevel);
  Session.set("gameSpeed", gameSpeed);
  return;
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
      blockType = "for(&nbsp){...}<br>";
      break;
    case "function":
      blockType = "function&nbspX(&nbsp){...}<br>";
      break;
    case "call":
      blockType = " ";
      break;
    case "if":
      blockType = "if(&nbsp){...}<br>";
      break;
    case "if_else":
      blockType = "if(&nbsp){...}else{...}<br>";
      break;
    case "switch":
      blockType = "switch(&nbsp){...}<br>";
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
function createEndView(starNum, gameResult, instructionNum, code) {
  // 儲存關卡//
  var empire="EasyEmpire";
  if(thisLevelNum>23){
    empire="MediumEmpire";
  }
  var scriptData = {
    type: "codeLevelResult",  //"codeLevelResult" or "blockLevelResult"限"EasyEmpire"
    Empire:empire,     //"EasyEmpire" or "MediumEmpire"
    level: thisLevelNum,                 // 0~24 or 25
    StarNum: starNum,               // 0 or 1 or 2 or 3
    result: gameResult,
    code:code,
    instructionNum:instructionNum
  }
  recordLevel(scriptData);
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
  b.setAttribute("id", "endViewTitle");
  divTag.appendChild(b);
  if (starNum != 0) {
    document.getElementById("endViewTitle").innerHTML = "通關成功";
    updateEasyTextLevel(starNum);
  } else {
    document.getElementById("endViewTitle").innerHTML = "通關失敗";
  }
  b = document.createElement("div");
  b.setAttribute("id", "startDiv");
  divTag.appendChild(b);
  divTag = document.getElementById("startDiv");
  for (var i = 0; i < 3; i++) {
    b = document.createElement("img");
    b.setAttribute("id", "starImg" + i);
    b.setAttribute("class", "unStarImg");
    divTag.appendChild(b);
  }
  if (starNum != 0) {
    for (var i = 0; i < starNum; i++) {
      document.getElementById("starImg" + i).className = "starImg";
    }
  }
  b = document.createElement("br");
  divTag.appendChild(b);
  b = document.createElement("h2");
  b.setAttribute("id", "instructionH2");
  divTag.appendChild(b);
  document.getElementById("instructionH2").innerHTML = "指令：" + "&nbsp&nbsp&nbsp&nbsp" + instructionNum + "&nbsp&nbsp&nbsp&nbsp個";
  b = document.createElement("h3");
  b.setAttribute("id", "instructionH3");
  divTag.appendChild(b);
  var highestStarNum;
  try {
    highestStarNum = user.EasyEmpire.codeLevel[thisLevelNum].HighestStarNum;
  } catch (e) {
    highestStarNum = 0;
  }
  if (starNum != 0) {
    if (highestStarNum < starNum) {
      document.getElementById("instructionH3").innerHTML = "(達成新紀錄!)";
    } else {
      document.getElementById("instructionH3").innerHTML = "";
    }
  } else {
    document.getElementById("instructionH3").innerHTML = "(" + gameResult + "!)";
  }
  if(starNum != 0){
    b = document.createElement("button");
    b.setAttribute("id", "restartGameBtn");
    b.setAttribute("value", "重新挑戰");
    b.setAttribute("onclick", "restartGame(\"createEndView\",\"createEndBkView\")");
    divTag.appendChild(b);
    divTag = document.getElementById("restartGameBtn");
    b = document.createElement("img");
    b.setAttribute("id", "restartImg");
    b.setAttribute("src", "img/restart.png");
    divTag.appendChild(b);
    b = document.createElement("font");
    b.setAttribute("id", "restartFontImg");
    divTag.appendChild(b);
    document.getElementById("restartFontImg").innerHTML = "重新開始";
    divTag = document.getElementById("startDiv");
    b = document.createElement("input");
    b.setAttribute("type", "button");
    b.setAttribute("id", "backToMapBtn");
    b.setAttribute("value", "返回地圖");
    b.setAttribute("onclick", "back()");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("type", "button");
    b.setAttribute("id", "nextLevelBtn");
    b.setAttribute("value", "下一關");
    console.log(thisLevelNum);
    b.setAttribute("onclick", "location.href='gameView_text?level=" + ++thisLevelNum + "'");
    divTag.appendChild(b);
  }else {
    b = document.createElement("input");
    b.setAttribute("type", "button");
    b.setAttribute("id", "successRestartGameBtn");
    b.setAttribute("value", "重新挑戰");
    b.setAttribute("onclick", "clossFunc(\"createEndView\",\"createEndBkView\")");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("type", "button");
    b.setAttribute("id", "successBackToMapBtn");
    b.setAttribute("value", "返回地圖");
    b.setAttribute("onclick", "back()");
    divTag.appendChild(b);
  }
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
  for (var i = 0; i < 8; i++) {
    b = document.createElement("span");
    divTag.appendChild(b);
  }
}

function closeLoadingView() {
  var divTag = document.getElementById("loadingView");
  try {
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
  } catch (e) { }
  var divTag = document.getElementById("loadingBkView");
  try {
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
  } catch (e) { }


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
  console.log(e.keyCode);
  if (e.keyCode == 9) {
    insertAtCursor('\t');
    return false;
  }else if(e.keyCode == 17){
    console.log("按壓ctrl");
  }
}

/*關卡說明*/
mainDescription = {
  "oblivionObject":[
    {
      "level": 1,
      "mode": 2,
      "textarea1": "哈囉！我是小幫手，將會幫助你通過重重難關。<br><br>目標：避開障礙物以正確的方向通過終點。",
      "textarea2": "請在左方程式區使用 code 編寫你的程式，編寫完成後，按下右上方的開始按鈕，車子就會照著指令行動。<br><br>程式區右上方按鈕名稱及功能依序為<br>開始－執行程式碼<br>刷新遊戲畫面－將遊戲畫面初始化<br>刷新指令及遊戲畫面－刷新指令區及遊戲畫面<br>設定－環境設定<br><br>在計算結果的指令個數時，step( )指令將會被列入計算。<br><br>範例：前進一步<br>int main(int argc, char *argv[ ])<br>{<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspstep( );<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspreturn 0;<br>}<br><br>過關條件：<br>3星：5個動作包含5個動作以內<br>2星：6個動作包含6個動作以內<br>1星：滿足通關條件即可",
      "img1": "level1img1.png",
      "img2": "level1img2.png"
    },
    {
      "level": 2,
      "mode": 2,
      "textarea1": "歡迎來到第二關！！<br>既然會前進了那該如何轉彎呢？<br>在這關出現了新指令：<br>右轉：turnRight();<br>左轉：turnLeft();<br>皆分類於\"動作\"內。",
      "textarea2": "請注意！轉向只有車子自轉唷。<br><br>小提示：直走一格右轉的動作指令為<br>step();<br>turnRight();<br>step();<br><br>過關條件：<br>3星：7個動作包含7個動作以內<br>2星：8個動作包含8個動作以內<br>1星：滿足過關條件即可",
      "img1": "level2img1.gif",
      "img2": "level2img2.gif"
    },
    {
      "level": 3,
      "mode": 1,
      "textarea1": "結合左轉和右轉來達到終點吧！<br><br>過關條件：<br>3星：9個動作包含9個動作以內<br>2星：10個動作包含10個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 4,
      "mode": 1,
      "textarea1": "相信已經熟悉了介面和操作了。<br>在這關新增了新物件<br>金幣：必須將所有金幣都得到才能夠通關。<br><br>小提示：若沒獲得金幣直接抵達終點的話也算是失敗喔！！<br><br>過關條件：<br>3星：9個動作包含9個動作以內且吃到金幣<br>2星：10個動作包含10個動作以內且吃到金幣<br>1星：滿足過關條件即可"
    },
    {
      "level": 5,
      "mode": 1,
      "textarea1": "新指令與新物件出現了！！<br>新指令：<br>printf( )指令，分類於\"動作\"內。<br>新物件：<br>藍色的鎖頭精靈。<br><br>還記得之前出現過的黃色的鎖頭精靈嗎？<br>沒錯！一樣要完成特殊條件鎖頭精靈才會讓你通過。<br><br>而想讓藍色的鎖頭精靈讓你通過的話，就必須答對他的問題。<br>那又該如何答題呢？<br><br>請使用新指令printf( )，這個指令的功用就是輸出字元、字串或是特定的參數值<br><br>範例：<br>printf(“Hi”)<br>//執行後，將會顯示字串 Hi <br><br>藍色鎖頭精靈的問題：<br>精靈希望你到他面前跟他說聲Hello。<br><br>小提示：必須到精靈的前一格回答才有效喔。<br><br>通關條件：<br>3星：5個動作含5個動作以內<br>2星：6個動作含6個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 6,
      "mode": 1,
      "textarea1": "新指令出現了！！<br>新指令：<br>scanf( )指令，分類於\"動作\"內。<br><br>在這一關想要答對鎖頭精靈的問題就必須獲得系統給予的特定值，並且將特定值加上變化才能找出問題的答案喔！！<br><br>請使用scanf( )指令，可由系統或是主控台輸入取得數值存至變數。<br>使用方法：<br>先宣告變數<br>scanf(\"欲獲取值的指定格式\",欲存值的變數);<br><br>範例：<br>int i=0;<br>scanf(\"%d\",&i);<br>//宣告一個變數 i，型態為 int，然後存取輸入的值於變數 i。<br><br>藍色鎖頭精靈的問題為：<br>請問系統給予的值加上地圖上出現的樹木數為多少？<br>請到鎖頭精靈面前說出你的答案吧！<br><br>通關條件：<br>3星：9個動作以及9個動作以內<br>2星：10個動作以及10個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 7,
      "mode": 1,
      "textarea1": "新物件與新指令出現了！！<br>新指令：<br>if( ){...} 指令，分類於\"判斷式\"內。<br>新物件：<br>問號標誌、問號石頭。<br><br>若在問號標誌十字範圍內有兩個有著紅色問號的石頭則：<br>問號標誌將在遊戲開始後隨機顯示：'L' or 'R'。<br>並且取得問號標誌值的參數預設為hint，在踩到問號標誌時 hint 參數的值才會變為'L' or 'R'。<br><br>if( ){...}為判斷式指令。<br>使用方法：<br>if(此處加入條件){<br>指定動作<br>}&nbsp&nbsp&nbsp&nbsp//若條件達成則執行指定動作。<br><br>範例：若問號標誌顯示為 R 則向右轉並且向前走一步。<br>if(hint == 'R'){<br>&nbsp&nbsp&nbsp&nbspturnRight( );<br>&nbsp&nbsp&nbsp&nbspstep( );<br>}&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp//若hint值等於 R，則向右轉並前進一格。<br><br>過關條件：<br>3星：5個動作包含5個動作以內<br>2星：6個動作包含6個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 8,
      "mode": 1,
      "textarea1": "新指令出現了！！<br>新指令：<br>if( ){…}else{…} 指令，分類於\"判斷式\"內。<br><br>在上一關學過了基本的判斷式if( )，<br>在這關新增了更進階的判斷式指令。<br><br>使用方法：<br>if(此處加入條件){<br>指定動作<br>}else{ <br>指定動作<br>}&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp//若達成條件則執行if( ){...}內指令，其他情況則執行else{...}內指令。<br><br>範例：<br>if(hint == 'R'){<br>&nbsp&nbsp&nbsp&nbspturnRight( );<br>&nbsp&nbsp&nbsp&nbspstep( );<br>}else{<br>&nbsp&nbsp&nbsp&nbsp&nbspturnLeft( );<br>&nbsp&nbsp&nbsp&nbspstep( );<br>}&nbsp&nbsp&nbsp&nbsp//若hint值等於 R，則向右轉並前進一格，其他情況則向左轉並前進一格。<br><br>過關條件：<br>3星：5個動作包含5個動作以內<br>2星：6個動作包含6個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 9,
      "mode": 1,
      "textarea1": "新指令出現了！！<br>新指令：<br>switch( ){...}指令，分類於\"判斷式\"內。<br><br>學過了if( ){...}和if(){...}else{...}，如果條件超過2種的話，該怎麼辦呢？<br>那就使用switch( ){...}吧！！<br><br>switch( ){...}是用來判斷多種條件的指令。<br>使用方法：<br>switch(條件參數){<br>&nbsp&nbsp&nbsp&nbspcase 條件參數的值:&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp指定動作&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbspbreak;&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<br>&nbsp&nbsp&nbsp&nbspcase 條件參數的值:<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp指定動作<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbspbreak;<br>&nbsp&nbsp&nbsp&nbspcase 條件參數的值:<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp指定動作<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbspbreak;<br>}&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp//由條件參數的值來判斷進入哪一個 case 做出指定動作，接著break跳出這個switch。<br><br>範例：<br>switch(hint){<br>&nbsp&nbsp&nbsp&nbspcase 'L':<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspturnLeft( );<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspbreak;<br>&nbsp&nbsp&nbsp&nbspcase 'F':<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspstep();<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspbreak;<br>&nbsp&nbsp&nbsp&nbspcase 'R':&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspturnRight( );<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspbreak;<br>}&nbsp&nbsp&nbsp&nbsp//若hint值為 L 則左轉然後跳出switch，若hint值為 F 則前進一步然後跳出switch，若hint值為 R 則右轉然後跳出switch。<br><br>請注意case 條件參數的值: ←此處為冒號':'。<br><br>過關條件：<br>3星：5個動作包含5個動作以內<br>2星：6個動作包含6個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 10,
      "mode": 1,
      "textarea1": "新指令出現了！！<br>新指令：<br>int 指令，分類於\"變數宣告\"內。<br>for( ){...}指令，分類於\"函式\"內。<br><br>是不是覺得走好幾步的時候，要打好幾個step( )很麻煩呢？<br>現在！我們可以使用for( ){...}指令來編寫重複的動作。<br><br>for( ){...}為迴圈指令，主要是將重複的動作寫在迴圈內，然後設定迴圈次數來簡化程式碼，並且要先宣告一個變數用來設定迴圈次數。<br><br>變數可宣告為多種形態：<br>型態&nbsp&nbsp&nbsp&nbsp&nbsp意思&nbsp&nbsp&nbsp&nbsp&nbsp範例<br>int&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp整數&nbsp&nbsp&nbsp&nbsp&nbsp100、-5、1246….<br>float&nbsp&nbsp&nbsp&nbsp&nbsp浮點數&nbsp&nbsp3.14159、4.6….<br>char&nbsp&nbsp&nbsp&nbsp&nbsp字元&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp'a'、'B'、'@'…<br>string&nbsp&nbsp&nbsp字串&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp\"hello\"、\"HAHA@_@\"…<br>bool&nbsp&nbsp&nbsp&nbsp&nbsp布林&nbsp&nbsp&nbsp&nbsp&nbsp&nbspTrue、false<br><br>使用方法：<br>先宣告變數<br>for(設變數值;設迴圈條件;迴圈結束後變數增減){<br>&nbsp&nbsp&nbsp&nbsp指定動作<br>}&nbsp&nbsp&nbsp&nbsp//宣告一個變數後，根據進入迴圈條件以及變數的變化來設定執行指定動作的次數。<br><br>範例：<br>int i=0;<br>for(i=5;i>0;i--){<br>&nbsp&nbsp&nbsp&nbspstep( );<br>}<br>turnLeft( );&nbsp&nbsp&nbsp&nbsp//宣告一個型態為 int 的變數 i 初始值為 0，迴圈開始前將 i 的值設為 5，且若 i>0 則進入迴圈，當單一次迴圈結束時 i 的值 -1 ，接著再次判斷是否符合 i>0的條件，若符合則再次進入迴圈，若不符合則跳過迴圈去執行左轉的動作。。<br><br>該段程式碼運行後將會使車子前進5步後向左轉。<br><br>迴圈是程式語言中非常重要的一個環節，大家要跟他打好關係唷！<br><br>過關條件：<br>3星：1個動作包含1個動作以內<br>2星：2個動作包含2個動作以內<br>1星：滿足過關條件即可"

    },
    {
      "level": 11,
      "mode": 1,
      "textarea1": "請將第八關所學會的迴圈指令與前進、左轉、右轉等動作指令結合來抵達終點吧！<br><br>過關條件：<br>3星：3個動作包含3個動作以內<br>2星：4個動作包含4個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 12,
      "mode": 1,
      "textarea1": "還記得金幣的作用吧！<br>請結合各指令獲得金幣然後通過終點。<br><br>小提示：右右右左右左。<br><br>過關條件：<br>3星：7個動作包含7個動作以內且吃到兩個金幣<br>2星：8個動作包含8個動作以內且吃到兩個金幣<br>1星：滿足過關條件即可"
    },
    {
      "level": 13,
      "mode": 1,
      "textarea1": "新物件出現了！！<br>新物件：黃色的鎖頭精靈。<br><br>通往終點的唯一道路被黃色的鎖頭精靈堵住了，那該如何才能解開呢？<br><br>看到那些黃色的箭頭了嗎？<br><br>沒錯！就是照著黃色箭頭的方向將全部箭頭踩過一遍，踩過的箭頭將會以變色來標示，全部箭頭都變色後鎖頭精靈才會放行。<br><br>小提示：迴圈指令很好用。<br><br>過關條件：<br>3星：6個動作包含6個動作以內<br>2星：7個動作包含7個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 14,
      "mode": 1,
      "textarea1": "找出規律來寫出最短的程式碼吧！<br><br>小提示：一個迴圈就搞定。<br><br>過關條件：<br>3星：4個動作包含4個動作以內<br>2星：5個動作包含5個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 15,
      "mode": 1,
      "textarea1": "新指令和新物件出現了！！！<br>新指令：<br>fire( )指令，分類於\"動作\"內。<br>新物件：<br>炸彈。<br><br>fire( )指令能夠使車子射出砲彈至前方兩格，而炮彈擊中炸彈時，炸彈將會爆炸，將十字範圍內的障礙物都清除乾淨。<br><br>請使用fire( ) + 炸彈的 combo 將障礙物清除乾淨抵達終點吧！<br><br>小提示：被炸彈炸到的話會直接失敗唷！<br><br>過關條件：<br>3星：2個動作包含2個動作以內<br>2星：3個動作包含3個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 16,
      "mode": 1,
      "textarea1": "這關看起來障礙重重呢！！<br>請使用fire( )結合其他指令抵達終點吧！<br><br>小提示：直走到底左轉。<br><br>過關條件：<br>3星：5個動作包含5個動作以內<br>2星：6個動作包含6個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 17,
      "mode": 1,
      "textarea1": "新指令出現了！！！<br>新指令：<br>void 函式名稱( ){...}指令，分類於\"函式\"內。<br><br>void 函式名稱( ){...}是用來自訂函式的指令，可自訂函式名稱和函式內容。<br><br>使用方法：<br>void 函式名稱( ){<br>&nbsp&nbsp&nbsp&nbsp自訂指令<br>}<br><br>自訂了一個函式後，又該如何使用它呢？<br>只要在main函式內直接打出函式名稱(函式需要的參數);就可以呼叫該函式<br><br>在自訂函式時，函式內的指令將被計算進結果指令個數，還有呼叫自訂函式也會被計算進結果指令個數<br><br>使用範例：<br>void gogogo( ){<br>&nbsp&nbsp&nbsp&nbspstep;<br>}<br>int main(int argc, char *argv[ ]){<br>int i=0;<br>for(i=3;i>0;i--){<br>&nbsp&nbsp&nbsp&nbspgogogo( );<br>&nbsp&nbsp}<br>return 0;<br>}&nbsp&nbsp&nbsp&nbsp//自訂一個函式gogogo，內容為前進一格，並且在main中使用迴圈呼叫了gogogo三次，最終結果將為車子前進三格。<br><br>以上這段程式碼於遊戲結果計算指令個數為2，1個是自訂函式時的step( )，1個是在迴圈中呼叫gogogo( )。<br><br>請使用下列程式碼完成此關卡：<br>int i=0;<br>for(i=5;i>0;i--){<br>&nbsp&nbsp&nbsp&nbspclear( );&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp請自訂clear函式<br>}<br><br>過關條件：<br>3星：5個動作包含5個動作以內<br>2星：6個動作包含6個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 18,
      "mode": 1,
      "textarea1": "自訂函式的應用千變萬化，請再自訂一個函式來通過關卡吧！！<br><br>請使用下列程式碼完成關卡：<br>int i=0;<br>for(i=3;i>0;i--){<br>&nbsp&nbsp&nbsp&nbspturnRight( );<br>&nbsp&nbsp&nbsp&nbspclear( );&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp//請自訂clear函式<br>}<br><br>通關條件：<br>3星：3個動作包含3個動作以內<br>2星：4個動作包含4個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 19,
      "mode": 1,
      "textarea1":"應該還記得各物件的作用吧！<br>驗收成果的時刻到了！<br>請結合教過的各指令抵達終點。<br><br>注意！！！地圖的大小已變為9 x 9。<br><br>鎖頭精靈的問題是：<br>int i = 0;<br>int sum = 0;<br>int x = 1;<br>for(i=10;i>0;i--){<br>&nbsp&nbsp&nbsp&nbspif(x == 1){<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspx = 2;<br>&nbsp&nbsp&nbsp&nbsp}else(x == 2){<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspx = 1;<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspsum++;<br>&nbsp&nbsp&nbsp&nbsp}<br>}<br>請問最後sum的值為多少？<br><br>小提示：直走到底再回頭然後左轉再左轉。<br><br>過關條件：<br>3星：12個動作包含12個動作以內<br>2星：14個動作包含14個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 20,
      "mode": 1,
      "textarea1": "運用你的智慧結合各指令抵達終點吧！<br><br>請將全部箭頭照著指示的方向踩過一遍來解開鎖頭精靈的阻礙。<br><br>小提示：直走到底右轉再右轉直走左轉再左轉。<br><br>過關條件：<br>3星：14個動作包含14個動作以內<br>2星：16個動作包含16個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 21,
      "mode": 1,
      "textarea1":"還記得判斷式的用法吧？<br>這可不能忘記啊！<br>請結合各指令抵達終點。<br><br>判斷式很重要！<br>判斷式很重要！<br>判斷式很重要！<br>因為很重要所以講三遍。<br><br>過關條件：<br>3星：39個動作包含39個動作以內<br>2星：41個動作包含41個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 22,
      "mode": 1,
      "textarea1": "當你走在充滿選擇的道路上，要做好準備面對每一種可能。<br><br>鎖頭精靈的問題：<br>int i=0;<br>int sum=0;<br>for(i=5;i>0;i--){<br>&nbsp&nbsp&nbsp&nbspif( i=3 ){<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspsum++;<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspi--;<br>&nbsp&nbsp&nbsp&nbsp}else{<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspsum = sum+2;<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspi = i-1;<br>&nbsp&nbsp&nbsp&nbsp}<br>}<br>小提示：如果有多種選擇的話switch是很棒的指令。<br><br>過關條件：<br>3星：19個動作包含19個動作以內<br>2星：22個動作包含22個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 23,
      "mode": 1,
      "textarea1":"請結合各指令抵達終點吧！<br><br>這路徑看起來好像有規律可循喔！？<br><br>小提示：如果有自訂函式會省下很多指令。<br><br>過關條件：<br>3星：9個動作包含9個動作以內<br>2星：11個動作包含11個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 24,
      "mode": 1,
      "textarea1": "通往終點的道路真是曲折啊！<br>請結合各指令抵達終點吧！<br><br>過關條件：<br>3星：12個動作包含12個動作以內<br>2星：14個動作包含14個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 25,
      "mode": 1,
      "textarea1": "注意！！有奇怪的戰車擋在路上，經過觀察似乎原本是被報廢的載具，但被神秘的病毒駭入後變為極具攻擊性的奇怪載具。<br><br>打不贏的話就去升級武器和護甲吧，達成一定星星數後便可升級。<br><br>可升級次數最高到15次，並且可以無限重置升級，請根據每一關的情況來配置升級點數。<br><br>上吧勇士！擊敗他通過終點！<br><br>小提示：你與神祕載具的攻擊範圍皆為兩格。<br><br>過關條件：<br>3星：3個動作包含3個動作以內<br>2星：4個動作包含4個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 26,
      "mode": 1,
      "textarea1": "出現了好多的神祕載具！！<br><br>請注意自己的血量，看起來沒有辦法正面交鋒。<br><br>找一條更好的路線吧！就算繞比較遠也沒關係。<br><br>過關條件：<br>3星：11個動作包含11個動作以內<br>2星：12個動作包含12個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 27,
      "mode": 1,
      "textarea1": "新指令出現了！！！<br>新指令：<br>becameCar( )：變成汽車<br>becameTank( )：變成坦克<br>becameShip( )：變成船<br>皆分類於\"函式\"內。<br><br>地形產生了變化！新增了地形設定。<br><br>在綠色的草地上需駕駛汽車。<br>在黃色的沙地上需駕駛坦克。<br>在藍色的海洋上需駕駛船。<br><br>當載具移動到不同的環境上時必須變形為該地形適用的載具，不然的話載具會無法移動。<br><br>過關條件：<br>3星：2個動作包含2個動作以內<br>2星：3個動作包含3個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 28,
      "mode": 1,
      "textarea1": "再多熟練一點載具之間的變形吧。記得沙地要變坦克，海洋要變船喔。<br><br>過關條件：<br>3星：6個動作包含6個動作以內<br>2星：7個動作包含7個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 29,
      "mode": 1,
      "textarea1": "好像可以正面擊敗神祕載具唷，好好分配一下裝備升級吧！<br><br>過關條件：<br>3星：8個動作包含8個動作以內<br>2星：9個動作包含9個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 30,
      "mode": 1,
      "textarea1": "還記得階梯形狀怎麼走嗎？<br><br>上面那台神祕載具看起來攻擊不到你，就不用去招惹它了。<br>請結合各指令抵達終點吧！<br><br>過關條件：<br>3星：17個動作包含17個動作以內<br>2星：18個動作包含18個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 31,
      "mode": 1,
      "textarea1": "新指令出現了！！！<br>新指令：<br>getKeyArray( )指令，分類於\"函式\"內。<br><br>出現了好多的神秘載具！<br>不過應該不會正面交鋒。<br><br>新增了對陣列的操作。<br><br>鎖頭精靈的問題：<br>請問密碼陣列中數值最大的為多少 ？<br><br>小提示：玩家需要自己宣告整數陣列，而陣列大小為6。<br>可以利用getKeyArray(陣列名稱,陣列大小);來獲得密碼陣列。<br><br>通關條件：<br>3星：18個動作包含18個動作以內<br>2星：19個動作包含19個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 32,
      "mode": 1,
      "textarea1": "這一關同樣要用密碼陣列來通關，不過對密碼陣列的操作變複雜了。<br><br>鎖頭精靈的問題：<br>請問密碼陣列中的數值由小到大排列長怎麼樣(數字與數字請用空白字元分割)？<br><br>小提示：<br>玩家需要自己宣告整數陣列，而陣列大小為6。<br>可以利用getKeyArray(陣列名稱,陣列大小);來獲得密碼陣列。<br>排序法可以參考氣泡排序法或選擇排序法。<br><br>通關條件：<br>3星：19個動作包含19個動作以內<br>2星：20個動作包含20個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 33,
      "mode": 1,
      "textarea1": "新指令出現了！！！<br>新指令：<br>getDistance( )指令，分類於\"函式\"內<br><br>遇到迷霧森林不用緊張，會找到通往出路的線索的。<br><br>這一關只要不斷的向右轉繞圈圈搭配距離陣列就能找到終點。<br><br>小提示：<br>請自行宣告一個大小為 6 的整數陣列。<br>並使用getDistance(陣列名稱,陣列大小);來獲得距離陣列，<br>距離陣列裡的值代表的是每段直線所要前進的步數。<br>如：陣列[0]代表第一段直線要走的步數。<br><br>每段直走搭配一次向右轉即可找到終點。<br><br>注意：進終點的路為直線，不用再轉彎。<br><br>通關條件：<br>3星：2個動作包含2個動作以內<br>2星：3個動作包含3個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 34,
      "mode": 1,
      "textarea1": "新指令出現了！！！<br>新指令：<br>getDirection( )指令，分類於\"函式\"內。<br><br>這一關能獲得的不是距離陣列而是方向陣列。<br>只要學會讀取方向陣列裡的方向，搭配每次直線走2步很快就能發現終點。<br><br>小提示：<br>請自行宣告一個大小為 12 的字元陣列，並使用getDirection(陣列名稱,陣列大小);來獲得方向陣列。<br><br>方向陣列裡的每個值代表的是每次轉彎所要轉的方向。<br>如：陣列[0]代表的是第一次要轉彎的方向，'L'代表的是左轉，'R'代表的是右轉。<br><br>每直走2步搭配一次轉彎即可找到終點。<br><br>注意：起始前方道路及進終點前的道路均為直線。<br><br>通關條件：<br>3星：3個動作包含3個動作以內<br>2星：4個動作包含4個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 35,
      "mode": 1,
      "textarea1": "這次不轉圈圈也不每次走2步了。<br><br>請利用方向陣列搭配距離陣列來找到終點。<br><br>小提示：<br>請自行宣告一個大小為 7 的字元陣列(方向陣列)與一個大小為 7 的整數陣列(距離陣列)。<br>利用getDistance(整數陣列,陣列大小)以及getDirection(字元陣列,陣列大小)來獲得距離陣列與方向陣列。<br><br>注意：載具的起始方向是錯誤的，請先用方向陣列修正方向。<br><br>通關條件：<br>3星：3個動作包含3個動作以內<br>2星：4個動作包含4個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 36,
      "mode": 1,
      "textarea1": "迷霧裡出現了敵人！！！<br>方向陣列裡出現了新的符號'F'，'F'代表的是開火的意思，也就是fire( )。<br><br>小提示：<br>請自行宣告一個大小為 17 的字元陣列(方向陣列)與一個大小為17的整數陣列(距離陣列)。<br><br>利用getDistance(整數陣列,陣列大小)以及getDirection(字元陣列,陣列大小)來獲得距離陣列與方向陣列。<br><br>注意：載具的起始方向是錯誤的，請先用方向陣列修正方向。<br><br>通關條件：<br>3星：4個動作包含4個動作以內<br>2星：5個動作包含5個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 37,
      "mode": 1,
      "textarea1": "新指令出現了！！！<br>新指令：<br>getKey()指令，分類於\"函式\"內。<br><br>暫時離開了迷霧森林，道路的盡頭出現了藍色鎖頭精靈。<br>需要利用getKey( )給予2個整數變數的位址，透過函式獲得的兩個整數值是密鑰的關鍵。<br><br>鎖頭精靈問題：<br>請問 2 個密鑰相加的值為多少？<br><br>小提示：請先宣告 2 個整數變數並將這 2 個變數的位址傳入getKey( )函式裡。<br>如：<br>int x,y;<br>getKey(&x,&y);<br>這樣即可將密鑰關鍵存至x,y。<br><br>在C語言裡可以透過&運算子來獲得變數的位址。<br>將兩個整數值填入x及y後即可進行運算。<br><br>通關條件：<br>3星：28個動作包含28個動作以內<br>2星：30個動作包含30個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 38,
      "mode": 1,
      "textarea1": "新物件與新指令出現了！！<br>新指令：<br>getBox( )指令，分類於\"函式\"內。<br>新物件：<br>寶箱<br><br>道路盡頭的鎖頭鑰匙碎片分散在各個寶箱中，請擊敗敵人打開所有寶箱後將碎片拼湊成完整的鑰匙，並利用鑰匙來通關。<br><br>鎖頭精靈問題：<br>請問寶箱內的字串依獲得的順序串接在一起長怎樣？<br><br>小提示：<br>字串就是以'\\0'字元結尾的字元陣列。<br>可以利用<br>#define SIZE 256<br>void main( ){<br>&nbsp&nbsp&nbsp&nbspchar str[SIZE];<br>}<br>的方式將字元陣列宣告成大小為256。<br><br>到達寶箱旁面對寶箱使用getBox(字元陣列名稱);來獲得字串內容，並且可以使用C語言string.h標頭檔裡的strcat(將被串接的字串目標,欲串接的字串來源)來將2個字串接在一起，範例如下：<br>char str[SIZE]=\"abc\";<br>char tmp[SIZE]=\"123\";<br>strcat(str,tmp);<br>printf(\"%s\",str);<br>這段程式碼的輸出：abc123<br><br>通關條件：<br>3星：48個動作包含48個動作以內<br>2星：50個動作包含50個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 39,
      "mode": 1,
      "textarea1": "新指令出現了！！<br>新指令：<br>getString( )指令，分類於\"函式\"內。<br><br>剛從迷霧森林逃出不久居然又闖進了另一個迷霧區。<br>在此玩家須透過getString( );來獲得路徑字串，並對路徑字串操作來找到終點。<br><br>小提示：字串就是以'\\0'字元結尾的字元陣列。<br>可以利用<br>#define SIZE 256<br>void main(){<br>&nbsp&nbsp&nbsp&nbspchar str[SIZE];<br>}<br>的方式將字元陣列宣告成大小為256。<br><br>在迷霧區裡玩家可以使用getString(字元陣列名稱);來獲得路徑字串的內容，並且可以使用C語言string.h標頭檔裡的strlen(字串名稱);來獲得字串的長度。<br>如：<br>int length=0;<br>char str[SIZE]=\"abc\";<br>length=strlen(str);<br>printf(\"%d\",length);<br>這段程式碼的輸出：3<br><br>路徑字串各字元所代表的動作：<br>'0'~'9'代表要前進的步數，對應指令step( )。<br>'L'代表向左轉，對應指令turnLeft( )。<br>'R'代表向右轉，對應指令turnRight( )。<br><br>只要照路徑字串裡的字元做相對應的動作就能找到終點<br><br>通關條件：<br>3星：3個動作包含3個動作以內<br>2星：4個動作包含4個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 40,
      "mode": 1,
      "textarea1": "在迷霧區出現了神祕載具！！！<br><br>在此玩家須透過getString( );來獲得動作字串，並對動作字串操作來擊斃敵人並找到終點。<br><br>小提示：<br>字串就是以'\\0'字元結尾的字元陣列<br>可以利用<br>#define SIZE 256<br>void main(){<br>&nbsp&nbsp&nbsp&nbspchar str[SIZE];<br>}<br>的方式將字元陣列宣告成大小為256。<br><br>在迷霧森林裡玩家可以使用getString(字元陣列名稱);來獲得路徑字串的內容，並且可以使用C語言string.h標頭檔裡的strlen(字串名稱);來獲得字串的長度。<br>範例：<br>int length=0;<br>char str[SIZE]=\"abc\";<br>length=strlen(str);<br>printf(\"%d\",length);<br>這段程式碼的輸出：3<br><br>路徑字串各字元所代表的動作：<br>'0'~'9'代表要前進的步數，對應指令step( )。<br>'L'代表向左轉，對應指令turnLeft( )。<br>'R'代表向右轉，對應指令turnRight( )。<br>'F'代表向前開火，對應指令fire( )。<br>只要照路徑字串裡的字元做相對應的動作就能找到終點。<br><br>通關條件：<br>3星：4個動作包含4個動作以內<br>2星：5個動作包含5個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 41,
      "mode": 1,
      "textarea1": "在迷霧區中出現了沙漠與河流！！！<br><br>在不知道地形的情況下看來只能依靠動作字串判斷地形了。<br><br>小提示：<br>字串就是以'\\0'字元結尾的字元陣列。<br>可以利用<br>#define SIZE 256<br>void main( ){<br>&nbsp&nbsp&nbsp&nbspchar str[SIZE];<br>}<br>的方式將字元陣列宣告成大小為256。<br><br>在迷霧森林裡玩家可以使用getString(字元陣列名稱);來獲得路徑字串的內容，並且可以使用C語言string.h標頭檔裡的strlen(字串名稱);來獲得字串的長度。<br>範例：<br>int length=0;<br>char str[SIZE]=\"abc\";<br>length=strlen(str);<br>printf(\"%d\",length);<br>這段程式碼的輸出：3<br><br>路徑字串各字元所代表的動作：<br>'0'~'9'代表要前進的步數，對應指令step( )。<br>'L'代表向左轉，對應指令turnLeft( )。<br>'R'代表向右轉，對應指令turnRight( )。<br>'F'代表向前開火，對應指令fire( )。<br>'C'代表當前地形為草地，對應指令becameCar( )。<br>'S'代表當前地形為海洋，對應指令becameShip( )。<br>'T'代表當前地形為沙地，對應指令becameTank( )。<br>只要照路徑字串裡的字元做相對應的動作就能找到終點。<br><br>通關條件：<br>3星：4個動作包含4個動作以內<br>2星：5個動作包含5個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 42,
      "mode": 1,
      "textarea1": "在迷霧森林的終點前出現了鎖頭，需要透過getKeyArray( );來獲得密碼陣列。<br><br>在路徑字串中'A'則表示要回答通關密碼。<br><br>藍色鎖頭精靈問題：<br>請問密碼陣列從小到大排列的結果長怎麼樣(數字與數字請用空白字元分割)？<br><br>小提示：<br>請先宣告一個大小為10的整數陣列並使用getKeyArray( )來獲得密碼陣列。<br><br>排序可以參考氣泡排序法或選擇排序法。<br><br>可以利用<br>#define SIZE 256<br>void main( ){<br>&nbsp&nbsp&nbsp&nbspchar str[SIZE];<br>}<br>的方式將字元陣列宣告成大小為256。<br>在迷霧森林裡玩家可以使用getString(字元陣列名稱);來獲得路徑字串的內容，並且可以使用C語言string.h標頭檔裡的strlen(字串名稱);來獲得字串的長度。<br>範例：<br>int length=0;<br>char str[SIZE]=\"abc\";<br>length=strlen(str);<br>printf(\"%d\",length);<br>這段程式碼的輸出：3<br><br>路徑字串各字元所代表的動作：<br>'0'~'9'代表要往前走的步數，對應指令step( )。<br>'L'代表向左轉，對應指令turnLeft( )。<br>'R'代表向右轉，對應指令turnRight( )。<br>'F'代表向前開火，對應指令fire( )。<br>'C'代表當前地形為草地，對應指令becameCar( )。<br>'S'代表當前地形為海洋，對應指令becameShip( )。<br>'T'代表當前地形為沙地，對應指令becameTank( )。<br>'A'代表遇到鎖頭需輸出答案，對應指令printf( )。<br>只要照路徑字串裡的字元做相對應的動作就能找到終點。<br><br>通關條件：<br>3星：4個動作包含4個動作以內<br>2星：5個動作包含5個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 43,
      "mode": 1,
      "textarea1": "這一關與四十二關相似，但是藍色鎖頭精靈的問題好像不一樣了，記得看仔細鎖頭精靈的題目喔！！<br><br>鎖頭精靈問題：<br>請問密碼陣列中所有奇數值從小到大排序的結果長怎樣(數字與數字請用空白字元分割)？<br><br>小提示：<br>請先宣告一個大小為10的整數陣列並使用getKeyArray( )來獲得密碼陣列。<br>排序可以參考氣泡排序法或選擇排序法。<br><br>所有奇數值從小到大排列可以看成先排列再針對奇數值做輸出。<br>可以利用<br>#define SIZE 256<br>void main( ){<br>&nbsp&nbsp&nbsp&nbspchar str[SIZE];<br>}<br>的方式將字元陣列宣告成大小為256。<br>在迷霧森林裡玩家可以使用getString(字元陣列名稱);來獲得路徑字串的內容，並且可以使用C語言string.h標頭檔裡的strlen(字串名稱);，來獲得字串的長度，如：<br>int length=0;<br>char str[SIZE]=\"abc\";<br>length=strlen(str);<br>printf(\"%d\",length);<br>這段程式碼的輸出：3<br><br>路徑字串各字元所代表的動作：<br>'0'~'9'代表要往前走的步數，對應指令step( )。<br>'L'代表向左轉，對應指令turnLeft( )。<br>'R'代表向右轉，對應指令turnRight( )。<br>'F'代表向前開火，對應指令fire( )。<br>'C'代表當前地形為草地，對應指令becameCar( )。<br>'S'代表當前地形為海洋，對應指令becameShip( )。<br>'T'代表當前地形為沙地，對應指令becameTank( )。<br>'A'代表遇到鎖頭需輸出答案，對應指令printf( )。<br>只要照路徑字串裡的字元做相對應的動作就能找到終點。<br><br>通關條件：<br>3星：4個動作包含4個動作以內<br>2星：5個動作包含5個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 44,
      "mode": 1,
      "textarea1": "新指令出現了！！<br>新指令：<br>getMap( )指令，分類於\"函式\"內。<br><br>在迷霧區完全不知道方向的情況下只能透過getMap( );來獲得泛黃的地圖，地圖上記載著由二維陣列組成的數字地圖，玩家需透過讀取地圖的內容來找出通往終點的路。<br><br>小提示：<br>請先宣告一個9*9的二維整數陣列，並用getMap(陣列名稱,地圖的長度格數);來獲得地圖陣列。<br>地圖陣列裡每一格代表的是對應到地圖上該格的地形。<br>玩家的初始位置為[0][0]即地圖左上方。<br>地圖陣列中數字0代表的是障礙物。<br>數字1則代表著草地。<br>數字4則代表著終點。<br><br>通關條件：<br>3星：20個動作包含20個動作以內<br>2星：22個動作包含22個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 45,
      "mode": 1,
      "textarea1": "在迷霧區中完全不知道方向的情況下只能透過getMap( );來獲得泛黃的地圖。<br>地圖上記載著由二維陣列組成的數字地圖，玩家需透過讀取地圖的內容來找出通往終點的路。<br>在地圖陣列上出現了新的符號！！<br><br>小提示：<br>請先宣告一個9*9的二維整數陣列，並用getMap(陣列名稱,地圖的長度格數);來獲得地圖陣列。<br><br>地圖陣列裡每一格代表的是對應到地圖上該格的地形。<br>玩家的初始位置為[0][0]即地圖左上方第一格。<br><br>而地圖上數字0代表的是障礙物。<br>數字1則代表著草地。<br>數字2則代表著海洋。<br>數字3則代表著沙地。<br>數字4則代表著終點。<br><br>通關條件：<br>3星：20個動作包含20個動作以內<br>2星：22個動作包含22個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 46,
      "mode": 1,
      "textarea1": "進入了新大陸，地圖好像變更大了，敵人的防守也變得嚴密。<br>從敵人身上獲得了通關的程式碼，但是不知道程式碼的真偽。<br><br>請玩家檢查獲得的程式碼找出有漏洞的地方並加以修正來解出真正的通關方法。<br><br>藍色鎖頭精靈問題：<br>請問getKey( )指令所獲得的2個值相加為多少？<br><br>小提示：系統所給予的程式碼並非完全正確，請依照關卡要求修改成正確的程式碼。<br><br>通關條件：<br>3星：55個動作包含55個動作以內<br>2星：58個動作包含58個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 47,
      "mode": 1,
      "textarea1": "一次、兩次、三次、四次、五次...<br>數的頭好暈阿！！<br>這一關鎖頭精靈的問題讓人頭好痛，你能找出正確的答案嗎？<br><br>鎖頭精靈問題：<br>請問字串key在getString( )函式獲得的字串中出現幾次？<br><br>小提示：請自行宣告一個空間夠大的字元陣列，並使用getString(陣列名稱)來獲得字串內容，搭配C語言string.h標頭檔裡的strlen(字串名稱);來獲得字串長度。<br><br>可利用迴圈搭配字串長度來找出key出現在獲得的字串裡總共幾次。<br><br>通關條件：<br>3星：53個動作包含53個動作以內<br>2星：56個動作包含56個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 48,
      "mode": 1,
      "textarea1": "撿到了一塊古代石板！！<br>石板上刻著古老的文字，請研究如何將石板上的文字轉換成正確的值。<br><br>鎖頭精靈問題：<br>請問石板上的2個數字相加為多少？<br><br>小提示：請宣告兩個空間夠大的陣列來接取石板上的文字。<br>玩家須透過getString( );來獲得石板上(字串)內容，字串中有2個數字，長度均小於5，以空白字元分割。<br><br>請將字串的值轉換成整數值並相加來獲得鎖頭精靈問題的答案。<br><br>通關條件：<br>3星：73個動作包含73個動作以內<br>2星：76個動作包含76個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 49,
      "mode": 1,
      "textarea1": "石板上的突然出現了一大片汙漬，怎麼擦也擦不掉！<br>請想辦法把汙漬從石板上去除。<br><br>鎖頭精靈問題：<br>請問石板上的數字去除掉y的值以後為多少？<br><br>小提示：<br>關卡有2個長度分別不小於20以及不超過5的數值，並且分別以字串變數與整數變數給予，須透過getString( )來獲得字串以及變數y來獲得整數。<br><br>玩家需將字串轉成數值後，將2個數字相減做輸出才能解開鎖頭。<br><br>當數值大到整數型態的變數放不下時，可以將每個位元的值拆開個別放在整數陣列的每一格。<br>範例：<br>數字59487<br>可以拆成5,9,4,8,7放在整數陣列裡。<br>int arr[5]={5,9,4,8,7};<br>並且針對y的每個位元拆開進行減法來獲得結果。<br><br>注意：大整數運算減法時，要注意借位的問題！<br><br>通關條件：<br>3星：68個動作包含68個動作以內<br>2星：71個動作包含71個動作以內<br>1星：滿足過關條件即可"
    },
    {
      "level": 50,
      "mode": 1,
      "textarea1": "又撿到了另一塊石板！！<br>石板上的文字長到數不清有幾個字了。<br><br>請將這一塊石板上的文字轉換成看得懂的數值，然後操作獲得的數值來找出鎖頭精靈問題的答案。<br><br>鎖頭精靈問題：<br>請問石板上兩個大整數相加的結果為多少？<br><br>小提示：<br>關卡有1個字串，其中包含2個長度不小於20的數值，以空白字元分割，需用getString( );來獲取字串。<br><br>玩家需將字串轉成一般數值後將2個數字相加做輸出才能解開鎖頭。<br><br>當數值大到整數型態的變數放不下時，可以將每個位元的值拆開個別放在整數陣列的每一格。<br>範例：<br>數字59487<br>可以拆成5,9,4,8,7放在整數陣列裡。<br>int arr[5]={5,9,4,8,7};<br><br>將兩個數字從字串分割下來以後轉換成一般數值，並且將兩個數值相加就是鎖頭精靈問題的答案。<br><br>注意：大整數運算加法時，要注意進位的問題！<br><br>通關條件：<br>3星：97個動作包含97個動作以內<br>2星：100個動作包含100個動作以內<br>1星：滿足過關條件即可"
    }
  ]
}

/*可用函式*/
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
