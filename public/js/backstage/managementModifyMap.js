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
var levelNum = localStorage.getItem("gameNumber") - 1;
function back() {
  // var index = 0;
  // var href = window.location.href;
  // for (var i = 0; i < href.length; ++i) {
  //   if (href[i] == '/' || href[i] == "\\") {
  //     index = i;
  //   }
  // }
  // href = href.substr(0, index + 1);
  href = "gameView_text?level=" + (localStorage.getItem("gameNumber")).toString();
  window.location.replace(href);
  console.log(href);
}
var href = window.location.href;
var user, objectData, levelDivAlive = false, isOblivionCreaterOpen;
var swordLevel = 0, shieldLevel = 0, levelUpLevel = 0, musicLevel = 1, bkMusicSwitch, bkMusicVolumn = 0.1, args, gameSpeed, gameNumber;
var musicData;
var scriptData = {
  type: "init"
}
var nowMapData, allMapData;
var mapInformation;
function loadGameMap() {
  $.ajax({
    url: 'loadGameMap',              // 要傳送的頁面
    method: 'POST',               // 使用 POST 方法傳送請求
    dataType: 'json',             // 回傳資料會是 json 格式
    data: {
      gameLevel: levelNum+1
    },  // 將表單資料用打包起來送出去
    success: function (res) {
      console.log(res);
      allMapData = res;
      initMapData(res);
    }
  })
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
    objectData = JSON.parse(this.responseText);
  }
};
xmlhttp.open("GET", "json/oblivionObject.json", true);
xmlhttp.send();


function initMapData(res) {
  var mapData = res.data;
  /*設置版本*/
  divTag = document.getElementById("versionControl");
  for (let index = mapData.length - 1; index > -1; index--) {
    const element = mapData[index];
    var b = document.createElement("span");
    b.setAttribute("onclick", "selectVersion(this)");
    b.innerHTML = element.versionID;
    divTag.appendChild(b);
    if (element.versionID == res.versionID) {
      nowMapData = JSON.parse(JSON.stringify(element));
      mapInformation = JSON.parse(element.map);
      b.style.background = "#E6E6E6";
      lastSelect = b;
      // console.log("nowMapData",nowMapData);
    }
  }
  var innerStr = "";
  for (let index = 0; index < nowMapData.description.mainGrammar.length; index++) {
    const element = nowMapData.description.mainGrammar[index];
    innerStr += element.innerGrammar;
    innerStr += '\n';
  }
  console.log(innerStr);

  $('#levelIntroductionTextarea').val(innerStr);
  $('#levelDescriptionTextarea').val(nowMapData.description.description);
  $('#starConditionTextareaThree').val(mapInformation.winLinit.threeStar[0]);
  $('#starConditionTextareaTwo').val(mapInformation.winLinit.twoStar[0]);


  init_GameMapSetup(mapInformation);


}
function changeMapData(mapVersion) {
  var mapData = allMapData.data;
  for (let index = mapData.length - 1; index > -1; index--) {
    const element = mapData[index];
    if (element.versionID == mapVersion) {
      nowMapData = JSON.parse(JSON.stringify(element));
      mapInformation = JSON.parse(element.map);
    }
  }
  var innerStr = "";
  for (let index = 0; index < nowMapData.description.mainGrammar.length; index++) {
    const element = nowMapData.description.mainGrammar[index];
    innerStr += element.innerGrammar;
    innerStr += '\n';
  }
  console.log(innerStr);

  $('#levelIntroductionTextarea').val(innerStr);
  $('#levelDescriptionTextarea').val(nowMapData.description.description);
  $('#starConditionTextareaThree').val(mapInformation.winLinit.threeStar[0]);
  $('#starConditionTextareaTwo').val(mapInformation.winLinit.twoStar[0]);
  init_GameMapSetup(mapInformation);

}

/*初始化*/
function modifyInit() {
  let tempStr = localStorage.getItem("gameName");
  gameNumber = localStorage.getItem("gameNumber");
  document.getElementById("previewBtn").setAttribute("onclick", "btnClick(" + gameNumber + ")")
  console.log("這裡是關卡數:" + gameNumber);
  var gameNameStr = tempStr.replace(/&nbsp;/g, " ");
  divTag = document.getElementById("levelNameTextarea");
  divTag.value = gameNameStr;
  divTag.setAttribute("readonly", "");
  divTag.style = "background: #CCCCCC; text-align: center;";
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
  try {
    myVid = document.getElementById("bkMusic");
    myVid.volume = --bkMusicSwitch * ((musicLevel) * bkMusicVolumn);
    // myVid.play();
  }
  catch{

  }
  bkMusicSwitch++;
  var userName = document.getElementById("userName");
  var starNumber = document.getElementById("starNumber");
  // var text = user.name;
  userName.textContent = user.name;
  starNumber.textContent = user.starNum;

  for (var i = 1; i < document.getElementById("objectSelect").length; i++) {
    var objectName = document.getElementById("op" + i).value;
    for (var j = 0; j < objectData.oblivionObject.length; j++) {
      // console.log(objectName,objectData.oblivionObject[j].value);
      if (objectName == objectData.oblivionObject[j].value) {
        if (objectData.oblivionObject[j].requirementStar > user.starNum) {
          document.getElementById("op" + i).className = "unUse";
          break;
        }
      }
    }
  }
  // try {
  //   isOblivionCreaterOpen = Session.get("isOblivionCreaterOpen");
  // } catch (e) {
  //   isOblivionCreaterOpen = false;
  // }
  // if (!isOblivionCreaterOpen) {
  //   helper('centerLost');
  // }
  modifyInit();
}
function logout() {
  // console.log("dddddd");
  var href = "/logout";
  window.location.replace(href);
}

