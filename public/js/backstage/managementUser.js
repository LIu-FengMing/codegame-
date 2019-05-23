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


function back() {
  var index = 0;
  var href = window.location.href;
  for (var i = 0; i < href.length; ++i) {
    if (href[i] == '/' || href[i] == "\\") {
      index = i;
    }
  }
  href = href.substr(0, index + 1);
  window.location.replace(href);
  console.log(href);
}
var href = window.location.href;
var user, equipmentData, achievemenData, dictionaryData, levelDivAlive = false, isOblivionOpen;
var swordLevel = 0, shieldLevel = 0, levelUpLevel = 0, musicLevel = 1, bkMusicSwitch, bkMusicVolumn = 0.1, args, gameSpeed;
var musicData;

var allUserData, completallUserData, oldDisMapNum = 0;


initHome();


function error() {
  alert("有不當的操作發生");
  window.location.replace(href);

}
function initHome() {
  sendLoadUsernameMap();
}

function logout() {
  // console.log("dddddd");
  var href = "/logout";
  window.location.replace(href);
}
//////////////////////////////////////////////////
//              right.js                        //
//////////////////////////////////////////////////

var thisSelectionId;
var args;
var divTag, level, thisIndex;
var lastObject = null,lastColor;

function selectionLevel(thisObject) {
  var mapIndex = 0;
  thisSelectionId = thisObject.id;
  if (thisSelectionId) {
    mapIndex = parseInt(thisSelectionId.substr("lostUserCreateTable".length));
    thisIndex = mapIndex;
    console.log(thisIndex);
  }
  if (lastObject != null) {
    // console.log(lastObject);
    // console.log(mapIndex);
    lastObject.style.backgroundColor = lastColor;
  }
  lastColor = thisObject.style.backgroundColor;
  thisObject.style.backgroundColor = "#C2C2C2";
  lastObject = thisObject;
  // console.log(document.getElementById("td0" + mapIndex + "6").innerHTML);
  if (document.getElementById("td0" + mapIndex + "6").innerHTML == "封鎖") {
    document.getElementById("changeStatus").style.backgroundImage= "url(../img/unBlockade.png)";
  } else {
    document.getElementById("changeStatus").style.backgroundImage= "url(../img/blockade.png)";
  }
}
function changeStatus() {
  console.log(thisIndex)
  // console.log(document.getElementById("td0" + thisIndex + "6").innerHTML);
  if (thisSelectionId) {
    var userstatus = 0;
    if (document.getElementById("td0" + thisIndex + "6").innerHTML == "封鎖") {
      document.getElementById("td0" + thisIndex + "6").innerHTML = "正常";
      document.getElementById("changeStatus").style.backgroundImage= "url(../img/blockade.png)";
      allUserData[thisIndex].userstatus = 0;
      userstatus = 0
    } else {
      document.getElementById("td0" + thisIndex + "6").innerHTML = "封鎖";
      document.getElementById("changeStatus").style.backgroundImage= "url(../img/unBlockade.png)";
      allUserData[thisIndex].userstatus = 1;
      userstatus = 1
    }

    var scriptData = {
      type: "changeUserStatus",
      userId: allUserData[thisIndex]._id,
      userstatus: userstatus
    }
    console.log(scriptData)
    $.ajax({
      url: href,              // 要傳送的頁面
      method: 'POST',               // 使用 POST 方法傳送請求
      dataType: 'json',             // 回傳資料會是 json 格式
      data: scriptData,  // 將表單資料用打包起來送出去
      success: function (res) {
        console.log(res);

      }
    })

  }
  else {
    remindValue = "請點選一位使用者";
    remindView(remindValue);
  }
}
var levelDivAlive = false;
function remindView(remindValue) {
  var isTwoLine = false;
  for (var i = 0; i < remindValue.length; i++) {
    if(remindValue[i] == "<"){
      isTwoLine = true;
      break;
    }
  }
  try {
    divTag = document.getElementById("remindView");
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
    divTag = document.getElementById("remindBkView");
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
  } catch (e) {}
  divTag = document.getElementById("centerLost");
  b = document.createElement("div");
  b.setAttribute("id", "remindBkView");
  b.setAttribute("onclick", "clossFunc(\"remindView\",\"remindBkView\")");
  b.setAttribute("class", "bkView");
  divTag.appendChild(b);
  b = document.createElement("div");
  if(isTwoLine){
    b.setAttribute("class", "twoLine");
  }else{
    b.setAttribute("class", "oneLine");
  }
  b.setAttribute("id", "remindView");
  divTag.appendChild(b);
  levelDivAlive = true;

  divTag = document.getElementById("remindView");
  b = document.createElement("h2");
  b.setAttribute("id", "remindH2");
  divTag.appendChild(b);
  document.getElementById("remindH2").innerHTML = "";
  document.getElementById("remindH2").innerHTML = remindValue;

  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("title", "關閉");
  b.setAttribute("id", "remindTrueBtn");
  b.setAttribute("value", "確定");
  b.setAttribute("onclick", "clossFunc(\"remindView\",\"remindBkView\")");
  divTag.appendChild(b);
}
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
  if (args.levelName) {
    divTag = document.getElementById("titleFont");
    divTag.innerHTML = "";
    divTag.innerHTML = args.levelName;
  }
}
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


