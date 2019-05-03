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
var user, equipmentData, achievemenData, dictionaryData, levelDivAlive = false,isOblivionOpen;
var swordLevel = 0, shieldLevel = 0, levelUpLevel = 0, musicLevel = 1, bkMusicSwitch, bkMusicVolumn = 0.1, args, gameSpeed;
var musicData;
var allUserData, completallUserData, oldDisMapNum = 0, playMap = [];

// var scriptData = {
//   type: "init"
// }

// $.ajax({
//   url: href,              // 要傳送的頁面
//   method: 'POST',               // 使用 POST 方法傳送請求
//   dataType: 'json',             // 回傳資料會是 json 格式
//   data: scriptData,  // 將表單資料用打包起來送出去
//   success: function (res) {
//     user = res;

//   }
// })
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
var divTag, level,thisIndex;
var lastObject = null;

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
    console.log(mapIndex);

    if (playMap[mapIndex] == 1) {
      lastObject.style.backgroundColor = "rgb(152, 140, 186)";
    }
    else {
      lastObject.style.backgroundColor = "#F5F5F5";
    }
  }
  thisObject.style.backgroundColor = "#C2C2C2";
  lastObject = thisObject;
  console.log(document.getElementById("td0" + mapIndex + "6").innerHTML);
  if(document.getElementById("td0" + mapIndex + "6").innerHTML == "封鎖"){
    document.getElementById("changeStatus").value = "解除封鎖";
  }else {
    document.getElementById("changeStatus").value = "封鎖";
  }
}
function changeStatus(){
  console.log(document.getElementById("td0" + thisIndex + "6").innerHTML);
  if(document.getElementById("td0" + thisIndex + "6").innerHTML == "封鎖"){
    document.getElementById("td0" + thisIndex + "6").innerHTML = "正常";
    document.getElementById("changeStatus").value = "封鎖";
  }else {
    document.getElementById("td0" + thisIndex + "6").innerHTML = "封鎖";
    document.getElementById("changeStatus").value = "解除封鎖";
  }
}
var levelDivAlive = false;
function remindView(remindValue) {
  divTag = document.getElementById("centerLost");
  if (levelDivAlive) {
    divTag = document.getElementById("remindView");
    try {
      parentObj = divTag.parentNode;
      parentObj.removeChild(divTag);
    } catch (e) { }
    levelDivAlive = false;
    divTag = document.getElementById("centerLost");
  }
  b = document.createElement("div");
  b.setAttribute("id", "remindBkView");
  b.setAttribute("onclick", "clossFunc(\"remindView\",\"remindBkView\")");
  b.setAttribute("class", "bkView");
  divTag.appendChild(b);
  b = document.createElement("div");
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
      console.log(res);
      allUserData = res;
      console.log(allUserData);

      var mapData = [];
      for (let index = 0; index < res.length; index++) {
        var obj = res[index]
        var script = {
          td01: obj.username,
          td02: obj.name,
          td03: obj.email,
          td04: obj.starNum,
          // td05: updateDate,
          // td06: obj.mapIntroduction,
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
  console.log("--playMap---");
  console.log(playMap);
  console.log(scriptData);
  oldDisMapNum = scriptData.length;
  // for (var i = 0; i < scriptData.length; i++) {
  for (var i = 0; i < 20; i++) {
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
    if (playMap[i] == 1) {
      divTag.style.backgroundColor = "rgb(152, 140, 186)";
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
        // document.getElementById("textarea" + i + j).innerHTML = obj.td06;
        document.getElementById("td0" + i + j).innerHTML = "封鎖"
      } else if (j == 1) {/*使用者帳號*/
        // document.getElementById("td0" + i + j).innerHTML = obj.td01;
        document.getElementById("td0" + i + j).innerHTML = "aa";
      } else if (j == 2) {/*使用者名稱*/
        // document.getElementById("td0" + i + j).innerHTML = obj.td02;
        document.getElementById("td0" + i + j).innerHTML = "aa";
      } else if (j == 3) {/*使用者信箱*/
        // document.getElementById("td0" + i + j).innerHTML = obj.td03;
        document.getElementById("td0" + i + j).innerHTML = "karta1335618@gmail.com";
      } else if (j == 4) {/*星星數*/
        // document.getElementById("td0" + i + j).innerHTML = obj.td04;
        document.getElementById("td0" + i + j).innerHTML = "50";
      } else if (j == 5) {/*最高的關卡*/
        // document.getElementById("td0" + i + j).innerHTML = obj.td05;
        document.getElementById("td0" + i + j).innerHTML = "13";
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

var TdNameTable = ["mapName", "requireStar", "author", "avgScoreStr", "updateDate", "mapIntroduction"]
function changeTdNameDisplay() {
  // console.log(tdStatus);
  // console.log(allUserData);
  var index = levelSelect.selectedIndex;
  console.log(index);
  if (index == 0) { //全部
    allUserData = completallUserData.slice(0);
  }
  else { //可遊玩
    allUserData.length = 0;
    for (let indexS = 0; indexS < completallUserData.length; indexS++) {
      const element = completallUserData[indexS];
      if (user.starNum >= element.requireStar) {
        allUserData.push(completallUserData[indexS]);
      }
    }
  }

  // for (let index = 0; index < tdStatus.length; index++) {
  for (let index = tdStatus.length-1; index >-1; index--){
    var item=TdNameTable[index];
    console.log("item:",item);
    console.log("tdStatus[index]:",item);
    if(tdStatus[index]==1){
      allUserData = allUserData.sort(function (a, b) {
        return a[item] > b[item] ? 1 : -1;
       });
    }
    else if(tdStatus[index]==2){
      allUserData = allUserData.sort(function (a, b) {
        return a[item] < b[item] ? 1 : -1;
       });
    }
  }

  console.log(allUserData);

  updateMapData(allUserData)

}




/*選單*/

var levelSelect = document.getElementById("levelSelect");
levelSelect.onchange = function (index) {
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
// function searchFunc() {
//   var a = document.getElementById("searchTextBox");
//   if (a.value == "") {
//     a.className = "search-text";
//     clearSearch();
//   } else {
//     a.className = "searchFocus";
//   }
// }


/*表單更動*/
function updateMapData(res) {
  var mapData = [];
  playMap.length = 0;
  for (let index = 0; index < res.length; index++) {
    var playF = false;
    for (let pfi = 0; pfi < user.finishMapNum.length; pfi++) {
      var item = user.finishMapNum[pfi].mapID;
      if (item == res[index]._id) {
        playF = true;
        playMap.push(1);
        break;
      }
    }
    if (playF == false) {
      playMap.push(0);
    }
    var obj = res[index], check = "X";
    if (obj.check) {
      check = "✔";
    }
    var avgScore = obj.avgScore, avgScoreStr;
    if (avgScore == 0) {
      avgScoreStr = "--/";
    }
    else {
      avgScoreStr = avgScore.toString() + "/";
    }
    if (obj.score.length == 0) {
      avgScoreStr += "--";
    }
    else {
      avgScoreStr += obj.score.length;
    }
    var updateDate;
    var data = new Date(obj.updateDate);
    var year = data.getFullYear(), month = data.getMonth() + 1, day = data.getDate();
    updateDate = year.toString() + "/" + month.toString() + "/" + day.toString();

    var script = {
      td01: obj.mapName,
      td02: obj.requireStar,
      td03: obj.author,
      td04: avgScoreStr,
      td05: updateDate,
      td06: obj.mapIntroduction,
    }
    mapData.push(script);
  }
  console.log(mapData);

  updateLevelTable(mapData);
}
function updateLevelTable(scriptData) {
  // console.log(scriptData);

  // console.log(oldDisMapNum, scriptData.length);

  for (var i = 0; i < scriptData.length; i++) {
    var obj = scriptData[i];
    if (i < oldDisMapNum) {
      document.getElementById("textarea" + i + "6").innerHTML = obj.td06;
      document.getElementById("td0" + i + "1").innerHTML = obj.td01;
      document.getElementById("td0" + i + "2").innerHTML = obj.td02;
      document.getElementById("td0" + i + "3").innerHTML = obj.td03;
      document.getElementById("td0" + i + "4").innerHTML = obj.td04;
      document.getElementById("td0" + i + "5").innerHTML = obj.td05;

      divTag = document.getElementById("lostUserCreateTable" + i);
      if (playMap[i] == 1) {
        divTag.style.backgroundColor = "rgb(152, 140, 186)";
      }
      else {
        divTag.style.backgroundColor = "rgb(153, 204, 255)";
      }

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
      if (playMap[i] == 1) {
        divTag.style.backgroundColor = "rgb(152, 140, 186)";
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
        if (j == 6) {
          divTag = document.getElementById("td0" + i + j);
          b = document.createElement("textarea");
          b.setAttribute("id", "textarea" + i + j);
          b.setAttribute("rows", "1");
          b.setAttribute("onfocus", "blur()");
          divTag.appendChild(b);
          document.getElementById("textarea" + i + j).innerHTML = obj.td06;
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
searchTextBox.onkeydown = function () {
  console.log("search:");
  console.log(searchTextBox.value);
  searchTextBox.className = "searchFocus";
  if (searchTextBox.value.length > 0) {
    allUserData.length = 0;
    for (let indexS = 0; indexS < completallUserData.length; indexS++) {
      const element = completallUserData[indexS];
      if (completallUserData[indexS].author.indexOf(searchTextBox.value) > -1 || completallUserData[indexS].mapName.indexOf(searchTextBox.value) > -1) {
        allUserData.push(completallUserData[indexS]);
      }
    }
  }
  else {
    var index = levelSelect.selectedIndex;
    console.log(index);
    if (index == 0) { //全部
      allUserData = completallUserData.slice(0);
    }
    else { //可遊玩
      allUserData.length = 0;
      for (let indexS = 0; indexS < completallUserData.length; indexS++) {
        const element = completallUserData[indexS];
        if (user.starNum >= element.requireStar) {
          allUserData.push(completallUserData[indexS]);
        }
      }
    }
  }
  updateMapData(allUserData)
}
searchTextBox.onkeyup = function () {
  // console.log("search:");
  // console.log(searchTextBox.value);
  if (searchTextBox.value.length > 0) {
    allUserData.length = 0;
    for (let indexS = 0; indexS < completallUserData.length; indexS++) {
      const element = completallUserData[indexS];
      if (completallUserData[indexS].author.indexOf(searchTextBox.value) > -1 || completallUserData[indexS].mapName.indexOf(searchTextBox.value) > -1) {
        allUserData.push(completallUserData[indexS]);
      }
    }
  }
  else {
    var index = levelSelect.selectedIndex;
    console.log(index);
    if (index == 0) { //全部
      allUserData = completallUserData.slice(0);
    }
    else { //可遊玩
      allUserData.length = 0;
      for (let indexS = 0; indexS < completallUserData.length; indexS++) {
        const element = completallUserData[indexS];
        if (user.starNum >= element.requireStar) {
          allUserData.push(completallUserData[indexS]);
        }
      }
    }
  }
  updateMapData(allUserData)
}
searchTextBox.onchange = function () {
  console.log("happy");
  if (searchTextBox.value == "" || searchTextBox.value.length == 0) {

    clearSearch();
  }
}
function clearSearch() {
  console.log("happy");
  var index = levelSelect.selectedIndex;
  console.log(index);
  if (index == 0) { //全部
    allUserData = completallUserData.slice(0);
  }
  else { //可遊玩
    allUserData.length = 0;
    for (let indexS = 0; indexS < completallUserData.length; indexS++) {
      const element = completallUserData[indexS];
      if (user.starNum >= element.requireStar) {
        allUserData.push(completallUserData[indexS]);
      }
    }
  }
  updateMapData(allUserData)
}