//////////////////////////////////////////////////
//              left.js                        //
//////////////////////////////////////////////////
/*小幫手*/
var helperMod = "code"; //code or blocky
function changeHelperMod(mainDiv){
  try {
    divTag = document.getElementById("changeHelperModView");
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
    divTag = document.getElementById("changeHelperModBkView");
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
  } catch (e) { }
  divTag = document.getElementById("centerLost");
  b = document.createElement("div");
  b.setAttribute("id", "changeHelperModBkView");
  b.setAttribute("onclick", "closeFunc(\"changeHelperModView\",\"changeHelperModBkView\")");
  b.setAttribute("class", "bkView");
  divTag.appendChild(b);
  b = document.createElement("div");
  b.setAttribute("id", "changeHelperModView");
  divTag.appendChild(b);

  divTag = document.getElementById("changeHelperModView");
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("id", "blocklyBtn");
  b.setAttribute("value", "積木");
  b.setAttribute("onclick", "changeMod(\"blocky\")");
  divTag.appendChild(b);

  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("id", "codeBtn");
  b.setAttribute("value", "程式");
  b.setAttribute("onclick", "changeMod(\"code\")");
  divTag.appendChild(b);
}
function changeMod(modStr) {
  helperMod = modStr;
  clossFunc("changeHelperModView","changeHelperModBkView");
  helper();
}
function helper() {
  divTag = document.getElementById("helperView");
  try {
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
  } catch { }
  divTag = document.getElementById("helperBkView");
  try {
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
  } catch { }
  divTag = document.getElementById("centerLost");
  b = document.createElement("div");
  b.setAttribute("id", "helperBkView");
  divTag.appendChild(b);
  divTag = document.getElementById("centerLost");
  b = document.createElement("div");
  b.setAttribute("id", "helperView");
  divTag.appendChild(b);
  levelDivAlive = true;
  divTag = document.getElementById("helperView");
  divTag.innerHTML = "";
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("title", "關閉");
  b.setAttribute("id", "clossDiv");
  b.setAttribute("value", "X");
  b.setAttribute("onclick", "closeFunc(\"helperView\",\"helperBkView\")");
  divTag.appendChild(b);
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("title", "儲存");
  b.setAttribute("id", "saveHelper");
  b.setAttribute("value", "儲存");
  divTag.appendChild(b);
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("title", "取消");
  b.setAttribute("id", "cancelSaveHelper");
  b.setAttribute("value", "取消");
  b.setAttribute("onclick", "closeFunc(\"helperView\",\"helperBkView\")");
  divTag.appendChild(b);
  b = document.createElement("h1");
  b.setAttribute("id", "allTitle");
  divTag.appendChild(b);
  document.getElementById("allTitle").innerHTML = "說明";
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("title", "模板一");
  b.setAttribute("id", "method1");
  b.setAttribute("value", "1");
  b.setAttribute("onclick", "changeMethod(1)");
  divTag.appendChild(b);
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("title", "模板二");
  b.setAttribute("id", "method2");
  b.setAttribute("value", "2");
  b.setAttribute("onclick", "changeMethod(2)");
  divTag.appendChild(b);
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("title", "模板三");
  b.setAttribute("id", "method3");
  b.setAttribute("value", "3");
  b.setAttribute("onclick", "changeMethod(3)");
  divTag.appendChild(b);
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("title", "模板四");
  b.setAttribute("id", "method4");
  b.setAttribute("value", "4");
  b.setAttribute("onclick", "changeMethod(4)");
  divTag.appendChild(b);
  b = document.createElement("div");
  b.setAttribute("id", "helperInnerDiv");
  divTag.appendChild(b);
  divTag = document.getElementById("helperInnerDiv");

  var methodNumber = nowMapData.mainCodeDescription.mode;
  if (helperMod == "blocky") {
    methodNumber = nowMapData.mainBlockyDescription.mode;
  }
  console.log(methodNumber);
  if (methodNumber == 2) {
    document.getElementById("saveHelper").setAttribute("onclick", "saveHelper(1)");
    b = document.createElement("textarea");
    b.style.background = "white";
    b.setAttribute("id", "helperTextarea1");
    divTag.appendChild(b);
    /*設定文字塊一*/
    // document.getElementById("helperTextarea1").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea1;
    // var strText = nowMapData.mainCodeDescription.textarea1;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.textarea1;
    }
    else {
      strText = nowMapData.mainBlockyDescription.textarea1;
    }
    console.log(strText);
    if (strText != null) {
      document.getElementById("helperTextarea1").innerHTML = htmlStrChange(strText);
    }

    /*設置圖片一*/
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv1");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv1");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg1");
    b.setAttribute("class", "helperImg");
    // b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img1);
    // var strText = nowMapData.mainCodeDescription.img1;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.img1;
    }
    else {
      strText = nowMapData.mainBlockyDescription.img1;
    }
    console.log(strText);
    if (strText != null) {
      b.setAttribute("src", "img/" + strText);
    }
    else {
      b.style.background = "white";
      b.setAttribute("src", "img/noImage.png");
    }
    divTag.appendChild(b);
    b = document.createElement("br");
    divTag.appendChild(b);

    b = document.createElement("input");
    b.setAttribute("id", "helperImg1Input");
    b.setAttribute("type", "file");
    b.setAttribute("style", "margin-left:15%;");
    b.setAttribute("accept", "image/gif, image/jpeg, image/png");
    b.setAttribute("onchange", "readImgUrl(this,1)");
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv2");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv2");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg2");
    b.setAttribute("class", "helperImg");
    // b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img2);
    // var strText = nowMapData.mainCodeDescription.img2;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.img2;
    }
    else {
      strText = nowMapData.mainBlockyDescription.img2;
    }
    console.log(strText);
    if (strText != null) {
      b.setAttribute("src", "img/" + strText);
    }
    else {
      b.style.background = "white";
      b.setAttribute("src", "img/noImage.png");
    }
    divTag.appendChild(b);
    b = document.createElement("br");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("id", "helperImg2Input");
    b.setAttribute("type", "file");
    b.setAttribute("style", "margin-left:15%;");
    b.setAttribute("accept", "image/gif, image/jpeg, image/png");
    b.setAttribute("onchange", "readImgUrl(this,2)");
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("textarea");
    b.setAttribute("id", "helperTextarea2");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊二*/
    // document.getElementById("helperTextarea2").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea2;
    // var strText = nowMapData.mainCodeDescription.textarea2;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.textarea2;
    }
    else {
      strText = nowMapData.mainBlockyDescription.textarea2;
    }
    console.log(strText);
    if (strText != null) {
      document.getElementById("helperTextarea2").innerHTML = htmlStrChange(strText);
    }
  } else if (methodNumber == 1) {
    document.getElementById("saveHelper").setAttribute("onclick", "saveHelper(1)");
    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("textarea");
    b.setAttribute("id", "helperTextarea3");
    b.style.background = "white";
    divTag.appendChild(b);
    //document.getElementById("helperTextarea3").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea3;
    // var strText = nowMapData.mainCodeDescription.textarea1;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.textarea1;
    }
    else {
      strText = nowMapData.mainBlockyDescription.textarea1;
    }
    console.log(strText);
    if (strText != null) {
      document.getElementById("helperTextarea3").innerHTML = htmlStrChange(strText);;
    }
  } else if (methodNumber == 3) {
    document.getElementById("saveHelper").setAttribute("onclick", "saveHelper(3)");
    b = document.createElement("textarea");
    b.setAttribute("id", "helperTextarea1");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊一*/
    // document.getElementById("helperTextarea1").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea1;
    // var strText = nowMapData.mainCodeDescription.textarea1;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.textarea1;
    }
    else {
      strText = nowMapData.mainBlockyDescription.textarea1;
    }
    console.log(strText);
    if (strText != null) {
      document.getElementById("helperTextarea1").innerHTML = htmlStrChange(strText);
    }

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv1");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv1");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg1");
    b.setAttribute("class", "helperImg");
    // b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img2);
    // var strText = nowMapData.mainCodeDescription.img2;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.img1;
    }
    else {
      strText = nowMapData.mainBlockyDescription.img1;
    }
    console.log(strText);
    if (strText != null) {
      b.setAttribute("src", "img/" + strText);
    }
    else {
      b.style.background = "white";
      b.setAttribute("src", "img/noImage.png");
    }
    divTag.appendChild(b);
    b = document.createElement("br");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("id", "helperImg1Input");
    b.setAttribute("type", "file");
    b.setAttribute("style", "margin-left:15%;");
    b.setAttribute("accept", "image/gif, image/jpeg, image/png");
    b.setAttribute("onchange", "readImgUrl(this,1)");
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv2");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv2");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg2");
    b.setAttribute("class", "helperImg");
    // b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img2);
    // var strText = nowMapData.mainCodeDescription.img2;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.img2;
    }
    else {
      strText = nowMapData.mainBlockyDescription.img2;
    }
    console.log(strText);
    if (strText != null) {
      b.setAttribute("src", "img/" + strText);
    }
    else {
      b.style.background = "white";
      b.setAttribute("src", "img/noImage.png");
    }
    divTag.appendChild(b);
    b = document.createElement("br");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("id", "helperImg2Input");
    b.setAttribute("type", "file");
    b.setAttribute("style", "margin-left:15%;");
    b.setAttribute("accept", "image/gif, image/jpeg, image/png");
    b.setAttribute("onchange", "readImgUrl(this,2)");
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("textarea");
    b.setAttribute("id", "helperTextarea2");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊二*/
    // document.getElementById("helperTextarea2").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea2;
    // var strText = nowMapData.mainCodeDescription.textarea2;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.textarea2;
    }
    else {
      strText = nowMapData.mainBlockyDescription.textarea2;
    }
    console.log(strText);
    if (strText != null) {
      document.getElementById("helperTextarea2").innerHTML = htmlStrChange(strText);
    }
    /*圖片四*/
    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv4");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv4");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg4");
    b.setAttribute("class", "helperImg");
    // b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img4);
    // var strText = nowMapData.mainCodeDescription.img4;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.img4;
    }
    else {
      strText = nowMapData.mainBlockyDescription.img4;
    }
    console.log(strText);
    if (strText != null) {
      b.setAttribute("src", "img/" + strText);
    }
    else {
      b.style.background = "white";
      b.setAttribute("src", "img/noImage.png");
    }
    divTag.appendChild(b);
    b = document.createElement("br");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("id", "helperImg4Input");
    b.setAttribute("type", "file");
    b.setAttribute("style", "margin-left:15%;");
    b.setAttribute("accept", "image/gif, image/jpeg, image/png");
    b.setAttribute("onchange", "readImgUrl(this,4)");
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("textarea");
    b.setAttribute("id", "helperTextarea4");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊四*/
    // document.getElementById("helperTextarea4").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea4;
    // var strText = nowMapData.mainCodeDescription.textarea4;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.textarea4;
    }
    else {
      strText = nowMapData.mainBlockyDescription.textarea4;
    }
    console.log(strText);
    if (strText != null) {
      document.getElementById("helperTextarea4").innerHTML = htmlStrChange(strText);
    }
    /*圖片五*/
    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv5");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv5");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg5");
    b.setAttribute("class", "helperImg");
    // b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img5);
    // var strText = nowMapData.mainCodeDescription.img5;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.img5;
    }
    else {
      strText = nowMapData.mainBlockyDescription.img5;
    }
    console.log(strText);
    if (strText != null) {
      b.setAttribute("src", "img/" + strText);
    }
    else {
      b.style.background = "white";
      b.setAttribute("src", "img/noImage.png");
    }
    divTag.appendChild(b);
    b = document.createElement("br");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("id", "helperImg5Input");
    b.setAttribute("type", "file");
    b.setAttribute("style", "margin-left:15%;");
    b.setAttribute("accept", "image/gif, image/jpeg, image/png");
    b.setAttribute("onchange", "readImgUrl(this,5)");
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("textarea");
    b.setAttribute("id", "helperTextarea5");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊五*/
    // document.getElementById("helperTextarea5").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea5;
    // var strText = nowMapData.mainCodeDescription.textarea5;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.textarea5;
    }
    else {
      strText = nowMapData.mainBlockyDescription.textarea5;
    }
    console.log(strText);
    if (strText != null) {
      document.getElementById("helperTextarea5").innerHTML = htmlStrChange(strText);
    }
    /*圖片六*/
    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv6");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv6");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg6");
    b.setAttribute("class", "helperImg");
    // b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img6);
    // var strText = nowMapData.mainCodeDescription.img6;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.img6;
    }
    else {
      strText = nowMapData.mainBlockyDescription.img6;
    }
    console.log(strText);
    if (strText != null) {
      b.setAttribute("src", "img/" + strText);
    }
    else {
      b.style.background = "white";
      b.setAttribute("src", "img/noImage.png");
    }
    divTag.appendChild(b);
    b = document.createElement("br");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("id", "helperImg6Input");
    b.setAttribute("type", "file");
    b.setAttribute("style", "margin-left:15%;");
    b.setAttribute("accept", "image/gif, image/jpeg, image/png");
    b.setAttribute("onchange", "readImgUrl(this,6)");
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("textarea");
    b.setAttribute("id", "helperTextarea6");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊六*/
    // document.getElementById("helperTextarea6").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea6;
    // var strText = nowMapData.mainCodeDescription.textarea6;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.textarea6;
    }
    else {
      strText = nowMapData.mainBlockyDescription.textarea6;
    }
    console.log(strText);
    if (strText != null) {
      document.getElementById("helperTextarea6").innerHTML = htmlStrChange(strText);
    }
    /*圖片七*/
    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv7");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv7");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg7");
    b.setAttribute("class", "helperImg");
    // b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img7);
    // var strText = nowMapData.mainCodeDescription.img7;
    var strText = "";
    if (helperMod != "blocky") {

      strText = nowMapData.mainCodeDescription.img7;
    }
    else {
      strText = nowMapData.mainBlockyDescription.img7;
    }
    console.log(strText);
    if (strText != null) {
      b.setAttribute("src", "img/" + strText);
    }
    else {
      b.style.background = "white";
      b.setAttribute("src", "img/noImage.png");
    }
    divTag.appendChild(b);
    b = document.createElement("br");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("id", "helperImg7Input");
    b.setAttribute("type", "file");
    b.setAttribute("style", "margin-left:15%;");
    b.setAttribute("accept", "image/gif, image/jpeg, image/png");
    b.setAttribute("onchange", "readImgUrl(this,7)");
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("textarea");
    b.setAttribute("id", "helperTextarea7");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊七*/
    // document.getElementById("helperTextarea7").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea7;
    // var strText = nowMapData.mainCodeDescription.textarea7;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.textarea7;
    }
    else {
      strText = nowMapData.mainBlockyDescription.textarea7;
    }
    console.log(strText);
    if (strText != null) {
      document.getElementById("helperTextarea7").innerHTML = htmlStrChange(strText);
    }

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("textarea");
    b.setAttribute("id", "helperTextarea9");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊九*/
    // document.getElementById("helperTextarea8").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea8;
    // var strText = nowMapData.mainCodeDescription.textarea8;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.textarea8;
    }
    else {
      strText = nowMapData.mainBlockyDescription.textarea8;
    }
    console.log(strText);
    if (strText != null) {
      document.getElementById("helperTextarea9").innerHTML = htmlStrChange(strText);
    }
  } else if (methodNumber == 4) {
    document.getElementById("saveHelper").setAttribute("onclick", "saveHelper(3)");
    b = document.createElement("textarea");
    b.setAttribute("id", "helperTextarea1");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊一*/
    // document.getElementById("helperTextarea1").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea1;
    // var strText = nowMapData.mainCodeDescription.textarea1;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.textarea1;
    }
    else {
      strText = nowMapData.mainBlockyDescription.textarea1;
    }
    console.log(strText);
    if (strText != null) {
      document.getElementById("helperTextarea1").innerHTML = htmlStrChange(strText);
    }

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv1");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv1");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg1");
    b.setAttribute("class", "helperImg");
    // b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img2);
    // var strText = nowMapData.mainCodeDescription.img2;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.img1;
    }
    else {
      strText = nowMapData.mainBlockyDescription.img1;
    }
    console.log(strText);
    if (strText != null) {
      b.setAttribute("src", "img/" + strText);
    }
    else {
      b.style.background = "white";
      b.setAttribute("src", "img/noImage.png");
    }
    divTag.appendChild(b);
    b = document.createElement("br");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("id", "helperImg1Input");
    b.setAttribute("type", "file");
    b.setAttribute("style", "margin-left:15%;");
    b.setAttribute("accept", "image/gif, image/jpeg, image/png");
    b.setAttribute("onchange", "readImgUrl(this,1)");
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv2");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv2");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg2");
    b.setAttribute("class", "helperImg");
    // b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img2);
    // var strText = nowMapData.mainCodeDescription.img2;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.img2;
    }
    else {
      strText = nowMapData.mainBlockyDescription.img2;
    }
    console.log(strText);
    if (strText != null) {
      b.setAttribute("src", "img/" + strText);
    }
    else {
      b.style.background = "white";
      b.setAttribute("src", "img/noImage.png");
    }
    divTag.appendChild(b);
    b = document.createElement("br");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("id", "helperImg2Input");
    b.setAttribute("type", "file");
    b.setAttribute("style", "margin-left:15%;");
    b.setAttribute("accept", "image/gif, image/jpeg, image/png");
    b.setAttribute("onchange", "readImgUrl(this,2)");
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("textarea");
    b.setAttribute("id", "helperTextarea2");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊二*/
    // document.getElementById("helperTextarea2").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea2;
    // var strText = nowMapData.mainCodeDescription.textarea2;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.textarea2;
    }
    else {
      strText = nowMapData.mainBlockyDescription.textarea2;
    }
    console.log(strText);
    if (strText != null) {
      document.getElementById("helperTextarea2").innerHTML = htmlStrChange(strText);
    }
    /*圖片四*/
    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv4");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv4");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg4");
    b.setAttribute("class", "helperImg");
    // b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img4);
    // var strText = nowMapData.mainCodeDescription.img4;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.img4;
    }
    else {
      strText = nowMapData.mainBlockyDescription.img4;
    }
    console.log(strText);
    if (strText != null) {
      b.setAttribute("src", "img/" + strText);
    }
    else {
      b.style.background = "white";
      b.setAttribute("src", "img/noImage.png");
    }
    divTag.appendChild(b);
    b = document.createElement("br");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("id", "helperImg4Input");
    b.setAttribute("type", "file");
    b.setAttribute("style", "margin-left:15%;");
    b.setAttribute("accept", "image/gif, image/jpeg, image/png");
    b.setAttribute("onchange", "readImgUrl(this,4)");
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("textarea");
    b.setAttribute("id", "helperTextarea4");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊四*/
    // document.getElementById("helperTextarea4").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea4;
    // var strText = nowMapData.mainCodeDescription.textarea4;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.textarea4;
    }
    else {
      strText = nowMapData.mainBlockyDescription.textarea4;
    }
    console.log(strText);
    if (strText != null) {
      document.getElementById("helperTextarea4").innerHTML = htmlStrChange(strText);
    }
    /*圖片五*/
    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv5");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv5");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg5");
    b.setAttribute("class", "helperImg");
    // b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img5);
    // var strText = nowMapData.mainCodeDescription.img5;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.img5;
    }
    else {
      strText = nowMapData.mainBlockyDescription.img5;
    }
    console.log(strText);
    if (strText != null) {
      b.setAttribute("src", "img/" + strText);
    }
    else {
      b.style.background = "white";
      b.setAttribute("src", "img/noImage.png");
    }
    divTag.appendChild(b);
    b = document.createElement("br");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("id", "helperImg5Input");
    b.setAttribute("type", "file");
    b.setAttribute("style", "margin-left:15%;");
    b.setAttribute("accept", "image/gif, image/jpeg, image/png");
    b.setAttribute("onchange", "readImgUrl(this,5)");
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("textarea");
    b.setAttribute("id", "helperTextarea5");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊五*/
    // document.getElementById("helperTextarea5").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea5;
    // var strText = nowMapData.mainCodeDescription.textarea5;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.textarea5;
    }
    else {
      strText = nowMapData.mainBlockyDescription.textarea5;
    }
    console.log(strText);
    if (strText != null) {
      document.getElementById("helperTextarea5").innerHTML = htmlStrChange(strText);
    }
    /*圖片六*/
    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv6");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv6");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg6");
    b.setAttribute("class", "helperImg");
    // b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img6);
    // var strText = nowMapData.mainCodeDescription.img6;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.img6;
    }
    else {
      strText = nowMapData.mainBlockyDescription.img6;
    }
    console.log(strText);
    if (strText != null) {
      b.setAttribute("src", "img/" + strText);
    }
    else {
      b.style.background = "white";
      b.setAttribute("src", "img/noImage.png");
    }
    divTag.appendChild(b);
    b = document.createElement("br");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("id", "helperImg6Input");
    b.setAttribute("type", "file");
    b.setAttribute("style", "margin-left:15%;");
    b.setAttribute("accept", "image/gif, image/jpeg, image/png");
    b.setAttribute("onchange", "readImgUrl(this,6)");
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("textarea");
    b.setAttribute("id", "helperTextarea6");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊六*/
    // document.getElementById("helperTextarea6").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea6;
    // var strText = nowMapData.mainCodeDescription.textarea6;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.textarea6;
    }
    else {
      strText = nowMapData.mainBlockyDescription.textarea6;
    }
    console.log(strText);
    if (strText != null) {
      document.getElementById("helperTextarea6").innerHTML = htmlStrChange(strText);
    }
    /*圖片七*/
    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv7");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv7");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg7");
    b.setAttribute("class", "helperImg");
    // b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img7);
    // var strText = nowMapData.mainCodeDescription.img7;
    var strText = "";
    if (helperMod != "blocky") {

      strText = nowMapData.mainCodeDescription.img7;
    }
    else {
      strText = nowMapData.mainBlockyDescription.img7;
    }
    console.log(strText);
    if (strText != null) {
      b.setAttribute("src", "img/" + strText);
    }
    else {
      b.style.background = "white";
      b.setAttribute("src", "img/noImage.png");
    }
    divTag.appendChild(b);
    b = document.createElement("br");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("id", "helperImg7Input");
    b.setAttribute("type", "file");
    b.setAttribute("style", "margin-left:15%;");
    b.setAttribute("accept", "image/gif, image/jpeg, image/png");
    b.setAttribute("onchange", "readImgUrl(this,7)");
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("textarea");
    b.setAttribute("id", "helperTextarea7");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊七*/
    // document.getElementById("helperTextarea7").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea7;
    // var strText = nowMapData.mainCodeDescription.textarea7;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.textarea7;
    }
    else {
      strText = nowMapData.mainBlockyDescription.textarea7;
    }
    console.log(strText);
    if (strText != null) {
      document.getElementById("helperTextarea7").innerHTML = htmlStrChange(strText);
    }

    /*圖片八*/
    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv8");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv8");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg8");
    b.setAttribute("class", "helperImg");
    // b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img7);
    // var strText = nowMapData.mainCodeDescription.img7;
    var strText = "";
    if (helperMod != "blocky") {

      strText = nowMapData.mainCodeDescription.img8;
    }
    else {
      strText = nowMapData.mainBlockyDescription.img8;
    }
    console.log(strText);
    if (strText != null) {
      b.setAttribute("src", "img/" + strText);
    }
    else {
      b.style.background = "white";
      b.setAttribute("src", "img/noImage.png");
    }
    divTag.appendChild(b);
    b = document.createElement("br");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("id", "helperImg8Input");
    b.setAttribute("type", "file");
    b.setAttribute("style", "margin-left:15%;");
    b.setAttribute("accept", "image/gif, image/jpeg, image/png");
    b.setAttribute("onchange", "readImgUrl(this,8)");
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("textarea");
    b.setAttribute("id", "helperTextarea8");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊八*/
    // document.getElementById("helperTextarea7").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea7;
    // var strText = nowMapData.mainCodeDescription.textarea7;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.textarea8;
    }
    else {
      strText = nowMapData.mainBlockyDescription.textarea8;
    }
    console.log(strText);
    if (strText != null) {
      document.getElementById("helperTextarea8").innerHTML = htmlStrChange(strText);
    }


    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("textarea");
    b.setAttribute("id", "helperTextarea9");
    b.style.background = "white";
    divTag.appendChild(b);

    /*設定文字塊八*/
    // document.getElementById("helperTextarea8").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea8;
    // var strText = nowMapData.mainCodeDescription.textarea8;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.textarea9;
    }
    else {
      strText = nowMapData.mainBlockyDescription.textarea9;
    }
    console.log(strText);
    if (strText != null) {
      document.getElementById("helperTextarea9").innerHTML = htmlStrChange(strText);
    }
  }
}
function changeMethod(methodNumber) {
  divTag = document.getElementById("helperView");
  divTag.innerHTML = "";
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("title", "關閉");
  b.setAttribute("id", "clossDiv");
  b.setAttribute("value", "X");
  b.setAttribute("onclick", "closeFunc(\"helperView\",\"helperBkView\")");
  divTag.appendChild(b);
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("title", "儲存");
  b.setAttribute("id", "saveHelper");
  b.setAttribute("value", "儲存");
  divTag.appendChild(b);
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("title", "取消");
  b.setAttribute("id", "cancelSaveHelper");
  b.setAttribute("value", "取消");
  b.setAttribute("onclick", "closeFunc(\"helperView\",\"helperBkView\")");
  divTag.appendChild(b);
  b = document.createElement("h1");
  b.setAttribute("id", "allTitle");
  divTag.appendChild(b);
  document.getElementById("allTitle").innerHTML = "說明";
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("title", "模板一");
  b.setAttribute("id", "method1");
  b.setAttribute("value", "1");
  b.setAttribute("onclick", "changeMethod(1)");
  divTag.appendChild(b);
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("title", "模板二");
  b.setAttribute("id", "method2");
  b.setAttribute("value", "2");
  b.setAttribute("onclick", "changeMethod(2)");
  divTag.appendChild(b);
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("title", "模板三");
  b.setAttribute("id", "method3");
  b.setAttribute("value", "3");
  b.setAttribute("onclick", "changeMethod(3)");
  divTag.appendChild(b);
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("title", "模板四");
  b.setAttribute("id", "method4");
  b.setAttribute("value", "4");
  b.setAttribute("onclick", "changeMethod(4)");
  divTag.appendChild(b);
  b = document.createElement("div");
  b.setAttribute("id", "helperInnerDiv");
  divTag.appendChild(b);
  divTag = document.getElementById("helperInnerDiv");
  if (methodNumber == 2) {
    document.getElementById("saveHelper").setAttribute("onclick", "saveHelper(2)");
    b = document.createElement("textarea");
    b.setAttribute("id", "helperTextarea1");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊一*/
    // document.getElementById("helperTextarea1").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea1;
    // var strText = nowMapData.mainCodeDescription.textarea1;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.textarea1;
    }
    else {
      strText = nowMapData.mainBlockyDescription.textarea1;
    }
    console.log(strText);
    if (strText != null) {
      document.getElementById("helperTextarea1").innerHTML = htmlStrChange(strText);
    }

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv1");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv1");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg1");
    b.setAttribute("class", "helperImg");
    // b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img1);
    // var strText = nowMapData.mainCodeDescription.img1;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.img1;
    }
    else {
      strText = nowMapData.mainBlockyDescription.img1;
    }
    console.log(strText);
    if (strText != null) {
      b.setAttribute("src", "img/" + strText);
    }
    else {
      b.style.background = "white";
      b.setAttribute("src", "img/noImage.png");
    }
    divTag.appendChild(b);
    b = document.createElement("br");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("id", "helperImg1Input");
    b.setAttribute("type", "file");
    b.setAttribute("style", "margin-left:15%;");
    b.setAttribute("accept", "image/gif, image/jpeg, image/png");
    b.setAttribute("onchange", "readImgUrl(this,1)");
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv2");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv2");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg2");
    b.setAttribute("class", "helperImg");
    // b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img2);
    // var strText = nowMapData.mainCodeDescription.img2;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.img2;
    }
    else {
      strText = nowMapData.mainBlockyDescription.img2;
    }
    console.log(strText);
    if (strText != null) {
      b.setAttribute("src", "img/" + strText);
    }
    else {
      b.style.background = "white";
      b.setAttribute("src", "img/noImage.png");
    }
    divTag.appendChild(b);
    b = document.createElement("br");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("id", "helperImg2Input");
    b.setAttribute("type", "file");
    b.setAttribute("style", "margin-left:15%;");
    b.setAttribute("accept", "image/gif, image/jpeg, image/png");
    b.setAttribute("onchange", "readImgUrl(this,2)");
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("textarea");
    b.setAttribute("id", "helperTextarea2");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊二*/
    // document.getElementById("helperTextarea2").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea2;
    // var strText = nowMapData.mainCodeDescription.textarea2;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.textarea2;
    }
    else {
      strText = nowMapData.mainBlockyDescription.textarea2;
    }
    console.log(strText);
    if (strText != null) {
      document.getElementById("helperTextarea2").innerHTML = htmlStrChange(strText);
    }
  } else if (methodNumber == 1) {
    document.getElementById("saveHelper").setAttribute("onclick", "saveHelper(1)");
    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("textarea");
    b.setAttribute("id", "helperTextarea3");
    b.style.background = "white";
    divTag.appendChild(b);
    // document.getElementById("helperTextarea3").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea3;
    // var strText = nowMapData.mainCodeDescription.textarea1;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.textarea1;
    }
    else {
      strText = nowMapData.mainBlockyDescription.textarea1;
    }
    console.log(strText);
    if (strText != null) {
      document.getElementById("helperTextarea3").innerHTML = htmlStrChange(strText);
    }
  } else if (methodNumber == 3) {
    document.getElementById("saveHelper").setAttribute("onclick", "saveHelper(3)");
    b = document.createElement("textarea");
    b.setAttribute("id", "helperTextarea1");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊一*/
    // document.getElementById("helperTextarea1").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea1;
    // var strText = nowMapData.mainCodeDescription.textarea1;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.textarea1;
    }
    else {
      strText = nowMapData.mainBlockyDescription.textarea1;
    }
    console.log(strText);
    if (strText != null) {
      document.getElementById("helperTextarea1").innerHTML = htmlStrChange(strText);
    }
    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv1");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv1");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg1");
    b.setAttribute("class", "helperImg");
    // b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img1);
    // var strText = nowMapData.mainCodeDescription.img1;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.img1;
    }
    else {
      strText = nowMapData.mainBlockyDescription.img1;
    }
    console.log(strText);
    if (strText != null) {
      b.setAttribute("src", "img/" + strText);
    }
    else {
      b.style.background = "white";
      b.setAttribute("src", "img/noImage.png");
    }
    divTag.appendChild(b);
    b = document.createElement("br");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("id", "helperImg1Input");
    b.setAttribute("type", "file");
    b.setAttribute("style", "margin-left:15%;");
    b.setAttribute("accept", "image/gif, image/jpeg, image/png");
    b.setAttribute("onchange", "readImgUrl(this,1)");
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv2");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv2");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg2");
    b.setAttribute("class", "helperImg");
    // b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img2);
    // var strText = nowMapData.mainCodeDescription.img2;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.img2;
    }
    else {
      strText = nowMapData.mainBlockyDescription.img2;
    }
    console.log(strText);
    if (strText != null) {
      b.setAttribute("src", "img/" + strText);
    }
    else {
      b.style.background = "white";
      b.setAttribute("src", "img/noImage.png");
    }
    divTag.appendChild(b);
    b = document.createElement("br");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("id", "helperImg2Input");
    b.setAttribute("type", "file");
    b.setAttribute("style", "margin-left:15%;");
    b.setAttribute("accept", "image/gif, image/jpeg, image/png");
    b.setAttribute("onchange", "readImgUrl(this,2)");
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("textarea");
    b.setAttribute("id", "helperTextarea2");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊二*/
    // document.getElementById("helperTextarea2").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea2;
    // var strText = nowMapData.mainCodeDescription.textarea2;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.textarea2;
    }
    else {
      strText = nowMapData.mainBlockyDescription.textarea2;
    }
    console.log(strText);
    if (strText != null) {
      document.getElementById("helperTextarea2").innerHTML = htmlStrChange(strText);
    }
    /*圖片四*/
    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv4");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv4");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg4");
    b.setAttribute("class", "helperImg");
    // b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img4);
    // var strText = nowMapData.mainCodeDescription.img4;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.img4;
    }
    else {
      strText = nowMapData.mainBlockyDescription.img4;
    }
    console.log(strText);
    if (strText != null) {
      b.setAttribute("src", "img/" + strText);
    }
    else {
      b.style.background = "white";
      b.setAttribute("src", "img/noImage.png");
    }
    divTag.appendChild(b);
    b = document.createElement("br");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("id", "helperImg4Input");
    b.setAttribute("type", "file");
    b.setAttribute("style", "margin-left:15%;");
    b.setAttribute("accept", "image/gif, image/jpeg, image/png");
    b.setAttribute("onchange", "readImgUrl(this,4)");
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("textarea");
    b.setAttribute("id", "helperTextarea4");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊四*/
    // document.getElementById("helperTextarea4").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea4;
    // var strText = nowMapData.mainCodeDescription.textarea4;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.textarea4;
    }
    else {
      strText = nowMapData.mainBlockyDescription.textarea4;
    }
    console.log(strText);
    if (strText != null) {
      document.getElementById("helperTextarea4").innerHTML = htmlStrChange(strText);
    }
    /*圖片五*/
    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv5");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv5");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg5");
    b.setAttribute("class", "helperImg");
    // b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img5);
    // var strText = nowMapData.mainCodeDescription.img5;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.img5;
    }
    else {
      strText = nowMapData.mainBlockyDescription.img5;
    }
    console.log(strText);
    if (strText != null) {
      b.setAttribute("src", "img/" + strText);
    }
    else {
      b.style.background = "white";
      b.setAttribute("src", "img/noImage.png");
    }
    divTag.appendChild(b);
    b = document.createElement("br");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("id", "helperImg5Input");
    b.setAttribute("type", "file");
    b.setAttribute("style", "margin-left:15%;");
    b.setAttribute("accept", "image/gif, image/jpeg, image/png");
    b.setAttribute("onchange", "readImgUrl(this,5)");
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("textarea");
    b.setAttribute("id", "helperTextarea5");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊五*/
    // document.getElementById("helperTextarea5").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea5;
    // var strText = nowMapData.mainCodeDescription.textarea5;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.textarea5;
    }
    else {
      strText = nowMapData.mainBlockyDescription.textarea5;
    }
    console.log(strText);
    if (strText != null) {
      document.getElementById("helperTextarea5").innerHTML = htmlStrChange(strText);
    }
    /*圖片六*/
    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv6");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv6");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg6");
    b.setAttribute("class", "helperImg");
    // b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img6);
    // var strText = nowMapData.mainCodeDescription.img6;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.img6;
    }
    else {
      strText = nowMapData.mainBlockyDescription.img6;
    }
    console.log(strText);
    if (strText != null) {
      b.setAttribute("src", "img/" + strText);
    }
    else {
      b.style.background = "white";
      b.setAttribute("src", "img/noImage.png");
    }
    divTag.appendChild(b);
    b = document.createElement("br");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("id", "helperImg6Input");
    b.setAttribute("type", "file");
    b.setAttribute("style", "margin-left:15%;");
    b.setAttribute("accept", "image/gif, image/jpeg, image/png");
    b.setAttribute("onchange", "readImgUrl(this,6)");
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("textarea");
    b.setAttribute("id", "helperTextarea6");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊六*/
    // document.getElementById("helperTextarea6").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea6;
    // var strText = nowMapData.mainCodeDescription.textarea6;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.textarea6;
    }
    else {
      strText = nowMapData.mainBlockyDescription.textarea6;
    }
    console.log(strText);
    if (strText != null) {
      document.getElementById("helperTextarea6").innerHTML = htmlStrChange(strText);
    }
    /*圖片七*/
    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv7");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv7");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg7");
    b.setAttribute("class", "helperImg");
    // b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img7);
    // var strText = nowMapData.mainCodeDescription.img7;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.img7;
    }
    else {
      strText = nowMapData.mainBlockyDescription.img7;
    }
    console.log(strText);
    if (strText != null) {
      b.setAttribute("src", "img/" + strText);
    }
    else {
      b.style.background = "white";
      b.setAttribute("src", "img/noImage.png");
    }
    divTag.appendChild(b);
    b = document.createElement("br");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("id", "helperImg7Input");
    b.setAttribute("type", "file");
    b.setAttribute("style", "margin-left:15%;");
    b.setAttribute("accept", "image/gif, image/jpeg, image/png");
    b.setAttribute("onchange", "readImgUrl(this,7)");
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("textarea");
    b.setAttribute("id", "helperTextarea7");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊七*/
    // document.getElementById("helperTextarea7").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea7;
    // var strText = nowMapData.mainCodeDescription.textarea7;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.textarea7;
    }
    else {
      strText = nowMapData.mainBlockyDescription.textarea7;
    }
    console.log(strText);
    if (strText != null) {
      document.getElementById("helperTextarea7").innerHTML = htmlStrChange(strText);
    }
    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("textarea");
    b.setAttribute("id", "helperTextarea9");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊九*/
    // document.getElementById("helperTextarea8").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea8;
    // var strText = nowMapData.mainCodeDescription.textarea8;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.textarea8;
    }
    else {
      strText = nowMapData.mainBlockyDescription.textarea8;
    }
    console.log(strText);
    if (strText != null) {
      document.getElementById("helperTextarea9").innerHTML = htmlStrChange(strText);
    }
  }else if (methodNumber == 4) {
    document.getElementById("saveHelper").setAttribute("onclick", "saveHelper(4)");
    b = document.createElement("textarea");
    b.setAttribute("id", "helperTextarea1");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊一*/
    // document.getElementById("helperTextarea1").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea1;
    // var strText = nowMapData.mainCodeDescription.textarea1;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.textarea1;
    }
    else {
      strText = nowMapData.mainBlockyDescription.textarea1;
    }
    console.log(strText);
    if (strText != null) {
      document.getElementById("helperTextarea1").innerHTML = htmlStrChange(strText);
    }
    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv1");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv1");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg1");
    b.setAttribute("class", "helperImg");
    // b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img1);
    // var strText = nowMapData.mainCodeDescription.img1;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.img1;
    }
    else {
      strText = nowMapData.mainBlockyDescription.img1;
    }
    console.log(strText);
    if (strText != null) {
      b.setAttribute("src", "img/" + strText);
    }
    else {
      b.style.background = "white";
      b.setAttribute("src", "img/noImage.png");
    }
    divTag.appendChild(b);
    b = document.createElement("br");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("id", "helperImg1Input");
    b.setAttribute("type", "file");
    b.setAttribute("style", "margin-left:15%;");
    b.setAttribute("accept", "image/gif, image/jpeg, image/png");
    b.setAttribute("onchange", "readImgUrl(this,1)");
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv2");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv2");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg2");
    b.setAttribute("class", "helperImg");
    // b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img2);
    // var strText = nowMapData.mainCodeDescription.img2;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.img2;
    }
    else {
      strText = nowMapData.mainBlockyDescription.img2;
    }
    console.log(strText);
    if (strText != null) {
      b.setAttribute("src", "img/" + strText);
    }
    else {
      b.style.background = "white";
      b.setAttribute("src", "img/noImage.png");
    }
    divTag.appendChild(b);
    b = document.createElement("br");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("id", "helperImg2Input");
    b.setAttribute("type", "file");
    b.setAttribute("style", "margin-left:15%;");
    b.setAttribute("accept", "image/gif, image/jpeg, image/png");
    b.setAttribute("onchange", "readImgUrl(this,2)");
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("textarea");
    b.setAttribute("id", "helperTextarea2");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊二*/
    // document.getElementById("helperTextarea2").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea2;
    // var strText = nowMapData.mainCodeDescription.textarea2;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.textarea2;
    }
    else {
      strText = nowMapData.mainBlockyDescription.textarea2;
    }
    console.log(strText);
    if (strText != null) {
      document.getElementById("helperTextarea2").innerHTML = htmlStrChange(strText);
    }
    /*圖片四*/
    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv4");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv4");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg4");
    b.setAttribute("class", "helperImg");
    // b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img4);
    // var strText = nowMapData.mainCodeDescription.img4;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.img4;
    }
    else {
      strText = nowMapData.mainBlockyDescription.img4;
    }
    console.log(strText);
    if (strText != null) {
      b.setAttribute("src", "img/" + strText);
    }
    else {
      b.style.background = "white";
      b.setAttribute("src", "img/noImage.png");
    }
    divTag.appendChild(b);
    b = document.createElement("br");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("id", "helperImg4Input");
    b.setAttribute("type", "file");
    b.setAttribute("style", "margin-left:15%;");
    b.setAttribute("accept", "image/gif, image/jpeg, image/png");
    b.setAttribute("onchange", "readImgUrl(this,4)");
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("textarea");
    b.setAttribute("id", "helperTextarea4");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊四*/
    // document.getElementById("helperTextarea4").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea4;
    // var strText = nowMapData.mainCodeDescription.textarea4;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.textarea4;
    }
    else {
      strText = nowMapData.mainBlockyDescription.textarea4;
    }
    console.log(strText);
    if (strText != null) {
      document.getElementById("helperTextarea4").innerHTML = htmlStrChange(strText);
    }
    /*圖片五*/
    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv5");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv5");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg5");
    b.setAttribute("class", "helperImg");
    // b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img5);
    // var strText = nowMapData.mainCodeDescription.img5;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.img5;
    }
    else {
      strText = nowMapData.mainBlockyDescription.img5;
    }
    console.log(strText);
    if (strText != null) {
      b.setAttribute("src", "img/" + strText);
    }
    else {
      b.style.background = "white";
      b.setAttribute("src", "img/noImage.png");
    }
    divTag.appendChild(b);
    b = document.createElement("br");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("id", "helperImg5Input");
    b.setAttribute("type", "file");
    b.setAttribute("style", "margin-left:15%;");
    b.setAttribute("accept", "image/gif, image/jpeg, image/png");
    b.setAttribute("onchange", "readImgUrl(this,5)");
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("textarea");
    b.setAttribute("id", "helperTextarea5");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊五*/
    // document.getElementById("helperTextarea5").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea5;
    // var strText = nowMapData.mainCodeDescription.textarea5;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.textarea5;
    }
    else {
      strText = nowMapData.mainBlockyDescription.textarea5;
    }
    console.log(strText);
    if (strText != null) {
      document.getElementById("helperTextarea5").innerHTML = htmlStrChange(strText);
    }
    /*圖片六*/
    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv6");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv6");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg6");
    b.setAttribute("class", "helperImg");
    // b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img6);
    // var strText = nowMapData.mainCodeDescription.img6;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.img6;
    }
    else {
      strText = nowMapData.mainBlockyDescription.img6;
    }
    console.log(strText);
    if (strText != null) {
      b.setAttribute("src", "img/" + strText);
    }
    else {
      b.style.background = "white";
      b.setAttribute("src", "img/noImage.png");
    }
    divTag.appendChild(b);
    b = document.createElement("br");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("id", "helperImg6Input");
    b.setAttribute("type", "file");
    b.setAttribute("style", "margin-left:15%;");
    b.setAttribute("accept", "image/gif, image/jpeg, image/png");
    b.setAttribute("onchange", "readImgUrl(this,6)");
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("textarea");
    b.setAttribute("id", "helperTextarea6");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊六*/
    // document.getElementById("helperTextarea6").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea6;
    // var strText = nowMapData.mainCodeDescription.textarea6;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.textarea6;
    }
    else {
      strText = nowMapData.mainBlockyDescription.textarea6;
    }
    console.log(strText);
    if (strText != null) {
      document.getElementById("helperTextarea6").innerHTML = htmlStrChange(strText);
    }
    /*圖片七*/
    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv7");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv7");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg7");
    b.setAttribute("class", "helperImg");
    // b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img7);
    // var strText = nowMapData.mainCodeDescription.img7;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.img7;
    }
    else {
      strText = nowMapData.mainBlockyDescription.img7;
    }
    console.log(strText);
    if (strText != null) {
      b.setAttribute("src", "img/" + strText);
    }
    else {
      b.style.background = "white";
      b.setAttribute("src", "img/noImage.png");
    }
    divTag.appendChild(b);
    b = document.createElement("br");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("id", "helperImg7Input");
    b.setAttribute("type", "file");
    b.setAttribute("style", "margin-left:15%;");
    b.setAttribute("accept", "image/gif, image/jpeg, image/png");
    b.setAttribute("onchange", "readImgUrl(this,7)");
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("textarea");
    b.setAttribute("id", "helperTextarea7");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊七*/
    // document.getElementById("helperTextarea7").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea7;
    // var strText = nowMapData.mainCodeDescription.textarea7;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.textarea7;
    }
    else {
      strText = nowMapData.mainBlockyDescription.textarea7;
    }
    console.log(strText);
    if (strText != null) {
      document.getElementById("helperTextarea7").innerHTML = htmlStrChange(strText);
    }

    /*圖片八*/
    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv8");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv8");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg8");
    b.setAttribute("class", "helperImg");
    // b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img7);
    // var strText = nowMapData.mainCodeDescription.img7;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.img8;
    }
    else {
      strText = nowMapData.mainBlockyDescription.img8;
    }
    console.log(strText);
    if (strText != null) {
      b.setAttribute("src", "img/" + strText);
    }
    else {
      b.style.background = "white";
      b.setAttribute("src", "img/noImage.png");
    }
    divTag.appendChild(b);
    b = document.createElement("br");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("id", "helperImg8Input");
    b.setAttribute("type", "file");
    b.setAttribute("style", "margin-left:15%;");
    b.setAttribute("accept", "image/gif, image/jpeg, image/png");
    b.setAttribute("onchange", "readImgUrl(this,8)");
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("textarea");
    b.setAttribute("id", "helperTextarea8");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊七*/
    // document.getElementById("helperTextarea7").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea7;
    // var strText = nowMapData.mainCodeDescription.textarea7;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.textarea8;
    }
    else {
      strText = nowMapData.mainBlockyDescription.textarea8;
    }
    console.log(strText);
    if (strText != null) {
      document.getElementById("helperTextarea8").innerHTML = htmlStrChange(strText);
    }


    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("textarea");
    b.setAttribute("id", "helperTextarea9");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊九*/
    // document.getElementById("helperTextarea8").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea8;
    // var strText = nowMapData.mainCodeDescription.textarea8;
    var strText = "";
    if (helperMod != "blocky") {
      strText = nowMapData.mainCodeDescription.textarea9;
    }
    else {
      strText = nowMapData.mainBlockyDescription.textarea9;
    }
    console.log(strText);
    if (strText != null) {
      document.getElementById("helperTextarea9").innerHTML = htmlStrChange(strText);
    }
  }
}
/*儲存小幫手*/
function saveHelper(modelNumber) {
  // remindView("儲存成功");
  console.log(modelNumber);
  
  if (helperMod != "blocky") {
    var postData = nowMapData.mainCodeDescription;
  }
  else {
    var postData = nowMapData.mainBlockyDescription;
  }
  var level = localStorage.getItem("gameNumber");
  postData.mode=modelNumber;
  if (modelNumber == 1) {
    var textarea1 = strChange(document.getElementById("helperTextarea3").value);
    postData.textarea1 = textarea1;
  }
  else if (modelNumber == 2) {
    var textarea1 = strChange(document.getElementById("helperTextarea1").value);
    var textarea2 = strChange(document.getElementById("helperTextarea2").value);
    var imageObj = $("#helperImg1")[0];
    var img1 = imageObj.value ? imageObj.value : new URL(imageObj.src).pathname.substr(5);
    var imageObj = $("#helperImg2")[0];
    var img2 = imageObj.value ? imageObj.value : new URL(imageObj.src).pathname.substr(5);
    postData.textarea1 = textarea1;
    postData.textarea2 = textarea2;
    postData.img1 = img1;
    postData.img2 = img2;
  }
  else if (modelNumber == 3) {
    var textarea1 = strChange(document.getElementById("helperTextarea1").value);
    var textarea2 = strChange(document.getElementById("helperTextarea2").value);
    var textarea4 = strChange(document.getElementById("helperTextarea4").value);
    var textarea5 = strChange(document.getElementById("helperTextarea5").value);
    var textarea6 = strChange(document.getElementById("helperTextarea6").value);
    var textarea7 = strChange(document.getElementById("helperTextarea7").value);
    var textarea8 = strChange(document.getElementById("helperTextarea8").value);
    var imageObj = $("#helperImg1")[0];
    var img1 = imageObj.value ? imageObj.value : new URL(imageObj.src).pathname.substr(5);
    var imageObj = $("#helperImg2")[0];
    var img2 = imageObj.value ? imageObj.value : new URL(imageObj.src).pathname.substr(5);
    var imageObj = $("#helperImg4")[0];
    var img4 = imageObj.value ? imageObj.value : new URL(imageObj.src).pathname.substr(5);
    var imageObj = $("#helperImg5")[0];
    var img5 = imageObj.value ? imageObj.value : new URL(imageObj.src).pathname.substr(5);
    var imageObj = $("#helperImg6")[0];
    var img6 = imageObj.value ? imageObj.value : new URL(imageObj.src).pathname.substr(5);
    var imageObj = $("#helperImg7")[0];
    var img7 = imageObj.value ? imageObj.value : new URL(imageObj.src).pathname.substr(5);
    postData.textarea1 = textarea1;
    postData.textarea2 = textarea2;
    postData.textarea4 = textarea4;
    postData.textarea5 = textarea5;
    postData.textarea6 = textarea6;
    postData.textarea7 = textarea7;
    postData.textarea8 = textarea8;
    postData.img1 = img1;
    postData.img2 = img2;
    postData.img4 = img4;
    postData.img5 = img5;
    postData.img6 = img6;
    postData.img7 = img7;

  }
  else if (modelNumber == 4) {
    var textarea1 = strChange(document.getElementById("helperTextarea1").value);
    var textarea2 = strChange(document.getElementById("helperTextarea2").value);
    var textarea4 = strChange(document.getElementById("helperTextarea4").value);
    var textarea5 = strChange(document.getElementById("helperTextarea5").value);
    var textarea6 = strChange(document.getElementById("helperTextarea6").value);
    var textarea7 = strChange(document.getElementById("helperTextarea7").value);
    var textarea8 = strChange(document.getElementById("helperTextarea8").value);
    var textarea9 = strChange(document.getElementById("helperTextarea9").value);
    var imageObj = $("#helperImg1")[0];
    var img1 = imageObj.value ? imageObj.value : new URL(imageObj.src).pathname.substr(5);
    var imageObj = $("#helperImg2")[0];
    var img2 = imageObj.value ? imageObj.value : new URL(imageObj.src).pathname.substr(5);
    var imageObj = $("#helperImg4")[0];
    var img4 = imageObj.value ? imageObj.value : new URL(imageObj.src).pathname.substr(5);
    var imageObj = $("#helperImg5")[0];
    var img5 = imageObj.value ? imageObj.value : new URL(imageObj.src).pathname.substr(5);
    var imageObj = $("#helperImg6")[0];
    var img6 = imageObj.value ? imageObj.value : new URL(imageObj.src).pathname.substr(5);
    var imageObj = $("#helperImg7")[0];
    var img7 = imageObj.value ? imageObj.value : new URL(imageObj.src).pathname.substr(5);
    var imageObj = $("#helperImg8")[0];
    var img8 = imageObj.value ? imageObj.value : new URL(imageObj.src).pathname.substr(5);
    postData.textarea1 = textarea1;
    postData.textarea2 = textarea2;
    postData.textarea4 = textarea4;
    postData.textarea5 = textarea5;
    postData.textarea6 = textarea6;
    postData.textarea7 = textarea7;
    postData.textarea8 = textarea8;
    postData.textarea9 = textarea9;
    postData.img1 = img1;
    postData.img2 = img2;
    postData.img4 = img4;
    postData.img5 = img5;
    postData.img6 = img6;
    postData.img7 = img7;
    postData.img8 = img8;

  }
  // console.log(postData);
  var mapData = allMapData.data;
  for (let index = mapData.length - 1; index > -1; index--) {
    var element = mapData[index];
    if (element.versionID == allMapData.versionID) {
      if (helperMod != "blocky") {
        element.mainCodeDescription = postData;
      }
      else {
        element.mainBlockyDescription = postData;
      }
      // console.log(allMapData);
      break;
    }
  }
  var objData = JSON.stringify(allMapData);
  var scriptObjData = {
    gameLevel: level-1,
    data: objData
  }
  $.ajax({
    url: 'updateGameMap',              // 要傳送的頁面
    method: 'POST',               // 使用 POST 方法傳送請求
    dataType: 'json',             // 回傳資料會是 json 格式
    data: scriptObjData,  // 將表單資料用打包起來送出去
    success: function (res) {
      console.log(res);
      remindView("儲存成功");
    }
  })
}
/*將字串轉為HTML格式*/
function strChange(textareaStr) {
  textareaStr = textareaStr.replace(/ /g, "&nbsp;");
  textareaStr = textareaStr.replace(/\n/g, "<br>");
  return textareaStr;
}
/*將HTML轉為字串格式*/
function htmlStrChange(textareaStr) {
  textareaStr = textareaStr.replace(/&nbsp;/g, " ");
  textareaStr = textareaStr.replace(/<br>/g, "\n");
  return textareaStr;
}
/*XX按鈕*/
function closeFunc(thisDiv, thisDiv2) {
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
/*讀取圖片*/
function readImgUrl(input, imgId) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      console.log(input.files[0].name);
      data = {
        imgName: input.files[0].name,
        imgData: e.target.result.toString()
      }
      console.log(data);
      $.ajax({
        url: "onloadImg",
        type: 'POST',
        cache: false, //上传文件不需要缓存
        dataType: 'json',
        data: data,
        success: function (res) {
          console.log(res);
          var img = document.getElementById("helperImg" + imgId);
          img.setAttribute("src", e.target.result)
          $("#helperImg" + imgId)[0].value = res.path;
        },
        error: function (data) {
          console.log("上传失败");
        }
      })
    }
    reader.readAsDataURL(input.files[0]);
  }
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
  try {
    divTag = document.getElementById("userDataView");
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
    divTag = document.getElementById("userDataBkView");
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
  } catch (e) { }
  divID = "userDataView";
  divTag = document.getElementById("centerLost");
  b = document.createElement("div");
  b.setAttribute("id", "userDataBkView");
  b.setAttribute("onclick", "closeFunc(\"userDataView\",\"userDataBkView\")");
  divTag.appendChild(b);
  b = document.createElement("div");
  b.setAttribute("id", "userDataView");
  divTag.appendChild(b);
  divTag = document.getElementById("userDataView");
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("title", "關閉");
  b.setAttribute("id", "clossDiv");
  b.setAttribute("value", "X");
  b.setAttribute("onclick", "closeFunc(\"userDataView\",\"userDataBkView\")");
  divTag.appendChild(b);
  createUserView(divID);
}
function closeFunc(thisDiv, thisDiv2) {
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
      var getAchievement = Session.get("getAchievement");
      if (getAchievement == undefined) {
        getAchievement = 0;
        console.log("this is undefine");
      }
      userdataFont = getAchievement + "/9";
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

var thisSelectionId;
var args;
var divTag, level, b;
var lastObject = null;

/*div分頁*/
function clearLinkDot() {
  var i, a, main;
  for (i = 0; (a = document.getElementsByTagName("a")[i]); i++) {
    if (a.getAttribute("onFocus") == null) {
      a.setAttribute("onFocus", "this.blur();");
    } else {
      a.setAttribute("onFocus", a.getAttribute("onFocus") + ";this.blur();");
    }
    a.setAttribute("hideFocus", "hidefocus");
  }
}
function loadTab(obj, n) {
  var layer;
  eval('layer=\'S' + n + '\'');
  //將 Tab 標籤樣式設成 Blur 型態
  var tabsF = document.getElementById('tabsF').getElementsByTagName('li');
  for (var i = 0; i < tabsF.length; i++) {
    tabsF[i].setAttribute('id', null);
    eval('document.getElementById(\'S' + (i + 1) + '\').style.display=\'none\'')
  }
  // editMapterrain
  //變更分頁標題樣式
  obj.parentNode.setAttribute('id', 'current');
  editMapterrain = false;
  if (n == 3) {
    editMapterrain = true;
    console.log(editMapterrain);
  }
  if (n == 4 && user.starNum < objectData.oblivionObject[13].requirementStar) {
    document.getElementById(layer).style.display = 'none';
    console.log("aaa");
    lessRequirement(objectData.oblivionObject[13].requirementStar);
  }
  else if (n == 3 && user.starNum < objectData.oblivionObject[11].requirementStar) {
    document.getElementById(layer).style.display = 'none';
    console.log("bbb");
    lessRequirement(objectData.oblivionObject[11].requirementStar);
  }
  else {
    document.getElementById(layer).style.display = 'inline';
  }


}
function chk(input) {
  for (var i = 0; i < document.form1.c1.length; i++) {
    document.form1.c1[i].checked = false;
  }
  input.checked = true;
  return true;
}

/*select選擇->改變分頁內容*/
function changeObjectAttributes() {
  console.log("123");
  var objectName = document.getElementById("objectSelect").value;
  var tableId = ["enemyTable", "lockAnswerTable", "boxTable"];
  var tableValue = ["enemy", "blueLock", "box"];
  for (var i = 0; i < objectData.oblivionObject.length; i++) {
    if (objectName == objectData.oblivionObject[i].value) {
      if (objectData.oblivionObject[i].requirementStar > user.starNum) {
        document.getElementById("objectSelect").selectedIndex = 0;
        console.log("ccc");
        lessRequirement(objectData.oblivionObject[i].requirementStar);
      }
    }
  }
  for (var i = 0; i < 3; i++) {
    divTag = document.getElementById(tableId[i]);
    console.log(tableValue[i]);
    if (objectName == tableValue[i]) {
      document.getElementById(tableId[i]).style.display = '';
    } else if (objectName == tableId[i]) {
      document.getElementById(tableId[i]).style.display = '';
    } else if (objectName == tableId[i]) {
      document.getElementById(tableId[i]).style.display = '';
    } else {
      document.getElementById(tableId[i]).style.display = 'none';
    }
  }
}

/*設置地圖*/
function settingMap() {
  if (objectData.oblivionObject[11].requirementStar > user.starNum) {
    lessRequirement(objectData.oblivionObject[11].requirementStar);
  } else {
    document.getElementById("settingMapDiv").style.display = '';
  }
}
function unSaveMap() {
  document.getElementById("settingMapDiv").style.display = 'none';
}
function saveMap() {
  document.getElementById("settingMapDiv").style.display = 'none';
}

/*未達成條件*/
function lessRequirement(starNum) {
  divTag = document.getElementById("centerLost");
  b = document.createElement("div");
  b.setAttribute("id", "lessRequirementView");
  divTag.appendChild(b);
  divTag = document.getElementById("lessRequirementView");
  b = document.createElement("h1");
  b.setAttribute("id", "allTitle");
  divTag.appendChild(b);
  document.getElementById("allTitle").innerHTML = "提醒";
  b = document.createElement("h3");
  b.setAttribute("id", "conditionH3Top");
  divTag.appendChild(b);
  document.getElementById("conditionH3Top").innerHTML = "未達成使用條件：";
  b = document.createElement("div");
  b.setAttribute("id", "lessRequirementInnerView");
  divTag.appendChild(b);
  divTag = document.getElementById("lessRequirementInnerView");
  b = document.createElement("table");
  b.setAttribute("id", "conditionTable");
  divTag.appendChild(b);
  divTag = document.getElementById("conditionTable");
  b = document.createElement("tr");
  b.setAttribute("id", "conditionTr");
  divTag.appendChild(b);
  divTag = document.getElementById("conditionTr");
  b = document.createElement("td");
  b.setAttribute("id", "conditionTd0");
  divTag.appendChild(b);
  divTag = document.getElementById("conditionTd0");
  b = document.createElement("img");
  b.setAttribute("id", "conditionImg");
  b.setAttribute("src", "img/star.png");
  divTag.appendChild(b);
  divTag = document.getElementById("conditionTr");
  b = document.createElement("td");
  b.setAttribute("id", "conditionTd1");
  divTag.appendChild(b);
  divTag = document.getElementById("conditionTd1");
  b = document.createElement("h3");
  b.setAttribute("id", "conditionH3Bottom");
  divTag.appendChild(b);
  document.getElementById("conditionH3Bottom").innerHTML = "x" + starNum;
  divTag = document.getElementById("lessRequirementView");
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("id", "conditionButton");
  b.setAttribute("value", "返回");
  b.setAttribute("onclick", "closeFunc(\"lessRequirementView\")");
  divTag.appendChild(b);
}

var levelDivAlive = false;
function remindView(remindValue) {
  var isTwoLine = false;
  for (var i = 0; i < remindValue.length; i++) {
    if (remindValue[i] == "<") {
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
  } catch (e) { }
  divTag = document.getElementById("centerLost");
  b = document.createElement("div");
  b.setAttribute("id", "remindBkView");
  b.setAttribute("onclick", "closeFunc(\"remindView\",\"remindBkView\")");
  b.setAttribute("class", "bkView");
  divTag.appendChild(b);
  b = document.createElement("div");
  if (isTwoLine) {
    b.setAttribute("class", "twoLine");
  } else {
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
  b.setAttribute("id", "remindTrueBtn");
  b.setAttribute("value", "確定");
  b.setAttribute("onclick", "clossFunc(\"remindView\",\"remindBkView\")");
  divTag.appendChild(b);
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
/*儲存地圖*/
function saveModifyMap() {
  divTag = document.getElementById("versionControl");

  let versionNum = allMapData.versionID;
  b = document.createElement("span");
  b.setAttribute("onclick", "selectVersion(this)");
  b.innerHTML = versionNum;

  b.style.background = "#E6E6E6";
  if (lastSelect != null) {
    lastSelect.style.background = "none";
  }
  lastSelect = b;


  divTag.insertBefore(b, divTag.firstChild);


  // divTag.appendChild(b);
}

/*版本控制*/
var lastSelect = null;
function selectVersion(selectValue) {
  if (lastSelect != null && selectValue != lastSelect) {

    console.log("選擇版本號" + selectValue.innerHTML);
    selectValue.style.background = "#E6E6E6";
    lastSelect.style.background = "none";
    lastSelect = selectValue;
    changeMapData(selectValue.innerHTML.toString());

  }
}

/*預覽*/
function btnClick(number) {
  /*主要語法*/
  var mainGrammarTempStr = document.getElementById("levelIntroductionTextarea").value;
  var mainGrammarStr = [];
  mainGrammarStr = mainGrammarTempStr.split("\n");

  /*關卡說明*/
  var levelDescriptionStr = document.getElementById("levelDescriptionTextarea").value;

  var divTag = document.getElementById("centerLost");
  var b;
  var isCheckClicked;
  number++;
  try {
    divTag = document.getElementById("levelDiv");
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
    divTag = document.getElementById("centerLost");
  } catch (e) {
    divTag = document.getElementById("centerLost");
  }
  b = document.createElement("div");
  b.setAttribute("id", "levelDiv");
  divTag.appendChild(b);
  divTag = document.getElementById("levelDiv");
  b = document.createElement("form");
  b.setAttribute("id", "levelForm");
  levelDivAlive = true;
  divTag.appendChild(b);
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("title", "關閉");
  b.setAttribute("id", "clossDiv");
  b.setAttribute("value", "X");
  b.setAttribute("onclick", "closeFunc(\"levelDiv\")");
  divTag.appendChild(b);
  divTag = document.getElementById("levelForm");
  b = document.createElement("h3");
  b.setAttribute("id", "levelDescription");
  b.innerHTML = localStorage.getItem("gameName");
  divTag.appendChild(b);
  /*星星圖*/
  b = document.createElement("div");
  b.setAttribute("id", "startDiv");
  divTag.appendChild(b);
  divTag = document.getElementById("startDiv");
  for (var i = 0; i < 3; i++) {
    b = document.createElement("img");
    b.setAttribute("id", "startImg" + i);
    b.setAttribute("class", "unStartImg");
    divTag.appendChild(b);
  }
  /*將星星預設為三顆滿星*/
  for (var i = 0; i < 3; i++) {
    document.getElementById("startImg" + i).className = "startImg";
  }
  /*主要函式*/
  b = document.createElement("div");
  b.setAttribute("id", "mainGrammar");
  divTag.appendChild(b);
  divTag = document.getElementById("mainGrammar");
  for (var i = 0; i < mainGrammarStr.length; i++) {
    if (mainGrammarStr[i].length > 0) {
      b = document.createElement("div");
      b.setAttribute("class", "innerGrammar");
      b.setAttribute("id", "innerGrammar" + i);
      divTag.appendChild(b);
      b.innerHTML = mainGrammarStr[i];
    }
  }
  b = document.createElement("br");
  divTag.appendChild(b);

  b = document.createElement("br");
  divTag.appendChild(b);

  /*關卡說明*/
  b = document.createElement("textarea");
  b.setAttribute("rows", "20");
  b.setAttribute("cols", "20");
  b.setAttribute("id", "levelDescriptiontextarea");
  b.setAttribute("readonly", "readonly");
  divTag.appendChild(b);
  b.innerHTML = levelDescriptionStr;
  b = document.createElement("br");
  divTag.appendChild(b);

  //number--;
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("id", "historyCode");
  b.setAttribute("value", "查看紀錄");
  divTag.appendChild(b);
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("id", "levelBtn");
  b.setAttribute("value", "進入關卡");
  divTag.appendChild(b);
}
