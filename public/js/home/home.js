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
var user, equipmentData, achievemenData, dictionaryData, test;
var swordLevel = 0, shieldLevel = 0, levelUpLevel = 0, musicLevel = 1, bkMusicSwitch, bkMusicVolumn = 0.1, gameSpeed;
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


var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    achievemenData = JSON.parse(this.responseText);
  }
};
xmlhttp.open("GET", "json/achievement.json", true);
xmlhttp.send();
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    dictionaryData = JSON.parse(this.responseText);
  }
};
xmlhttp.open("GET", "json/dictionary.json", true);
xmlhttp.send();
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
}
function weaponLevelup() {
  var scriptData = {
    type: "weaponLevelup"
  }
  $.ajax({
    url: href,              // 要傳送的頁面
    method: 'POST',               // 使用 POST 方法傳送請求
    dataType: 'json',             // 回傳資料會是 json 格式
    data: scriptData,  // 將表單資料用打包起來送出去
    success: function (res) {
      // console.log(res);
      if (res.err) {
        error();
      }
      user = res;
    }
  })
}
function armorLevelup() {
  var scriptData = {
    type: "armorLevelup",
  }
  $.ajax({
    url: href,              // 要傳送的頁面
    method: 'POST',               // 使用 POST 方法傳送請求
    dataType: 'json',             // 回傳資料會是 json 格式
    data: scriptData,  // 將表單資料用打包起來送出去
    success: function (res) {
      if (res.err) {
        error();
      }
      // console.log(res.err);
      // console.log(user);
    }
  })
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
//////-------------/////////
function test() {
  console.log("testbtn ---  onclick");
  // 武器升級
  // weaponLevelup();
  // 護甲升級
  // armorLevelup();

  // 儲存關卡
  // var scriptData = {
  //     type: "codeLevelResult",  //"codeLevelResult" or "blockLevelResult"限"EasyEmpire"
  //     Empire: "MediumEmpire",     //"EasyEmpire" or "MediumEmpire"
  //     level: 3,                 // 0~24 or 25
  //     StarNum: 4,               // 0 or 1 or 2 or 3
  //     result: "2星 or 1星 or 駛出邊界 or 未完成通關條件 ... ",
  //     code: " #include ........"
  // }
  // recordLevel(scriptData)
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


var userMap = [];
var scriptData = {
  type: "userMap"
}
$.ajax({
  url: href,              // 要傳送的頁面
  method: 'POST',               // 使用 POST 方法傳送請求
  dataType: 'json',             // 回傳資料會是 json 格式
  data: scriptData,  // 將表單資料用打包起來送出去
  success: function (res) {
    // console.log(res);
    console.log("res:", res);

    userMap = res.length;
  }
})

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
  b.setAttribute("onclick", "clossFunc(\"userDataBkView\",\"userDataView\")");
  divTag.appendChild(b);
  /*修改密碼按鈕*/
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("id", "changePasswordBtn");
  b.setAttribute("value", "修改密碼");
  b.setAttribute("onclick", "changePassword(\"userDataView\")");
  divTag.appendChild(b);
  createUserView(divID);


}
function clossFunc(thisDiv, thisDiv2) {
  document.getElementById("changePasswordBtn").className = "";
  document.getElementById("clossDiv").className = "";
  try {
    divTag = document.getElementById(thisDiv);
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
  } catch (e) {}
  try {
    divTag = document.getElementById(thisDiv2);
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
  } catch (e) {}
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
      userdataFont = userMap;
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
function changePassword(thisDiv){
  var tdValue = ["舊密碼","新密碼","確認新密碼"],inputID = ["oldPassword","newPassword","checkPassword"];
  document.getElementById("changePasswordBtn").className = "disabled";
  document.getElementById("clossDiv").className = "disabled";
  divTag = document.getElementById("userDataView");
  b = document.createElement("div");
  b.setAttribute("id", "changePasswordView");
  divTag.appendChild(b);
  divTag = document.getElementById("changePasswordView");
  b = document.createElement("h1");
  b.setAttribute("id", "changePasswordTitle");
  b.innerHTML = "修改密碼";
  divTag.appendChild(b);

  b = document.createElement("table");
  b.setAttribute("id", "changePasswordTable");
  divTag.appendChild(b);
  divTag = document.getElementById("changePasswordTable");
  for(var i=0;i<3;i++){
    b = document.createElement("tr");
    b.setAttribute("id", "changePasswordTr" + i);
    divTag.appendChild(b);
    for(var j=0;j<2;j++){
      divTag = document.getElementById("changePasswordTr" + i);
      b = document.createElement("td");
      b.setAttribute("id", "changePasswordTd" + i + j);
      divTag.appendChild(b);
      divTag = document.getElementById("changePasswordTd" + i + j);
      if(j == 0){
        b = document.createElement("h2");
        b.setAttribute("id", "changePasswordH2" + i + j);
        b.innerHTML = tdValue[i];
        divTag.appendChild(b);
      }else{
        b = document.createElement("input");
        b.setAttribute("type","password");
        b.setAttribute("id",inputID[i]);
        divTag.appendChild(b);
      }
    }
    divTag = document.getElementById("changePasswordTable");
  }
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("id", "cancelBtn");
  b.setAttribute("value", "取消修改");
  b.setAttribute("onclick", "clossFunc(\"changePasswordView\")");
  divTag.appendChild(b);

  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("id", "confirmBtn");
  b.setAttribute("value", "確認修改");
  b.setAttribute("onclick", "clossFunc(\"changePasswordView\")");
  divTag.appendChild(b);
}

//////////////////////////////////////////////////
//              homeBtn.js                        //
//////////////////////////////////////////////////
var divTag, b, divID, divID2;



/*裝備*/
function equipageView(mainDiv) {
  console.log("武器:" + equipmentData.weaponLevel.length, user.weaponLevel);
  console.log("護具:" + equipmentData.armorLevel.length, user.armorLevel);
  divID = "equipageView";
  divID2 = "equipageBkView";
  divTag = document.getElementById(mainDiv.id);
  b = document.createElement("div");
  b.setAttribute("id", "equipageBkView");
  b.setAttribute("onclick", "clossFunc(\"equipageView\",\"equipageBkView\")");
  divTag.appendChild(b);
  b = document.createElement("div");
  b.setAttribute("id", "equipageView");
  divTag.appendChild(b);
  divTag = document.getElementById("equipageView");
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("id", "clossDiv");
  b.setAttribute("value", "X");
  b.setAttribute("onclick", "clossFunc(\"equipageView\",\"equipageBkView\")");
  divTag.appendChild(b);
  b = document.createElement("h1");
  b.setAttribute("id", "allTitle");
  divTag.appendChild(b);
  document.getElementById("allTitle").innerHTML = "裝備";
  b = document.createElement("table");
  b.setAttribute("id", "equipageTable");
  b.setAttribute("rules", "rows");
  b.setAttribute("border", "1");
  divTag.appendChild(b);
  divTag = document.getElementById("equipageTable");
  for (var i = 0; i < 2; i++) {
    b = document.createElement("tr");
    b.setAttribute("id", "tr" + i);
    divTag.appendChild(b);
    for (var j = 0; j < 3; j++) {
      divTag = document.getElementById("tr" + i);
      b = document.createElement("td");
      b.setAttribute("id", "row" + i + "col" + j);
      divTag.appendChild(b);
      if (j == 0) {
        if (i == 0) {
          divTag = document.getElementById("row" + i + "col" + j);
          b = document.createElement("img");
          b.setAttribute("id", "swordImg");
          b.setAttribute("src", "img/sword.png");
          divTag.appendChild(b);
        } else {
          divTag = document.getElementById("row" + i + "col" + j);
          b = document.createElement("img");
          b.setAttribute("id", "shieldImg");
          b.setAttribute("src", "img/shield.png");
          divTag.appendChild(b);
        }
      } else if (j == 1) {
        divTag = document.getElementById("row" + i + "col" + j);
        b = document.createElement("div");
        if (i == 0) {
          b.setAttribute("id", "swordLevelUpDiv");
          divTag.appendChild(b);
          b = document.createElement("h3");
          b.setAttribute("id", "swordLevelUpDivH3");
          divTag.appendChild(b);
          document.getElementById("swordLevelUpDivH3").innerHTML = "";
        } else {
          b.setAttribute("id", "shieldLevelUpDiv");
          divTag.appendChild(b);
          b = document.createElement("h3");
          b.setAttribute("id", "shieldLevelUpDivH3");
          divTag.appendChild(b);
          document.getElementById("shieldLevelUpDivH3").innerHTML = "";
        }
      } else {
        divTag = document.getElementById("row" + i + "col" + j);
        /*b = document.createElement("input");
        b.setAttribute("type","button");
        b.setAttribute("id","levelUp" + i);
        b.setAttribute("value","升級");*/
        b = document.createElement("button");
        b.setAttribute("id", "levelUpDefault" + i);
        if (i == 0) {
          b.setAttribute("onclick", "swordLevelUp()");
          b.setAttribute("class", "levelUpDefault");
          divTag.appendChild(b);
          document.getElementById("levelUpDefault" + i).innerHTML = "升級";
          divTag = document.getElementById("levelUpDefault" + i);
          b = document.createElement("br");
          divTag.appendChild(b);
          b = document.createElement("img");
          b.setAttribute("id", "levelUpImg");
          divTag.appendChild(b);
          b = document.createElement("font");
          b.setAttribute("id", "levelUpFont" + i);
          b.setAttribute("class", "levelUpFont");
          divTag.appendChild(b);
          document.getElementById("levelUpFont" + i).innerHTML = "";
        } else {
          b.setAttribute("onclick", "shieldLevelUp()");
          b.setAttribute("class", "levelUp");
          divTag.appendChild(b);
          document.getElementById("levelUpDefault" + i).innerHTML = "升級";
          divTag = document.getElementById("levelUpDefault" + i);
          b = document.createElement("br");
          divTag.appendChild(b);
          b = document.createElement("img");
          b.setAttribute("id", "levelUpImg");
          divTag.appendChild(b);
          b = document.createElement("font");
          b.setAttribute("id", "levelUpFont" + i);
          b.setAttribute("class", "levelUpFont");
          divTag.appendChild(b);
          document.getElementById("levelUpFont" + i).innerHTML = "";
        }
      }
    }
    divTag = document.getElementById("equipageTable");
  }

  for (var i = 0; i < 2; i++) {
    if (i == 0) {
      divTag = document.getElementById("swordLevelUpDiv");
      b = document.createElement("table");
      b.setAttribute("id", "swordLevelUpTable");
      b.setAttribute("rules", "rows");
      divTag.appendChild(b);
      divTag = document.getElementById("swordLevelUpTable");
    } else {
      divTag = document.getElementById("shieldLevelUpDiv");
      b = document.createElement("table");
      b.setAttribute("id", "shieldLevelUpTable");
      b.setAttribute("rules", "rows");
      divTag.appendChild(b);
      divTag = document.getElementById("shieldLevelUpTable");
    }
    for (var j = 0; j < 10; j++) {
      b = document.createElement("td");
      divTag.appendChild(b);
      b = document.createElement("div");
      if (i == 0) {
        b.setAttribute("id", "swordLevelUpinnerDiv" + j);
      } else {
        b.setAttribute("id", "shieldLevelUpinnerDiv" + j);
      }

      if (j == 0) {
        b.setAttribute("class", "levelFont");
      } else if (j == 9) {
        b.setAttribute("class", "levelLaterDefault");
      } else {
        b.setAttribute("class", "levelDefault");
      }
      divTag.appendChild(b);
    }
  }

  divTag = document.getElementById("equipageView");

  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("id", "resetEquipageLevel");
  b.setAttribute("value", "重置升級");
  b.setAttribute("onclick", "resetEquipClick(this)");
  divTag.appendChild(b);
  ///--------------------------------- ///
  /*             new                    */
  ///--------------------------------- ///
  for (var li = 0; li < equipmentData.weaponLevel.length && li < 10; ++li) {
    var temp = document.getElementById("swordLevelUpinnerDiv" + li);
    if (li < swordLevel) {
      if (li == 0) {
        temp.className = "levelFont";
      } else if (li == 9) {
        temp.className = "levelLater";
      } else {
        temp.className = "levelChange";
      }
    }
    else {
      if (li == 0) {
        temp.className = "levelFontDefault";
      } else if (li == 9) {
        temp.className = "levelLaterDefault";
      } else {
        temp.className = "levelDefault";
      }
    }
  }
  for (var li = 0; li < equipmentData.armorLevel.length && li < 10; ++li) {
    var temp = document.getElementById("shieldLevelUpinnerDiv" + li);
    if (li < shieldLevel) {
      if (li == 0) {
        temp.className = "levelFont";
      } else if (li == 9) {
        temp.className = "levelLater";
      } else {
        temp.className = "levelChange";
      }
    }
    else {
      if (li == 0) {
        temp.className = "levelFontDefault";
      } else if (li == 9) {
        temp.className = "levelLaterDefault";
      } else {
        temp.className = "levelDefault";
      }
    }
  }
  var swordmaxFlag = false, shiledmaxFlag = false;
  if ((swordLevel + shieldLevel) >= 15) {
    if (swordLevel == 10) {
      document.getElementById("levelUpDefault0").innerHTML = "";
      var text = "攻擊力：" + equipmentData.weaponLevel[swordLevel].attack + "  等級已升到最滿"
      document.getElementById("swordLevelUpDivH3").innerHTML = text;
      var text = "防禦力：" + equipmentData.armorLevel[shieldLevel].attack + " &nbsp 下一級為：" + equipmentData.armorLevel[shieldLevel + 1].attack;
      document.getElementById("shieldLevelUpDivH3").innerHTML = text;
    }
    else if (shieldLevel == 10) {
      document.getElementById("levelUpDefault1").innerHTML = "";
      var text = "防禦力：" + equipmentData.armorLevel[shieldLevel].attack + "  等級已升到最滿";
      document.getElementById("shieldLevelUpDivH3").innerHTML = text;
      var text = "攻擊力：" + equipmentData.weaponLevel[swordLevel].attack + " &nbsp 下一級為：" + equipmentData.weaponLevel[swordLevel + 1].attack;
      document.getElementById("swordLevelUpDivH3").innerHTML = text;
    }
    else {
      var text = "攻擊力：" + equipmentData.weaponLevel[swordLevel].attack + " &nbsp 下一級為：" + equipmentData.weaponLevel[swordLevel + 1].attack;
      document.getElementById("swordLevelUpDivH3").innerHTML = text;
      var text = "防禦力：" + equipmentData.armorLevel[shieldLevel].attack + " &nbsp 下一級為：" + equipmentData.armorLevel[shieldLevel + 1].attack;
      document.getElementById("shieldLevelUpDivH3").innerHTML = text;
    }
    document.getElementById("levelUpDefault0").innerHTML = "";
    document.getElementById("levelUpDefault0").innerHTML = "已達<br>上限";
    document.getElementById("levelUpDefault1").innerHTML = "";
    document.getElementById("levelUpDefault1").innerHTML = "已達<br>上限";
    document.getElementById("levelUpDefault0").className = "levelUpDefault";
    document.getElementById("levelUpDefault1").className = "levelUpDefault";
  }
  else if (swordLevel == 10) {
    document.getElementById("levelUpDefault0").innerHTML = "";
    var text = "攻擊力：" + equipmentData.weaponLevel[swordLevel].attack + "  等級已升到最滿"
    document.getElementById("swordLevelUpDivH3").innerHTML = text;
    var text = "防禦力：" + equipmentData.armorLevel[shieldLevel].attack + " &nbsp 下一級為：" + equipmentData.armorLevel[shieldLevel + 1].attack;
    document.getElementById("shieldLevelUpDivH3").innerHTML = text;

    var star = equipmentData.levelUpLevel[levelUpLevel].star;
    var text = "x" + star;
    document.getElementById("levelUpFont1").innerHTML = text;
    document.getElementById("levelUpDefault0").innerHTML = "最高<br>等級";

    if (star <= user.starNum) {
      document.getElementById("levelUpDefault0").className = "levelUpDefault";
      document.getElementById("levelUpDefault1").className = "levelUp";
    }
    else {
      document.getElementById("levelUpDefault0").className = "levelUpDefault";
      document.getElementById("levelUpDefault1").className = "levelUpDefault";
    }
  }
  else if (shieldLevel == 10) {
    document.getElementById("levelUpDefault1").innerHTML = "";
    var text = "防禦力：" + equipmentData.armorLevel[shieldLevel].attack + "  等級已升到最滿";
    document.getElementById("shieldLevelUpDivH3").innerHTML = text;
    var text = "攻擊力：" + equipmentData.weaponLevel[swordLevel].attack + " &nbsp 下一級為：" + equipmentData.weaponLevel[swordLevel + 1].attack;
    document.getElementById("swordLevelUpDivH3").innerHTML = text;

    var star = equipmentData.levelUpLevel[levelUpLevel].star;
    var text = "x" + star;
    document.getElementById("levelUpFont0").innerHTML = text;
    document.getElementById("levelUpDefault1").innerHTML = "最高<br>等級";
    if (star <= user.starNum) {
      document.getElementById("levelUpDefault0").className = "levelUp";
      document.getElementById("levelUpDefault1").className = "levelUpDefault";
    }
    else {
      document.getElementById("levelUpDefault0").className = "levelUpDefault";
      document.getElementById("levelUpDefault1").className = "levelUpDefault";
    }
  }
  else{
    var text = "攻擊力：" + equipmentData.weaponLevel[swordLevel].attack + " &nbsp 下一級為：" + equipmentData.weaponLevel[swordLevel + 1].attack;
    document.getElementById("swordLevelUpDivH3").innerHTML = text;
    var text = "防禦力：" + equipmentData.armorLevel[shieldLevel].attack + " &nbsp 下一級為：" + equipmentData.armorLevel[shieldLevel + 1].attack;
    document.getElementById("shieldLevelUpDivH3").innerHTML = text;
    var star = equipmentData.levelUpLevel[levelUpLevel].star;
    var text = "x" + star;
    document.getElementById("levelUpFont0").innerHTML = text;
    document.getElementById("levelUpFont1").innerHTML = text;

    if (star <= user.starNum) {
      document.getElementById("levelUpDefault0").className = "levelUp";
      document.getElementById("levelUpDefault1").className = "levelUp";
    }
    else {
      document.getElementById("levelUpDefault0").className = "levelUpDefault";
      document.getElementById("levelUpDefault1").className = "levelUpDefault";
    }
  }
  console.log(swordLevel, shieldLevel);
}

function resetEquipClick() {
  console.log("123123131321");
  var scriptData = {
    type: "resetEquip"
  }
  $.ajax({
    url: href,              // 要傳送的頁面
    method: 'POST',         // 使用 POST 方法傳送請求
    dataType: 'json',       // 回傳資料會是 json 格式
    data: scriptData,       // 將表單資料用打包起來送出去
    success: function (res) {
      user = res;
      swordLevel = 0;
      shieldLevel = 0;
      levelUpLevel = 0;
      // clossFunc("equipageView","equipageBkViewv");
      clossFunc("equipageView", "equipageBkView");
      equipageView(center);
    }
  })
}
/*武器*/
function swordLevelUp() {
  b = document.getElementById("swordLevelUpinnerDiv" + swordLevel);
  if (swordLevel == 0) {
    b.className = "levelFont";
  } else if (swordLevel == 9) {
    b.className = "levelLater";
  } else if (swordLevel < 9) {
    b.className = "levelChange";
  }
  swordLevel++;
  levelUpLevel++;
  /*   ----------------------------------    */
  weaponLevelup();
  if ((swordLevel + shieldLevel) >= 15) {
    document.getElementById("levelUpDefault0").innerHTML = "";
    document.getElementById("levelUpDefault0").innerHTML = "已達<br>上限";
    document.getElementById("levelUpDefault1").innerHTML = "";
    document.getElementById("levelUpDefault1").innerHTML = "已達<br>上限";

    document.getElementById("levelUpDefault0").className = "levelUpDefault";
    document.getElementById("levelUpDefault1").className = "levelUpDefault";
    var text = "攻擊力：" + equipmentData.weaponLevel[swordLevel].attack + " &nbsp 下一級為：" + equipmentData.weaponLevel[swordLevel + 1].attack;
    document.getElementById("swordLevelUpDivH3").innerHTML = text;

  }
  else if (swordLevel >= 10) {
    document.getElementById("levelUpDefault0").innerHTML = "";
    var text = "攻擊力：" + equipmentData.weaponLevel[swordLevel].attack + "  等級已升到最滿"
    document.getElementById("swordLevelUpDivH3").innerHTML = text;
    document.getElementById("levelUpDefault0").innerHTML = "最高<br>等級";
    document.getElementById("levelUpDefault0").className = "levelUpDefault";

    var star = equipmentData.levelUpLevel[levelUpLevel].star;
    var text = "x" + star;
    document.getElementById("levelUpFont1").innerHTML = text;
  }
  else {
    var star = equipmentData.levelUpLevel[levelUpLevel].star;
    var text = "x" + star;
    document.getElementById("levelUpFont0").innerHTML = text;
    if (star <= user.starNum) {
      document.getElementById("levelUpDefault0").className = "levelUp";
    }
    else {
      document.getElementById("levelUpDefault0").className = "levelUpDefault";
    }
    var text = "攻擊力：" + equipmentData.weaponLevel[swordLevel].attack + " &nbsp 下一級為：" + equipmentData.weaponLevel[swordLevel + 1].attack;
    document.getElementById("swordLevelUpDivH3").innerHTML = text;

    var star = equipmentData.levelUpLevel[levelUpLevel].star;
    var text = "x" + star;

    document.getElementById("levelUpFont0").innerHTML = text;
    if (shieldLevel < 10) {
      document.getElementById("levelUpFont1").innerHTML = text;
    }
    if (star > user.starNum) {
      document.getElementById("levelUpDefault0").className = "levelUpDefault";
      document.getElementById("levelUpDefault1").className = "levelUpDefault";
    }
    else {

      document.getElementById("levelUpDefault0").className = "levelUp";
      if (shieldLevel < 10) {
        document.getElementById("levelUpDefault1").className = "levelUp";
      }
    }
  }


}
/*防具*/
function shieldLevelUp() {
  // console.log("123");

  b = document.getElementById("shieldLevelUpinnerDiv" + shieldLevel);
  if (shieldLevel == 0) {
    b.className = "levelFont";
  } else if (shieldLevel == 9) {
    b.className = "levelLater";
  } else if (shieldLevel < 9) {
    b.className = "levelChange";
  }
  shieldLevel++;
  levelUpLevel++;
  /*   ----------------------------------    */
  armorLevelup();
  if ((swordLevel + shieldLevel) >= 15) {
    document.getElementById("levelUpDefault0").innerHTML = "";
    document.getElementById("levelUpDefault0").innerHTML = "已達<br>上限";
    document.getElementById("levelUpDefault1").innerHTML = "";
    document.getElementById("levelUpDefault1").innerHTML = "已達<br>上限";

    document.getElementById("levelUpDefault0").className = "levelUpDefault";
    document.getElementById("levelUpDefault1").className = "levelUpDefault";

    var text = "防禦力：" + equipmentData.armorLevel[shieldLevel].attack + " &nbsp 下一級為：" + equipmentData.armorLevel[shieldLevel + 1].attack;
    document.getElementById("shieldLevelUpDivH3").innerHTML = text;
  }
  else if (shieldLevel >= 10) {
    document.getElementById("levelUpDefault1").innerHTML = "";
    var text = "防禦力：" + equipmentData.armorLevel[shieldLevel].attack + "  等級已升到最滿";
    document.getElementById("shieldLevelUpDivH3").innerHTML = text;
    document.getElementById("levelUpDefault1").innerHTML = "最高<br>等級";
    document.getElementById("levelUpDefault1").className = "levelUpDefault";
    var star = equipmentData.levelUpLevel[levelUpLevel].star;
    var text = "x" + star;
    document.getElementById("levelUpFont1").innerHTML = text;

  }
  else {
    var star = equipmentData.levelUpLevel[levelUpLevel].star;
    var text = "x" + star;
    document.getElementById("levelUpFont1").innerHTML = text;
    if (star <= user.starNum) {
      document.getElementById("levelUpDefault1").className = "levelUp";
    }
    else {
      document.getElementById("levelUpDefault1").className = "levelUpDefault";
    }
    var text = "防禦力：" + equipmentData.armorLevel[shieldLevel].attack + " &nbsp 下一級為：" + equipmentData.armorLevel[shieldLevel + 1].attack;
    document.getElementById("shieldLevelUpDivH3").innerHTML = text;

    var star = equipmentData.levelUpLevel[levelUpLevel].star;
    var text = "x" + star;
    if (swordLevel < 10) {
      document.getElementById("levelUpFont0").innerHTML = text;
    }
    document.getElementById("levelUpFont1").innerHTML = text;
    if (star > user.starNum) {
      document.getElementById("levelUpDefault0").className = "levelUpDefault";
      document.getElementById("levelUpDefault1").className = "levelUpDefault";
    }
    else {
      if (swordLevel < 10) {

        document.getElementById("levelUpDefault0").className = "levelUp";
      }
      document.getElementById("levelUpDefault1").className = "levelUp";
    }

  }




}


/*----------------*/

/*指令大全*/
function instructionView(mainDiv) {
  divID = "instructionView";
  divID2 = "equipageBkView";
  divTag = document.getElementById(mainDiv.id);
  b = document.createElement("div");
  b.setAttribute("id", "equipageBkView");
  b.setAttribute("onclick", "clossFunc(\"instructionView\",\"equipageBkView\")");
  divTag.appendChild(b);
  b = document.createElement("div");
  b.setAttribute("id", "instructionView");
  divTag.appendChild(b);
  divTag = document.getElementById("instructionView");
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("id", "clossDiv");
  b.setAttribute("value", "X");
  b.setAttribute("onclick", "clossFunc(\"instructionView\",\"equipageBkView\")");
  divTag.appendChild(b);
  b = document.createElement("h1");
  b.setAttribute("id", "allTitle");
  divTag.appendChild(b);
  document.getElementById("allTitle").innerHTML = "指令大全";
  b = document.createElement("table");
  b.setAttribute("id", "instructionTable");
  b.setAttribute("rules", "rows");
  b.setAttribute("border", "1");
  divTag.appendChild(b);
  divTag = document.getElementById("instructionTable");
  var dic = dictionaryData.code;
  var passLevel;
  if (user.MediumEmpire.codeLevel.length != 0) {
    passLevel = user.MediumEmpire.codeLevel.length;
    passLevel += 24;
  } else {
    if (user.EasyEmpire.codeLevel.length > user.EasyEmpire.blockLevel.length) {
      passLevel = user.EasyEmpire.codeLevel.length;
      passLevel++;
    } else {
      passLevel = user.EasyEmpire.blockLevel.length;
      passLevel++;
    }
  }
  for (var i = 0; i < dic.length * 2; i++) {
    if ((i % 2) == 0) {
      var li = dic[parseInt(i / 2)].element;
      var minLimit = 999;
      for (var j = 0; j < li.length; j++) {
        if (minLimit > li[j].limit) {
          minLimit = li[j].limit;
        }
      }
      if (minLimit > passLevel) {
        continue;
      }
      b = document.createElement("tr");
      b.setAttribute("id", "tr" + i);
      divTag.appendChild(b);
      divTag = document.getElementById("tr" + i);
      b = document.createElement("td");
      b.setAttribute("id", "td" + i);
      divTag.appendChild(b);
      divTag = document.getElementById("td" + i);
      b = document.createElement("h1");
      b.setAttribute("id", "actionFont" + i);
      divTag.appendChild(b);
      document.getElementById("actionFont" + i).innerHTML = dic[i / 2].type;
    } else {
      b = document.createElement("tr");
      b.setAttribute("id", "tr" + i);
      b.setAttribute("align", "left");
      divTag.appendChild(b);
      divTag = document.getElementById("tr" + i);
      b = document.createElement("div");
      b.setAttribute("id", "actionDiv" + i);
      divTag.appendChild(b);
      divTag = document.getElementById("actionDiv" + i);
      // if (i == 1) {
      // for (var j = 0; j < 5; j++) {
      var li = dic[parseInt(i / 2)].element;
      for (var j = 0; j < li.length; j++) {
        //console.log(li[j].limit,li[j].name,passLevel);
        if (li[j].limit > passLevel) {
          continue;
        }
        b = document.createElement("h3");
        b.setAttribute("id", "h3Inner" + i + j);
        divTag.appendChild(b);
        divTag = document.getElementById("h3Inner" + i + j);
        b = document.createElement("a");
        b.setAttribute("id", "aInner" + i + j);
        b.setAttribute("href", "#item" + i + j);
        divTag.appendChild(b);
        // document.getElementById("aInner" + j).innerHTML = "step( )▼";
        document.getElementById("aInner" + i + j).innerHTML = "&nbsp" + li[j].name + "▼";
        divTag = document.getElementById("actionDiv" + i);
        b = document.createElement("h6");
        b.setAttribute("id", "item" + i + j);
        divTag.appendChild(b);
        // document.getElementById("item" + j).innerHTML = "&nbsp&nbsp&nbsp&";
        document.getElementById("item" + i + j).innerHTML = "&nbsp&nbsp&nbsp&nbsp" + li[j].value;
      }
      // } else {
      //     document.getElementById("actionDiv" + i).innerHTML = functionVar;
      // }
    }
    divTag = document.getElementById("instructionTable");
  }
}
/*成就*/
function achievementView(mainDiv) {
  divID = "achievementView";
  divID2 = "equipageBkView";
  divTag = document.getElementById(mainDiv.id);
  b = document.createElement("div");
  b.setAttribute("id", "equipageBkView");
  b.setAttribute("onclick", "clossFunc(\"achievementView\",\"equipageBkView\")");
  divTag.appendChild(b);
  b = document.createElement("div");
  b.setAttribute("id", "achievementView");
  divTag.appendChild(b);
  divTag = document.getElementById("achievementView");
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("id", "clossDiv");
  b.setAttribute("value", "X");
  b.setAttribute("onclick", "clossFunc(\"achievementView\",\"equipageBkView\")");
  divTag.appendChild(b);
  /*b = document.createElement("img");
  b.setAttribute("id","crownImgLeft");
  divTag.appendChild(b);*/
  b = document.createElement("h1");
  b.setAttribute("id", "allTitle");
  divTag.appendChild(b);
  document.getElementById("allTitle").innerHTML = "成就";
  /*b = document.createElement("img");
  b.setAttribute("id","crownImgRight");
  divTag.appendChild(b);*/
  b = document.createElement("table");
  b.setAttribute("id", "achievementTable");
  b.setAttribute("rules", "rows");
  b.setAttribute("border", "1");
  divTag.appendChild(b);
  divTag = document.getElementById("achievementTable");
  for (var i = 0; i < achievemenData.record.length; i++) {
    b = document.createElement("tr");
    b.setAttribute("id", "tr" + i);
    divTag.appendChild(b);
    for (var j = 0; j < 3; j++) {
      divTag = document.getElementById("tr" + i);
      b = document.createElement("td");
      b.setAttribute("id", "row" + i + "col" + j);
      divTag.appendChild(b);
      if (j == 0) {
        divTag = document.getElementById("row" + i + "col" + j);
        b = document.createElement("img");
        b.setAttribute("id", "champtionImg" + i);
        // if (i == 0) {
        //     b.setAttribute("class", "champtionCopper");
        // } else if (i == 1) {
        //     b.setAttribute("class", "champtionSilver");
        // } else {
        //     b.setAttribute("class", "champtionGold");
        // }
        if (achievemenData.record[i].level == 1) {
          b.setAttribute("class", "champtionCopper");
        }
        else if (achievemenData.record[i].level == 2) {
          b.setAttribute("class", "champtionSilver");
        }
        else if (achievemenData.record[i].level == 3) {
          b.setAttribute("class", "champtionGold");
        }
        divTag.appendChild(b);
      } else if (j == 1) {
        divTag = document.getElementById("row" + i + "col" + j);
        b = document.createElement("div");
        b.setAttribute("id", "achievementInnerDiv" + i);
        b.setAttribute("class", "achievementInnerDiv");
        divTag.appendChild(b);
        divTag = document.getElementById("achievementInnerDiv" + i);
        b = document.createElement("h3");
        b.setAttribute("id", "h3Inner" + i);
        divTag.appendChild(b);
        divTag = document.getElementById("h3Inner" + i);
        b = document.createElement("a");
        b.setAttribute("id", "aInner" + i);
        b.setAttribute("href", "#item" + i);
        divTag.appendChild(b);
        // if (i == 0) {
        //     document.getElementById("aInner" + i).innerHTML = "初學者";
        // } else if (i == 1) {
        //     document.getElementById("aInner" + i).innerHTML = "左紐又扭";
        // } else {
        //     document.getElementById("aInner" + i).innerHTML = "????????";
        // }

        // divTag = document.getElementById("achievementInnerDiv" + i);
        // b = document.createElement("p");
        // b.setAttribute("id", "item" + i);
        // divTag.appendChild(b);
        // document.getElementById("item" + i).innerHTML = "通過第二關";

        //////---------------------new-----------------------///////////////
        document.getElementById("aInner" + i).innerHTML = achievemenData.record[i].name
        divTag = document.getElementById("achievementInnerDiv" + i);
        b = document.createElement("p");
        b.setAttribute("id", "item" + i);
        divTag.appendChild(b);
        document.getElementById("item" + i).innerHTML = achievemenData.record[i].value;

      } else {
        divTag = document.getElementById("row" + i + "col" + j);
        b = document.createElement("font");
        b.setAttribute("id", "achievementFont" + i);
        if (i == 0) {
          b.setAttribute("class", "achievementFont");
        } else {
          b.setAttribute("class", "achievementFontDefault");
        }
        divTag.appendChild(b);
        if (i == 0) {
          document.getElementById("achievementFont" + i).innerHTML = "✔";
        } else {
          document.getElementById("achievementFont" + i).innerHTML = "未完成";
        }

      }
    }
    divTag = document.getElementById("achievementTable");
  }
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