/*建立表格*/
function sendLoadUsernameMap() {
  var scriptData = {
    type: "LoadUser",
  }
  $.ajax({
    url: href,              // 要傳送的頁面
    method: 'POST',               // 使用 POST 方法傳送請求
    dataType: 'json',             // 回傳資料會是 json 格式
    data: scriptData,  // 將表單資料用打包起來送出去
    success: function (res) {
      // console.log(res);
      allUserData = res;
      // console.log(allUserData);
      var mapData = [];
      for (let index = 0; index < res.length; index++) {
        var obj = res[index];
        var hightLevel = Math.max(obj.EasyEmpire.codeHighestLevel, obj.MediumEmpire.HighestLevel) + 1;//0~49 49+1 -->1~50 51
        if (hightLevel == 51) {
          hightLevel = 50;
        }
        allUserData[index].hightLevel = hightLevel;
        var userstatusStr = "正常"
        if (obj.userstatus) {
          userstatusStr = "封鎖"
        }
        else {
          allUserData[index].userstatus = 0;
        }
        var script = {
          td01: obj.username,
          td02: obj.name,
          td03: obj.email,
          td04: obj.starNum,
          td05: allUserData[index].hightLevel,
          td06: userstatusStr
        }
        mapData.push(script);
      }
      completallUserData = allUserData.slice(0);
      createLevelTable(mapData);
    }
  })
}


/*建立表格*/
// window.onload = function createLevelTable(scriptData) {
function createLevelTable(scriptData) {

  console.log(scriptData);
  oldDisMapNum = scriptData.length;
  for (var i = 0; i < scriptData.length; i++) {
    // for (var i = 0; i < 20; i++) {
    var obj = scriptData[i];
    // console.log(td01[i]);
    divTag = document.getElementById("createrDiv");
    b = document.createElement("table");
    b.setAttribute("id", "lostUserCreateTable" + i);
    b.setAttribute("class", "lostUserCreateTable");
    b.setAttribute("border", "5");
    b.setAttribute("RULES", "ALL");
    b.setAttribute("onclick", "selectionLevel(this)");
    divTag.appendChild(b);

    divTag = document.getElementById("lostUserCreateTable" + i);
    if((i%2) == 0){
      divTag.style.backgroundColor = "#F0E0CF";
    }
    b = document.createElement("tr");
    b.setAttribute("id", "tr" + i);
    divTag.appendChild(b);
    divTag = document.getElementById("tr" + i);
    for (var j = 1; j <= 6; j++) {
      b = document.createElement("td");
      b.setAttribute("id", "td0" + i + j);
      b.setAttribute("class", "td0" + j);
      divTag.appendChild(b);
      if (j == 6) {/*使用者狀態*/
        document.getElementById("td0" + i + j).innerHTML = obj.td06;
        // document.getElementById("td0" + i + j).innerHTML = "封鎖"
      } else if (j == 1) {/*使用者帳號*/
        document.getElementById("td0" + i + j).innerHTML = obj.td01;
        // document.getElementById("td0" + i + j).innerHTML = "aa";
      } else if (j == 2) {/*使用者名稱*/
        document.getElementById("td0" + i + j).innerHTML = obj.td02;
        // document.getElementById("td0" + i + j).innerHTML = "aa";
      } else if (j == 3) {/*使用者信箱*/
        document.getElementById("td0" + i + j).innerHTML = obj.td03;
        // document.getElementById("td0" + i + j).innerHTML = "karta1335618@gmail.com";
      } else if (j == 4) {/*星星數*/
        document.getElementById("td0" + i + j).innerHTML = obj.td04;
        // document.getElementById("td0" + i + j).innerHTML = "50";
      } else if (j == 5) {/*最高的關卡*/
        document.getElementById("td0" + i + j).innerHTML = obj.td05;
        // document.getElementById("td0" + i + j).innerHTML = "13";
      }
    }
  }
}


