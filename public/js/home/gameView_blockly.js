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
var user, directiveData, levelDivAlive = true;
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
  href += "pruss";
  window.location.replace(href);
  console.log(href);
}


$.ajax({
  url: href,              // 要傳送的頁面
  method: 'POST',               // 使用 POST 方法傳送請求
  dataType: 'json',             // 回傳資料會是 json 格式
  data: scriptData,  // 將表單資料用打包起來送出去
  success: function (res) {
    // console.log(res);
    user = res;

    let nowurl = new URL(window.location.href);
    let params = nowurl.searchParams;
    if (!params.has('level')) {
        href = "";
        window.location.replace(href);
    }
    var maplevelId =  params.get('level');
    console.log(maplevelId);
    console.log(user.EasyEmpire.codeLevel.length);
    if (maplevelId < 24) {
      if (user.EasyEmpire.codeLevel.length < maplevelId) {
        console.log("Bye 實力不夠");
        alert("不能越級過關喔");
        href = "pruss";
        window.location.replace(href);
      }
    }
    else {
      if (user.MediumEmpire.codeLevel.length < maplevelId) {
        console.log("Bye 實力不夠");
        alert("不能越級過關喔");
        href = "kuruma";
        window.location.replace(href);
      }
      else if (user.EasyEmpire.codeLevel.length < 24||(user.EasyEmpire.codeLevel.length>=23&&user.EasyEmpire.codeLevel[23].HighestStarNum < 1)) {
        console.log("Bye 實力不夠");
        alert("不能越級過關喔");
        href = "pruss";
        window.location.replace(href);
      }
    }

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
// function getJson() {
//   var xmlhttp = new XMLHttpRequest();
//   xmlhttp.onreadystatechange = function () {
//       if (this.readyState == 4 && this.status == 200) {
//           directiveData = JSON.parse(this.responseText);
//           console.log("2");
//           getArgs();
//       }
//   };
//   xmlhttp.open("GET", "json/directive.json", true);
//   xmlhttp.send();
// }

function error() {
  alert("有不當的操作發生");
  window.location.replace(href);

}
function initHome() {
  if (Session.get("bkMusicVolumn") != null && Session.get("bkMusicSwitch") != null && Session.get("musicLevel") != null && Session.get("gameSpeed") != null) {
    //console.log("???");
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

//////////////////////////////////////////////////
//              right.js                        //
//////////////////////////////////////////////////

var myVid;
var divID, divID2, divTag, b;
var userdataFont, thisLevelNum;
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
  b.setAttribute("id", "userTitle");
  divTag.appendChild(b);
  document.getElementById("userTitle").innerHTML = "個人資料";
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
      userdataFont = Session.get("getAchievement") + "/9";
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
  console.log("3");
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
    //changeCollege(--args.level);
    thisLevelNum = args.level - 1;
    helper("blocklyDiv");
  }
  return;
}

/*小幫手*/
function helper(mainDiv) {
  console.log(mainDiv);
  var selectMod = mainDescription.oblivionObject[thisLevelNum].mode;
  divID = "equipageView";
  divTag = document.getElementById(mainDiv);
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

/*清除畫布動作*/
function clearButton(thisTextarea) {
  challengeGameAgain();
}
/*重新開始*/
function restartButton(thisTextarea) {
  challengeGameAgain();
  myFunction();
}
/*重新開始*/
function restartGame(thisDiv, thisDiv2) {
  clossFunc(thisDiv, thisDiv2);
  // myFunction();
  // restartButton();
}

/*轉換程式碼*/
function transformButton() {
  changeToC(1);
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
  // console.log("bkMusicSwitch:" + bkMusicSwitch);
  // console.log("musicLevel:" + musicLevel);
  // console.log("bkMusicVolumn:" + bkMusicVolumn);
  //console.log("gameSpeed:" + gameSpeed);
  Session.set("bkMusicVolumn", bkMusicVolumn);
  Session.set("bkMusicSwitch", bkMusicSwitch);
  Session.set("musicLevel", musicLevel);
  Session.set("gameSpeed", gameSpeed);
  return;
}

/*選擇可用函式*/
function selectFunc(levelNumber) {
  /*divTag = document.getElementById("bodyId");
  b = document.createElement("script");
  divTag.appendChild(b);*/
  var classSize = directiveData.instruction[levelNumber].class.length, usableSize;
  var className, usableValue;
  divTag = document.getElementById("toolbox");
  for (var i = 0; i < classSize; i++) {
    className = directiveData.instruction[levelNumber].class[i].name;
    usableSize = directiveData.instruction[levelNumber].class[i].usable.length;

    if (className != "函式") {
      b = document.createElement("category");
      b.setAttribute("id", className);
      b.setAttribute("name", className);
      divTag.appendChild(b);
      for (var j = 0; j < usableSize; j++) {
        usableValue = directiveData.instruction[levelNumber].class[i].usable[j].value;
        blocklyUsable(className, usableValue)
      }
    } else {
      for (var j = 0; j < usableSize; j++) {
        usableValue = directiveData.instruction[levelNumber].class[i].usable[j].value;
        blocklyUsable(className, usableValue)
      }
    }
    divTag = document.getElementById("toolbox");
  }
  divTag = document.getElementById("bodyId");
  b = document.createElement("script");
  b.setAttribute("src", "gameNew/gameNew/js/code.js");
  divTag.appendChild(b);
}
function blocklyUsable(thisClassID, thisValue) {
  var blockType;
  switch (thisValue) {
    case "step":
      blockType = "block_step";
      break;
    case "turnRight":
      blockType = "block_turn_right";
      break;
    case "turnLeft":
      blockType = "block_turn_left";
      break;
    case "fire":
      blockType = "block_fire";
      break;
    case "printf":
      blockType = "block_printf";
      break;
    case "scanf":
      blockType = "block_scanf";
      break;
    case "var":
      blockType = "block_var";
      break;
    case "for":
      blockType = "block_loop";
      break;
    case "function":
      blockType = "block_function";
      break;
    case "call":
      blockType = "block_call";
      break;
    case "if":
      blockType = "block_if";
      break;
    case "if_else":
      blockType = "block_if_else";
      break;
    case "switch":
      blockType = "block_switch";
      break;
    case "case":
      blockType = "block_case";
      break;
    case "default":
      blockType = "block_default";
      break;
    case "break":
      blockType = "block_break";
      break;
  }
  divTag = document.getElementById(thisClassID);
  b = document.createElement("block");
  b.setAttribute("type", blockType);
  divTag.appendChild(b);
  if (blockType == "block_switch") {
    blocklyUsable(thisClassID, "case");
  } else if (blockType == "block_case") {
    blocklyUsable(thisClassID, "default");
  } else if (blockType == "block_default") {
    blocklyUsable(thisClassID, "break");
  }
  if (blockType == "block_loop") {
    blocklyUsable(thisClassID, "var");
  }
}

/*遊戲結果*/
function createEndView(starNum, gameResult, instructionNum, code) {
  // 儲存關卡//
  var scriptData = {
    type: "blockLevelResult",  //"codeLevelResult" or "blockLevelResult"限"EasyEmpire"
    Empire: "EasyEmpire",     //"EasyEmpire" or "MediumEmpire"
    level: thisLevelNum,                 // 0~24 or 25
    StarNum: starNum,               // 0 or 1 or 2 or 3
    result: gameResult,
    code: code,
    instructionNum: instructionNum
  }
  recordLevel(scriptData);
  console.log(starNum);
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
    highestStarNum = user.EasyEmpire.blockLevel[thisLevelNum].HighestStarNum;
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
  if (starNum != 0) {
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
    b.setAttribute("onclick", "location.href='pruss'");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("type", "button");
    b.setAttribute("id", "nextLevelBtn");
    b.setAttribute("value", "下一關");
    console.log(thisLevelNum);
    b.setAttribute("onclick", "location.href='gameView_text?level=" + ++thisLevelNum + "'");
    divTag.appendChild(b);
  } else {
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
    b.setAttribute("onclick", "location.href='pruss'");
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

/*關卡說明*/
mainDescription = {
  "oblivionObject": [
    {
      "level": 1,
      "mode": 2,
      "textarea1": "哈囉！我是小幫手，將會幫助你通過重重難關。<br><br>目標：避開障礙物以正確的方向通過終點。",
      "textarea2": "請在左方程式區使用指令積木組裝你的程式，組裝完成後，按下右上方的開始按鈕，車子就會照著指令行動。<br><br>編寫程式區右上方按鈕名稱及功能依序為<br>開始－執行程式碼<br>轉譯－將積木轉成code顯示於視窗<br>重置地圖－將遊戲畫面初始化<br>重置關卡－刷新指令區及遊戲畫面<br>設定－環境設定<br><br>在計算結果的指令個數時，step( )指令將會被列入計算。<br>小提示：前進一步為拉一塊step積木至Main積木中。<br><br>過關條件：<br>3星：5個動作包含5個動作以內<br>2星：6個動作包含6個動作以內<br>1星：滿足通關條件即可<br><br>Ctrl鍵加方向鍵上下可以調整程式區字體大小唷！",
      "img1": "level1img1.png",
      "img2": "level1img2.png"
    },
    {
      "level": 2,
      "mode": 2,
      "textarea1": "歡迎來到第二關！！<br>既然會前進了那該如何轉彎呢？<br>在這關出現了新指令：<br>右轉：turnRight()<br>左轉：turnLeft();<br>皆分類於'動作'內。",
      "textarea2": "請注意！轉向只有車子自轉唷。<br><br>小提示：直走一格右轉的動作指令為<br>step( );<br>turnRight( );<br>step( );<br><br>過關條件：<br>3星：7個動作包含7個動作以內<br>2星：8個動作包含8個動作以內<br>1星：滿足過關條件即可<br><br>Ctrl鍵加方向鍵上下可以調整程式區字體大小唷！",
      "img1": "level2img1.gif",
      "img2": "level2img2.gif"
    },
    {
      "level": 3,
      "mode": 1,
      "textarea1": "結合左轉和右轉來達到終點吧！<br><br>過關條件：<br>3星：9個動作包含9個動作以內<br>2星：10個動作包含10個動作以內<br>1星：滿足過關條件即可<br><br>Ctrl鍵加方向鍵上下可以調整程式區字體大小唷！"
    },
    {
      "level": 4,
      "mode": 1,
      "textarea1": "相信已經熟悉了介面和操作了。<br>在這關新增了新物件<br>金幣：必須將所有金幣都得到才能夠通關。<br><br>小提示：若沒獲得金幣直接抵達終點的話也算是失敗喔！！<br><br>過關條件：<br>3星：9個動作包含9個動作以內且吃到金幣<br>2星：10個動作包含10個動作以內且吃到金幣<br>1星：滿足過關條件即可<br><br>Ctrl鍵加方向鍵上下可以調整程式區字體大小唷！"
    },
    {
      "level": 5,
      "mode": 1,
      "textarea1": "新指令與新物件出現了！！<br>新指令：<br>printf( )指令，分類於\"動作\"內。<br>新物件：<br>藍色的鎖頭精靈。<br><br>還記得之前出現過的黃色的鎖頭精靈嗎？<br>沒錯！一樣要完成特殊條件鎖頭精靈才會讓你通過。<br><br>而想讓藍色的鎖頭精靈讓你通過的話，就必須答對他的問題。<br>那又該如何答題呢？<br><br>請使用新指令printf( )，這個指令的功用就是輸出字元、字串或是特定的參數值<br><br>範例：<br>printf(“Hi”)<br>//執行後，將會顯示字串 Hi <br><br>藍色鎖頭精靈的問題：<br>精靈希望你到他面前跟他說聲Hello。<br><br>小提示：必須到精靈的前一格回答才有效喔。<br><br>通關條件：<br>3星：5個動作含5個動作以內<br>2星：6個動作含6個動作以內<br>1星：滿足過關條件即可<br><br>Ctrl鍵加方向鍵上下可以調整程式區字體大小唷！"
    },
    {
      "level": 6,
      "mode": 1,
      "textarea1": "新指令出現了！！<br>新指令：<br>scanf( )指令，分類於\"動作\"內。<br><br>在這一關想要答對鎖頭精靈的問題就必須獲得系統給予的特定值，並且將特定值加上變化才能找出問題的答案喔！！<br><br>請使用scanf( )指令，可由系統或是主控台輸入取得數值存至變數。<br>使用方法：<br>先宣告變數<br>scanf(\"欲獲取值的指定格式\",欲存值的變數);<br><br>範例：<br>int i=0;<br>scanf(\"%d\",&i);<br>//宣告一個變數 i，型態為 int，然後存取輸入的值於變數 i。<br><br>如果要使用printf()函式來輸出變數的話，使用方法如下：<br>int i=5;<br>printf(\"%d\",i);<br>在雙引號中間放入以'%'開頭的格式文字來對應到逗點後的變數名稱<br>對應不同資料型態的變數，可以使用不同的格式文字來輸出，如下：<br>'%d'：輸出十進制整數<br>'%f'：輸出浮點數<br>'%c'：輸出字元<br><br>藍色鎖頭精靈的問題為：<br>請問系統給予的值加上地圖上出現的樹木數為多少？<br>請到鎖頭精靈面前說出你的答案吧！<br><br>通關條件：<br>3星：9個動作以及9個動作以內<br>2星：10個動作以及10個動作以內<br>1星：滿足過關條件即可<br><br>Ctrl鍵加方向鍵上下可以調整程式區字體大小唷！"
    },
    {
      "level": 7,
      "mode": 1,
      "textarea1": "新物件與新指令出現了！！<br>新指令：<br>if( ){...} 指令，分類於\"判斷式\"內。<br>新物件：<br>問號標誌、問號石頭。<br><br>若在問號標誌十字範圍內有兩個有著紅色問號的石頭則：<br>問號標誌將在遊戲開始後隨機顯示：'L' or 'R'。<br>並且取得問號標誌值的參數預設為hint，在踩到問號標誌時 hint 參數的值才會變為'L' or 'R'。<br><br>if( ){...}為判斷式指令。<br>使用方法：<br>if(此處加入條件){<br>指定動作<br>}&nbsp&nbsp&nbsp&nbsp//若條件達成則執行指定動作。<br><br>範例：若問號標誌顯示為 R 則向右轉並且向前走一步。<br>if(hint == 'R'){<br>&nbsp&nbsp&nbsp&nbspturnRight( );<br>&nbsp&nbsp&nbsp&nbspstep( );<br>}&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp//若hint值等於 R，則向右轉並前進一格。<br><br>過關條件：<br>3星：5個動作包含5個動作以內<br>2星：6個動作包含6個動作以內<br>1星：滿足過關條件即可<br><br>Ctrl鍵加方向鍵上下可以調整程式區字體大小唷！"
    },
    {
      "level": 8,
      "mode": 1,
      "textarea1": "新指令出現了！！<br>新指令：<br>if( ){…}else{…} 指令，分類於\"判斷式\"內。<br><br>在上一關學過了基本的判斷式if( )，<br>在這關新增了更進階的判斷式指令。<br><br>使用方法：<br>if(此處加入條件){<br>指定動作<br>}else{ <br>指定動作<br>}&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp//若達成條件則執行if( ){...}內指令，其他情況則執行else{...}內指令。<br><br>範例：<br>if(hint == 'R'){<br>&nbsp&nbsp&nbsp&nbspturnRight( );<br>&nbsp&nbsp&nbsp&nbspstep( );<br>}else{<br>&nbsp&nbsp&nbsp&nbsp&nbspturnLeft( );<br>&nbsp&nbsp&nbsp&nbspstep( );<br>}&nbsp&nbsp&nbsp&nbsp//若hint值等於 R，則向右轉並前進一格，其他情況則向左轉並前進一格。<br><br>過關條件：<br>3星：5個動作包含5個動作以內<br>2星：6個動作包含6個動作以內<br>1星：滿足過關條件即可<br><br>Ctrl鍵加方向鍵上下可以調整程式區字體大小唷！"
    },
    {
      "level": 9,
      "mode": 1,
      "textarea1": "新指令出現了！！<br>新指令：<br>switch( ){...}指令，分類於\"判斷式\"內。<br><br>學過了if( ){...}和if(){...}else{...}，如果條件超過2種的話，該怎麼辦呢？<br>那就使用switch( ){...}吧！！<br><br>switch( ){...}是用來判斷多種條件的指令。<br>使用方法：<br>switch(條件參數){<br>&nbsp&nbsp&nbsp&nbspcase 條件參數的值:&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp指定動作&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbspbreak;&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<br>&nbsp&nbsp&nbsp&nbspcase 條件參數的值:<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp指定動作<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbspbreak;<br>&nbsp&nbsp&nbsp&nbspcase 條件參數的值:<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp指定動作<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbspbreak;<br>}&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp//由條件參數的值來判斷進入哪一個 case 做出指定動作，接著break跳出這個switch。<br><br>範例：<br>switch(hint){<br>&nbsp&nbsp&nbsp&nbspcase 'L':<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspturnLeft( );<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspbreak;<br>&nbsp&nbsp&nbsp&nbspcase 'F':<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspstep();<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspbreak;<br>&nbsp&nbsp&nbsp&nbspcase 'R':&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspturnRight( );<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspbreak;<br>}&nbsp&nbsp&nbsp&nbsp//若hint值為 L 則左轉然後跳出switch，若hint值為 F 則前進一步然後跳出switch，若hint值為 R 則右轉然後跳出switch。<br><br>請注意case 條件參數的值: ←此處為冒號':'。<br><br>過關條件：<br>3星：5個動作包含5個動作以內<br>2星：6個動作包含6個動作以內<br>1星：滿足過關條件即可<br><br>Ctrl鍵加方向鍵上下可以調整程式區字體大小唷！"
    },
    {
      "level": 10,
      "mode": 1,
      "textarea1": "新指令出現了！！<br>新指令：<br>int 指令，分類於\"變數宣告\"內。<br>for( ){...}指令，分類於\"函式\"內。<br><br>是不是覺得走好幾步的時候，要打好幾個step( )很麻煩呢？<br>現在！我們可以使用for( ){...}指令來編寫重複的動作。<br><br>for( ){...}為迴圈指令，主要是將重複的動作寫在迴圈內，然後設定迴圈次數來簡化程式碼，並且要先宣告一個變數用來設定迴圈次數。<br><br>變數可宣告為多種形態：<br>型態&nbsp&nbsp&nbsp&nbsp&nbsp意思&nbsp&nbsp&nbsp&nbsp&nbsp範例<br>int&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp整數&nbsp&nbsp&nbsp&nbsp&nbsp100、-5、1246….<br>float&nbsp&nbsp&nbsp&nbsp&nbsp浮點數&nbsp&nbsp3.14159、4.6….<br>char&nbsp&nbsp&nbsp&nbsp&nbsp字元&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp'a'、'B'、'@'…<br>string&nbsp&nbsp&nbsp字串&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp\"hello\"、\"HAHA@_@\"…<br>bool&nbsp&nbsp&nbsp&nbsp&nbsp布林&nbsp&nbsp&nbsp&nbsp&nbsp&nbspTrue、false<br><br>使用方法：<br>先宣告變數<br>for(設變數值;設迴圈條件;迴圈結束後變數增減){<br>&nbsp&nbsp&nbsp&nbsp指定動作<br>}&nbsp&nbsp&nbsp&nbsp//宣告一個變數後，根據進入迴圈條件以及變數的變化來設定執行指定動作的次數。<br><br>範例：<br>int i=0;<br>for(i=5;i>0;i--){<br>&nbsp&nbsp&nbsp&nbspstep( );<br>}<br>turnLeft( );&nbsp&nbsp&nbsp&nbsp//宣告一個型態為 int 的變數 i 初始值為 0，迴圈開始前將 i 的值設為 5，且若 i>0 則進入迴圈，當單一次迴圈結束時 i 的值 -1 ，接著再次判斷是否符合 i>0的條件，若符合則再次進入迴圈，若不符合則跳過迴圈去執行左轉的動作。。<br><br>該段程式碼運行後將會使車子前進5步後向左轉。<br><br>迴圈是程式語言中非常重要的一個環節，大家要跟他打好關係唷！<br><br>過關條件：<br>3星：1個動作包含1個動作以內<br>2星：2個動作包含2個動作以內<br>1星：滿足過關條件即可<br><br>Ctrl鍵加方向鍵上下可以調整程式區字體大小唷！"

    },
    {
      "level": 11,
      "mode": 1,
      "textarea1": "請將第十關所學會的迴圈指令與前進、左轉、右轉等動作指令結合來抵達終點吧！<br><br>過關條件：<br>3星：3個動作包含3個動作以內<br>2星：4個動作包含4個動作以內<br>1星：滿足過關條件即可<br><br>Ctrl鍵加方向鍵上下可以調整程式區字體大小唷！"
    },
    {
      "level": 12,
      "mode": 1,
      "textarea1": "還記得金幣的作用吧！<br>請結合各指令獲得金幣然後通過終點。<br><br>小提示：右右右左右左。<br><br>過關條件：<br>3星：7個動作包含7個動作以內且吃到兩個金幣<br>2星：8個動作包含8個動作以內且吃到兩個金幣<br>1星：滿足過關條件即可<br><br>Ctrl鍵加方向鍵上下可以調整程式區字體大小唷！"
    },
    {
      "level": 13,
      "mode": 1,
      "textarea1": "新物件出現了！！<br>新物件：黃色的鎖頭精靈。<br><br>通往終點的唯一道路被黃色的鎖頭精靈堵住了，那該如何才能解開呢？<br><br>看到那些黃色的箭頭了嗎？<br><br>沒錯！就是照著黃色箭頭的方向將全部箭頭踩過一遍，踩過的箭頭將會以變色來標示，全部箭頭都變色後鎖頭精靈才會放行。<br><br>小提示：迴圈指令很好用。<br><br>過關條件：<br>3星：6個動作包含6個動作以內<br>2星：7個動作包含7個動作以內<br>1星：滿足過關條件即可<br><br>Ctrl鍵加方向鍵上下可以調整程式區字體大小唷！"
    },
    {
      "level": 14,
      "mode": 1,
      "textarea1": "找出規律來寫出最短的程式碼吧！<br><br>小提示：一個迴圈就搞定。<br><br>過關條件：<br>3星：4個動作包含4個動作以內<br>2星：5個動作包含5個動作以內<br>1星：滿足過關條件即可<br><br>Ctrl鍵加方向鍵上下可以調整程式區字體大小唷！"
    },
    {
      "level": 15,
      "mode": 1,
      "textarea1": "新指令和新物件出現了！！！<br>新指令：<br>fire( )指令，分類於\"動作\"內。<br>新物件：<br>炸彈。<br><br>fire( )指令能夠使車子射出砲彈至前方兩格，而炮彈擊中炸彈時，炸彈將會爆炸，將十字範圍內的障礙物都清除乾淨。<br><br>請使用fire( ) + 炸彈的 combo 將障礙物清除乾淨抵達終點吧！<br><br>小提示：被炸彈炸到的話會直接失敗唷！<br><br>過關條件：<br>3星：2個動作包含2個動作以內<br>2星：3個動作包含3個動作以內<br>1星：滿足過關條件即可<br><br>Ctrl鍵加方向鍵上下可以調整程式區字體大小唷！"
    },
    {
      "level": 16,
      "mode": 1,
      "textarea1": "這關看起來障礙重重呢！！<br>請使用fire( )結合其他指令抵達終點吧！<br><br>小提示：直走到底左轉。<br><br>過關條件：<br>3星：5個動作包含5個動作以內<br>2星：6個動作包含6個動作以內<br>1星：滿足過關條件即可<br><br>Ctrl鍵加方向鍵上下可以調整程式區字體大小唷！"
    },
    {
      "level": 17,
      "mode": 1,
      "textarea1": "新指令出現了！！！<br>新指令：<br>function 函式名稱( )指令{...}，分類於\"函式\"內<br><br>function 函式名稱( ){...} 是用來自訂函式的指令，在程式碼中代表的即為void 自訂函式名稱(){...}，而在此處用function指令自訂函式名稱和函式內容。<br><br>使用方法：<br>function 自訂函式名稱( ){<br>&nbsp&nbsp&nbsp&nbsp自訂指令<br>}<br><br>自訂了一個函式後，又該如何呼叫它呢？<br>只需要在main積木中想呼叫自訂函式的地方放入一個call function積木就可以了。<br>在自訂函式時，函式內的指令將被計算進結果指令個數<br>還有call function也會被計算進結果指令個數<br><br>使用範例：<br>function gogogo(){<br>&nbsp&nbsp&nbsp&nbspstep;<br>}<br>int main(){<br>for(int i=3;i>0;i--){<br>&nbsp&nbsp&nbsp&nbspcall function gogogo();<br>&nbsp&nbsp}<br>}<br>這段程式碼執行後，結果為兩個指令，並且前行三步<br>請使用function 自訂一個函式通過關卡吧！<br><br>請使用下列程式碼完成此關卡：<br>int i=0;<br>for(i=5;i>0;i--){<br>&nbsp&nbsp&nbsp&nbspclear();&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp請自訂clear函式<br>}<br><br>過關條件：<br>3星：5個動作包含5個動作以內<br>2星：6個動作包含6個動作以內<br>1星：滿足過關條件即可<br><br>Ctrl鍵加方向鍵上下可以調整程式區字體大小唷！"
    },
    {
      "level": 18,
      "mode": 1,
      "textarea1": "自訂函式的應用千變萬化，請再自訂一個函式通過關卡吧！！<br><br>請使用下列程式碼完成關卡：<br>int i=0;<br>for(i=3;i>0;i--){<br>&nbsp&nbsp&nbsp&nbspturnRight( );<br>&nbsp&nbsp&nbsp&nbspcall function clear( );&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp//請自訂clear函式<br>}<br><br>通關條件：<br>3星：3個動作包含3個動作以內<br>2星：4個動作包含4個動作以內<br>1星：滿足過關條件即可<br><br>Ctrl鍵加方向鍵上下可以調整程式區字體大小唷！"
    },
    {
      "level": 19,
      "mode": 1,
      "textarea1": "應該還記得各物件的作用吧！<br>驗收成果的時刻到了！<br>請結合教過的各指令抵達終點。<br><br>注意！！！地圖的大小已變為9 x 9。<br><br>鎖頭精靈的問題是：<br>int i = 0;<br>int sum = 0;<br>int x = 1;<br>for(i=10;i>0;i--){<br>&nbsp&nbsp&nbsp&nbspif(x == 1){<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspx = 2;<br>&nbsp&nbsp&nbsp&nbsp}else(x == 2){<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspx = 1;<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspsum++;<br>&nbsp&nbsp&nbsp&nbsp}<br>}<br>請問最後sum的值為多少？<br><br>小提示：直走到底再回頭然後左轉再左轉。<br><br>過關條件：<br>3星：12個動作包含12個動作以內<br>2星：14個動作包含14個動作以內<br>1星：滿足過關條件即可<br><br>Ctrl鍵加方向鍵上下可以調整程式區字體大小唷！"
    },
    {
      "level": 20,
      "mode": 1,
      "textarea1": "運用你的智慧結合各指令抵達終點吧！<br><br>請將全部箭頭照著指示的方向踩過一遍來解開鎖頭精靈的阻礙。<br><br>小提示：直走到底右轉再右轉直走左轉再左轉。<br><br>過關條件：<br>3星：14個動作包含14個動作以內<br>2星：16個動作包含16個動作以內<br>1星：滿足過關條件即可<br><br>Ctrl鍵加方向鍵上下可以調整程式區字體大小唷！"
    },
    {
      "level": 21,
      "mode": 1,
      "textarea1": "還記得判斷式的用法吧？<br>這可不能忘記啊！<br>請結合各指令抵達終點。<br><br>判斷式很重要！<br>判斷式很重要！<br>判斷式很重要！<br>因為很重要所以講三遍。<br><br>過關條件：<br>3星：39個動作包含39個動作以內<br>2星：41個動作包含41個動作以內<br>1星：滿足過關條件即可<br><br>Ctrl鍵加方向鍵上下可以調整程式區字體大小唷！"
    },
    {
      "level": 22,
      "mode": 1,
      "textarea1": "當你走在充滿選擇的道路上，要做好準備面對每一種可能。<br><br>鎖頭精靈的問題：<br>int i=0;<br>int sum=0;<br>for(i=5;i>0;i--){<br>&nbsp&nbsp&nbsp&nbspif( i=3 ){<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspsum++;<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspi--;<br>&nbsp&nbsp&nbsp&nbsp}else{<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspsum = sum+2;<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspi = i-1;<br>&nbsp&nbsp&nbsp&nbsp}<br>}<br>請問最後sum的值為多少？<br><br>小提示：如果有多種選擇的話switch是很棒的指令。<br><br>過關條件：<br>3星：19個動作包含19個動作以內<br>2星：22個動作包含22個動作以內<br>1星：滿足過關條件即可<br><br>Ctrl鍵加方向鍵上下可以調整程式區字體大小唷！"
    },
    {
      "level": 23,
      "mode": 1,
      "textarea1": "請結合各指令抵達終點吧！<br><br>這路徑看起來好像有規律可循喔！？<br><br>小提示：如果有自訂函式會省下很多指令。<br><br>過關條件：<br>3星：9個動作包含9個動作以內<br>2星：11個動作包含11個動作以內<br>1星：滿足過關條件即可<br><br>Ctrl鍵加方向鍵上下可以調整程式區字體大小唷！"
    },
    {
      "level": 24,
      "mode": 1,
      "textarea1": "通往終點的道路真是曲折啊！<br>請結合各指令抵達終點吧！<br><br>過關條件：<br>3星：12個動作包含12個動作以內<br>2星：14個動作包含14個動作以內<br>1星：滿足過關條件即可<br><br>Ctrl鍵加方向鍵上下可以調整程式區字體大小唷！"
    }
  ]
};


/*可用指令*/
directiveData = {
  "instruction": [
    {
      "level": 1,
      "class": [
        {
          "name": "動作",
          "usable": [
            {
              "value": "step"
            }
          ]
        }
      ]
    },
    {
      "level": 2,
      "class": [
        {
          "name": "動作",
          "usable": [
            {
              "value": "step"
            },
            {
              "value": "turnRight"
            },
            {
              "value": "turnLeft"
            }
          ]
        }
      ]
    },
    {
      "level": 3,
      "class": [
        {
          "name": "動作",
          "usable": [
            {
              "value": "step"
            },
            {
              "value": "turnRight"
            },
            {
              "value": "turnLeft"
            }
          ]
        }
      ]
    },
    {
      "level": 4,
      "class": [
        {
          "name": "動作",
          "usable": [
            {
              "value": "step"
            },
            {
              "value": "turnRight"
            },
            {
              "value": "turnLeft"
            }
          ]
        }
      ]
    },
    {
      "level": 5,
      "class": [
        {
          "name": "動作",
          "usable": [
            {
              "value": "step"
            },
            {
              "value": "turnRight"
            },
            {
              "value": "turnLeft"
            },
            {
              "value": "printf"
            }
          ]
        }
      ]
    },
    {
      "level": 6,
      "class": [
        {
          "name": "動作",
          "usable": [
            {
              "value": "step"
            },
            {
              "value": "turnRight"
            },
            {
              "value": "turnLeft"
            },
            {
              "value": "printf"
            },
            {
              "value": "scanf"
            }
          ]
        }
      ]
    },
    {
      "level": 7,
      "class": [
        {
          "name": "動作",
          "usable": [
            {
              "value": "step"
            },
            {
              "value": "turnRight"
            },
            {
              "value": "turnLeft"
            },
            {
              "value": "printf"
            },
            {
              "value": "scanf"
            }
          ]
        },
        {
          "name": "判斷式",
          "usable": [
            {
              "value": "if"
            }
          ]
        }
      ]
    },
    {
      "level": 8,
      "class": [
        {
          "name": "動作",
          "usable": [
            {
              "value": "step"
            },
            {
              "value": "turnRight"
            },
            {
              "value": "turnLeft"
            },
            {
              "value": "printf"
            },
            {
              "value": "scanf"
            }
          ]
        },
        {
          "name": "判斷式",
          "usable": [
            {
              "value": "if"
            },
            {
              "value": "if_else"
            }
          ]
        }
      ]
    },
    {
      "level": 9,
      "class": [
        {
          "name": "動作",
          "usable": [
            {
              "value": "step"
            },
            {
              "value": "turnRight"
            },
            {
              "value": "turnLeft"
            },
            {
              "value": "printf"
            },
            {
              "value": "scanf"
            }
          ]
        },
        {
          "name": "判斷式",
          "usable": [
            {
              "value": "switch"
            }
          ]
        }
      ]
    },
    {
      "level": 10,
      "class": [
        {
          "name": "動作",
          "usable": [
            {
              "value": "step"
            },
            {
              "value": "turnRight"
            },
            {
              "value": "turnLeft"
            },
            {
              "value": "printf"
            },
            {
              "value": "scanf"
            }
          ]
        },
        {
          "name": "判斷式",
          "usable": [
            {
              "value": "if"
            },
            {
              "value": "if_else"
            },
            {
              "value": "switch"
            }
          ]
        },
        {
          "name": "函式",
          "usable": [
            {
              "value": "for"
            }
          ]
        }
      ]
    },
    {
      "level": 11,
      "class": [
        {
          "name": "動作",
          "usable": [
            {
              "value": "step"
            },
            {
              "value": "turnRight"
            },
            {
              "value": "turnLeft"
            },
            {
              "value": "printf"
            },
            {
              "value": "scanf"
            }
          ]
        },
        {
          "name": "判斷式",
          "usable": [
            {
              "value": "if"
            },
            {
              "value": "if_else"
            },
            {
              "value": "switch"
            }
          ]
        },
        {
          "name": "函式",
          "usable": [
            {
              "value": "for"
            }
          ]
        }
      ]
    },
    {
      "level": 12,
      "class": [
        {
          "name": "動作",
          "usable": [
            {
              "value": "step"
            },
            {
              "value": "turnRight"
            },
            {
              "value": "turnLeft"
            },
            {
              "value": "printf"
            },
            {
              "value": "scanf"
            }
          ]
        },
        {
          "name": "判斷式",
          "usable": [
            {
              "value": "if"
            },
            {
              "value": "if_else"
            },
            {
              "value": "switch"
            }
          ]
        },
        {
          "name": "函式",
          "usable": [
            {
              "value": "for"
            }
          ]
        }
      ]
    },
    {
      "level": 13,
      "class": [
        {
          "name": "動作",
          "usable": [
            {
              "value": "step"
            },
            {
              "value": "turnRight"
            },
            {
              "value": "turnLeft"
            },
            {
              "value": "printf"
            },
            {
              "value": "scanf"
            }
          ]
        },
        {
          "name": "判斷式",
          "usable": [
            {
              "value": "if"
            },
            {
              "value": "if_else"
            },
            {
              "value": "switch"
            }
          ]
        },
        {
          "name": "函式",
          "usable": [
            {
              "value": "for"
            }
          ]
        }
      ]
    },
    {
      "level": 14,
      "class": [
        {
          "name": "動作",
          "usable": [
            {
              "value": "step"
            },
            {
              "value": "turnRight"
            },
            {
              "value": "turnLeft"
            },
            {
              "value": "printf"
            },
            {
              "value": "scanf"
            }
          ]
        },
        {
          "name": "判斷式",
          "usable": [
            {
              "value": "if"
            },
            {
              "value": "if_else"
            },
            {
              "value": "switch"
            }
          ]
        },
        {
          "name": "函式",
          "usable": [
            {
              "value": "for"
            }
          ]
        }
      ]
    },
    {
      "level": 15,
      "class": [
        {
          "name": "動作",
          "usable": [
            {
              "value": "step"
            },
            {
              "value": "turnRight"
            },
            {
              "value": "turnLeft"
            },
            {
              "value": "fire"
            },
            {
              "value": "printf"
            },
            {
              "value": "scanf"
            }
          ]
        },
        {
          "name": "判斷式",
          "usable": [
            {
              "value": "if"
            },
            {
              "value": "if_else"
            },
            {
              "value": "switch"
            }
          ]
        },
        {
          "name": "函式",
          "usable": [
            {
              "value": "for"
            }
          ]
        }
      ]
    },
    {
      "level": 16,
      "class": [
        {
          "name": "動作",
          "usable": [
            {
              "value": "step"
            },
            {
              "value": "turnRight"
            },
            {
              "value": "turnLeft"
            },
            {
              "value": "fire"
            },
            {
              "value": "printf"
            },
            {
              "value": "scanf"
            }
          ]
        },
        {
          "name": "判斷式",
          "usable": [
            {
              "value": "if"
            },
            {
              "value": "if_else"
            },
            {
              "value": "switch"
            }
          ]
        },
        {
          "name": "函式",
          "usable": [
            {
              "value": "for"
            }
          ]
        }
      ]
    },
    {
      "level": 17,
      "class": [
        {
          "name": "動作",
          "usable": [
            {
              "value": "step"
            },
            {
              "value": "turnRight"
            },
            {
              "value": "turnLeft"
            },
            {
              "value": "fire"
            },
            {
              "value": "printf"
            },
            {
              "value": "scanf"
            }
          ]
        },
        {
          "name": "判斷式",
          "usable": [
            {
              "value": "if"
            },
            {
              "value": "if_else"
            },
            {
              "value": "switch"
            }
          ]
        },
        {
          "name": "函式",
          "usable": [
            {
              "value": "for"
            },
            {
              "value": "function"
            },
            {
              "value": "call"
            }
          ]
        }
      ]
    },
    {
      "level": 18,
      "class": [
        {
          "name": "動作",
          "usable": [
            {
              "value": "step"
            },
            {
              "value": "turnRight"
            },
            {
              "value": "turnLeft"
            },
            {
              "value": "fire"
            },
            {
              "value": "printf"
            },
            {
              "value": "scanf"
            }
          ]
        },
        {
          "name": "判斷式",
          "usable": [
            {
              "value": "if"
            },
            {
              "value": "if_else"
            },
            {
              "value": "switch"
            }
          ]
        },
        {
          "name": "函式",
          "usable": [
            {
              "value": "for"
            },
            {
              "value": "function"
            },
            {
              "value": "call"
            }
          ]
        }
      ]
    },
    {
      "level": 19,
      "class": [
        {
          "name": "動作",
          "usable": [
            {
              "value": "step"
            },
            {
              "value": "turnRight"
            },
            {
              "value": "turnLeft"
            },
            {
              "value": "fire"
            },
            {
              "value": "printf"
            },
            {
              "value": "scanf"
            }
          ]
        },
        {
          "name": "判斷式",
          "usable": [
            {
              "value": "if"
            },
            {
              "value": "if_else"
            },
            {
              "value": "switch"
            }
          ]
        },
        {
          "name": "函式",
          "usable": [
            {
              "value": "for"
            },
            {
              "value": "function"
            },
            {
              "value": "call"
            }
          ]
        }
      ]
    },
    {
      "level": 20,
      "class": [
        {
          "name": "動作",
          "usable": [
            {
              "value": "step"
            },
            {
              "value": "turnRight"
            },
            {
              "value": "turnLeft"
            },
            {
              "value": "fire"
            },
            {
              "value": "printf"
            },
            {
              "value": "scanf"
            }
          ]
        },
        {
          "name": "判斷式",
          "usable": [
            {
              "value": "if"
            },
            {
              "value": "if_else"
            },
            {
              "value": "switch"
            }
          ]
        },
        {
          "name": "函式",
          "usable": [
            {
              "value": "for"
            },
            {
              "value": "function"
            },
            {
              "value": "call"
            }
          ]
        }
      ]
    },
    {
      "level": 21,
      "class": [
        {
          "name": "動作",
          "usable": [
            {
              "value": "step"
            },
            {
              "value": "turnRight"
            },
            {
              "value": "turnLeft"
            },
            {
              "value": "fire"
            },
            {
              "value": "printf"
            },
            {
              "value": "scanf"
            }
          ]
        },
        {
          "name": "判斷式",
          "usable": [
            {
              "value": "if"
            },
            {
              "value": "if_else"
            },
            {
              "value": "switch"
            }
          ]
        },
        {
          "name": "函式",
          "usable": [
            {
              "value": "for"
            },
            {
              "value": "function"
            },
            {
              "value": "call"
            }
          ]
        }
      ]
    },
    {
      "level": 22,
      "class": [
        {
          "name": "動作",
          "usable": [
            {
              "value": "step"
            },
            {
              "value": "turnRight"
            },
            {
              "value": "turnLeft"
            },
            {
              "value": "fire"
            },
            {
              "value": "printf"
            },
            {
              "value": "scanf"
            }
          ]
        },
        {
          "name": "判斷式",
          "usable": [
            {
              "value": "if"
            },
            {
              "value": "if_else"
            },
            {
              "value": "switch"
            }
          ]
        },
        {
          "name": "函式",
          "usable": [
            {
              "value": "for"
            },
            {
              "value": "function"
            },
            {
              "value": "call"
            }
          ]
        }
      ]
    },
    {
      "level": 23,
      "class": [
        {
          "name": "動作",
          "usable": [
            {
              "value": "step"
            },
            {
              "value": "turnRight"
            },
            {
              "value": "turnLeft"
            },
            {
              "value": "fire"
            },
            {
              "value": "printf"
            },
            {
              "value": "scanf"
            }
          ]
        },
        {
          "name": "判斷式",
          "usable": [
            {
              "value": "if"
            },
            {
              "value": "if_else"
            },
            {
              "value": "switch"
            }
          ]
        },
        {
          "name": "函式",
          "usable": [
            {
              "value": "for"
            },
            {
              "value": "function"
            },
            {
              "value": "call"
            }
          ]
        }
      ]
    },
    {
      "level": 24,
      "class": [
        {
          "name": "動作",
          "usable": [
            {
              "value": "step"
            },
            {
              "value": "turnRight"
            },
            {
              "value": "turnLeft"
            },
            {
              "value": "fire"
            },
            {
              "value": "printf"
            },
            {
              "value": "scanf"
            }
          ]
        },
        {
          "name": "判斷式",
          "usable": [
            {
              "value": "if"
            },
            {
              "value": "if_else"
            },
            {
              "value": "switch"
            }
          ]
        },
        {
          "name": "函式",
          "usable": [
            {
              "value": "for"
            },
            {
              "value": "function"
            },
            {
              "value": "call"
            }
          ]
        }
      ]
    }
  ]
};