var levelNameStatus = 0, conditionStatus = 0, creatorStatus = 0, evaluateStatus = 0, dateStatus = 0, introductionStatus = 0;
var tdStatus = [0, 0, 0, 0, 0, 0];
function changeTdName(thisObiect) {
  var str = thisObiect.className, s, s2;
  var thisStatus = parseInt(str.substr(str.length - 1, 1)) - 1;
  s = thisObiect.innerHTML;
  // console.log(s2.length);
  if (tdStatus[thisStatus] == 0) {
    // s = thisObiect.innerHTML;
    // console.log(s.length);
    thisObiect.innerHTML = s + "&nbsp▴";
    tdStatus[thisStatus]++;
  } else if (tdStatus[thisStatus] == 1) {
    // s = thisObiect.innerHTML;
    // console.log(s.length);
    s = s.substring(0, s.length - 7);
    // s = s.substring(0,s.length-1);
    thisObiect.innerHTML = s + "&nbsp▾";
    tdStatus[thisStatus]++;
  } else if (tdStatus[thisStatus] == 2) {
    // s = thisObiect.innerHTML;
    // console.log(s.length);
    s = s.substring(0, s.length - 7);
    // s = s.substring(0,s.length-1);
    thisObiect.innerHTML = s;
    tdStatus[thisStatus] = 0;
  }
  changeTdNameDisplay();
}

var TdNameTable = ["username", "name", "email", "starNum", "hightLevel", "userstatus"]
function changeTdNameDisplay() {
  var index = levelSelect.selectedIndex;
  // console.log(index);
  if (index == 0) { //全部
    allUserData = completallUserData.slice(0);
  }
  else if (index == 1) { //封鎖
    allUserData.length = 0;
    for (let indexS = 0; indexS < completallUserData.length; indexS++) {
      if (completallUserData[indexS].userstatus == 1) {
        allUserData.push(completallUserData[indexS]);
      }
    }
  }
  else { //未封鎖
    allUserData.length = 0;
    for (let indexS = 0; indexS < completallUserData.length; indexS++) {
      if (completallUserData[indexS].userstatus == 0) {
        allUserData.push(completallUserData[indexS]);
      }
    }
  }

  for (let index = tdStatus.length - 1; index > -1; index--) {
    var item = TdNameTable[index];
    // console.log("item:",item);
    // console.log("tdStatus[index]:",item);
    if (tdStatus[index] == 1) {
      allUserData = allUserData.sort(function (a, b) {
        return a[item] > b[item] ? 1 : -1;
      });
    }
    else if (tdStatus[index] == 2) {
      allUserData = allUserData.sort(function (a, b) {
        return a[item] < b[item] ? 1 : -1;
      });
    }
  }
  // console.log(allUserData);
  updateMapData(allUserData)

}

/*選單*/
var levelSelect = document.getElementById("levelSelect");
levelSelect.onchange = function (index) {
  changeTdNameDisplay();
}
var selectType = document.getElementById("selectType");
var searchType=0;
var searchTypeTable=["username", "name", "email", "hightLevel", "starNum", "userstatus"];
selectType.onchange = function (index) {
  searchType= selectType.selectedIndex;
  // console.log(searchType);
  // console.log(searchTypeTable[searchType]);
  searchFunc();
}

function searchFunc() {
  // var a = document.getElementById("searchTextBox");
  // if (a.value == "") {
  //   a.className = "search-text";
  //   clearSearch();
  // } else {
  //   a.className = "searchFocus";
  // }
 // console.log("search:up");
  // console.log(searchTextBox.value);
  if (searchTextBox.value.length > 0) {
    allUserData.length = 0;
    for (let indexS = 0; indexS < completallUserData.length; indexS++) {
      // const element = completallUserData[indexS];
      var compareStr=completallUserData[indexS][searchTypeTable[searchType]].toString()
      if (compareStr.indexOf(searchTextBox.value) > -1) {
        allUserData.push(completallUserData[indexS]);
      }
    }
    for (let index = tdStatus.length - 1; index > -1; index--) {
      var item = TdNameTable[index];
      // console.log("item:",item);
      // console.log("tdStatus[index]:",item);
      if (tdStatus[index] == 1) {
        allUserData = allUserData.sort(function (a, b) {
          return a[item] > b[item] ? 1 : -1;
        });
      }
      else if (tdStatus[index] == 2) {
        allUserData = allUserData.sort(function (a, b) {
          return a[item] < b[item] ? 1 : -1;
        });
      }
    }
    updateMapData(allUserData)
  }
  else {
    changeTdNameDisplay();
  }
  // updateMapData(allUserData)

}


/*表單更動*/
function updateMapData(res) {
  var mapData = [];
  for (let index = 0; index < res.length; index++) {
    var obj = res[index]
    var hightLevel = Math.max(obj.EasyEmpire.codeHighestLevel, obj.MediumEmpire.HighestLevel) + 1;//0~49 49+1 -->1~50 51
    if (hightLevel == 51) {
      hightLevel = 50;
    }
    allUserData[index].hightLevel = hightLevel;
    var userstatusStr = "正常"
    if (obj.userstatus) {
      userstatusStr = "封鎖"
    }
    else {
      allUserData[index].userstatus = 0;
    }
    var script = {
      td01: obj.username,
      td02: obj.name,
      td03: obj.email,
      td04: obj.starNum,
      td05: allUserData[index].hightLevel,
      td06: userstatusStr
    }
    mapData.push(script);
  }
  console.log(mapData);
  updateLevelTable(mapData);
}
function updateLevelTable(scriptData) {
  for (var i = 0; i < scriptData.length; i++) {
    var obj = scriptData[i];
    if (i < oldDisMapNum) {
      document.getElementById("td0" + i + "6").innerHTML = obj.td06;
      document.getElementById("td0" + i + "1").innerHTML = obj.td01;
      document.getElementById("td0" + i + "2").innerHTML = obj.td02;
      document.getElementById("td0" + i + "3").innerHTML = obj.td03;
      document.getElementById("td0" + i + "4").innerHTML = obj.td04;
      document.getElementById("td0" + i + "5").innerHTML = obj.td05;

      divTag = document.getElementById("lostUserCreateTable" + i);
      if((i%2) == 0){
        divTag.style.backgroundColor = "#F0E0CF";
      }
      // divTag.style.backgroundColor = "#F5F5F5";
      // divTag.style.backgroundColor = "rgb(153, 204, 255)";
    }
    else {
      // console.log(td01[i]);
      divTag = document.getElementById("createrDiv");
      b = document.createElement("table");
      b.setAttribute("id", "lostUserCreateTable" + i);
      b.setAttribute("class", "lostUserCreateTable");
      b.setAttribute("border", "5");
      b.setAttribute("RULES", "ALL");
      b.setAttribute("onclick", "selectionLevel(this)");
      divTag.appendChild(b);

      divTag = document.getElementById("lostUserCreateTable" + i);

      b = document.createElement("tr");
      b.setAttribute("id", "tr" + i);
      divTag.appendChild(b);
      divTag = document.getElementById("tr" + i);
      for (var j = 1; j <= 6; j++) {
        b = document.createElement("td");
        b.setAttribute("id", "td0" + i + j);
        b.setAttribute("class", "td0" + j);
        divTag.appendChild(b);
        if (j == 6) {
          divTag = document.getElementById("td0" + i + j);
          b = document.createElement("textarea");
          b.setAttribute("id", "textarea" + i + j);
          b.setAttribute("rows", "1");
          b.setAttribute("onfocus", "blur()");
          divTag.appendChild(b);
          document.getElementById("td0" + i + j).innerHTML = obj.td06;
          divTag = document.getElementById("tr" + i);
        } else if (j == 1) {
          document.getElementById("td0" + i + j).innerHTML = obj.td01;
        } else if (j == 2) {
          document.getElementById("td0" + i + j).innerHTML = obj.td02;
        } else if (j == 3) {
          document.getElementById("td0" + i + j).innerHTML = obj.td03;
        } else if (j == 4) {
          document.getElementById("td0" + i + j).innerHTML = obj.td04;
        } else if (j == 5) {
          document.getElementById("td0" + i + j).innerHTML = obj.td05;
        }
      }

    }
  }
  if (scriptData.length < oldDisMapNum) {
    for (var ssi = scriptData.length; ssi < oldDisMapNum; ssi++) {
      divTag = document.getElementById("lostUserCreateTable" + ssi.toString());
      parentObj = divTag.parentNode;
      parentObj.removeChild(divTag);

    }
  }
  oldDisMapNum = scriptData.length

}

var searchTextBox = document.getElementById("searchTextBox");
// searchTextBox.onkeydown = function () {
  // searchFunc();
// }
searchTextBox.onkeyup = function () {
  searchFunc();
}
searchTextBox.onchange = function () {
  if (searchTextBox.value == "" || searchTextBox.value.length == 0) {
    clearSearch();
  }
}


function clearSearch() {
  changeTdNameDisplay();
  // var index = levelSelect.selectedIndex;
  // console.log(index);
  // if (index == 0) { //全部
  //   allUserData = completallUserData.slice(0);
  // }
  // else { //可遊玩
  //   allUserData.length = 0;
  //   for (let indexS = 0; indexS < completallUserData.length; indexS++) {
  //     const element = completallUserData[indexS];
  //     if (user.starNum >= element.requireStar) {
  //       allUserData.push(completallUserData[indexS]);
  //     }
  //   }
  // }
  // updateMapData(allUserData)
}
