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
var user,objectData,levelDivAlive=false,isOblivionCreaterOpen;
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
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        objectData = JSON.parse(this.responseText);
    }
};
xmlhttp.open("GET", "json/oblivionObject.json", true);
xmlhttp.send();

/*初始化*/
function modifyInit(){
  let tempStr = localStorage.getItem("gameName");
  console.log("這裡是關卡數:" + localStorage.getItem("gameNumber"));
  var gameNameStr = tempStr.replace(/&nbsp;/g, " ");
  divTag = document.getElementById("levelNameTextarea");
  divTag.value = gameNameStr;
  divTag.setAttribute("readonly","");
  divTag.style = "background: #CCCCCC; text-align: center;";
}
function error() {
    alert("有不當的操作發生");
    window.location.replace(href);

}
function initHome() {
  if(Session.get("bkMusicVolumn") != null && Session.get("bkMusicSwitch") != null && Session.get("musicLevel") != null && Session.get("gameSpeed") != null){
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
  var userName = document.getElementById("userName");
  var starNumber = document.getElementById("starNumber");
  var text = user.name;
  userName.textContent = text;
  starNumber.textContent = user.starNum;

  for(var i=1;i<document.getElementById("objectSelect").length;i++){
    var objectName = document.getElementById("op" + i).value;
    for(var j=0;j<objectData.oblivionObject.length;j++){
      // console.log(objectName,objectData.oblivionObject[j].value);
      if(objectName == objectData.oblivionObject[j].value){
        if(objectData.oblivionObject[j].requirementStar > user.starNum){
          document.getElementById("op" + i).className = "unUse";
          break;
        }
      }
    }
  }
  try{
    isOblivionCreaterOpen = Session.get("isOblivionCreaterOpen");
  }catch(e){
    isOblivionCreaterOpen = false;
  }
  if(!isOblivionCreaterOpen){
    helper('centerLost');
  }
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
function helper(mainDiv) {
  // var thisLevelNum;
  // if(user.starNum < 81){
  //   thisLevelNum = 2;
  // }else if(user.starNum >= 81 && user.starNum < 120){
  //   thisLevelNum = 3;
  // }else if(user.starNum >= 120){
  //   thisLevelNum = 4;
  // }
  // isOblivionCreaterOpen = true;
  // Session.set("isOblivionCreaterOpen", isOblivionCreaterOpen);
  // //var selectMod = mainDescription.oblivionObject[thisLevelNum].mode;
  divID = "equipageView";
  divTag = document.getElementById(mainDiv);
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
  divTag = document.getElementById(mainDiv);
  divTag = document.getElementById("centerLost");
  b = document.createElement("div");
  b.setAttribute("id", "helperBkView");
  divTag.appendChild(b);
  divTag = document.getElementById(mainDiv);
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
  b.setAttribute("onclick", "clossFunc(\"helperView\",\"helperBkView\")");
  divTag.appendChild(b);
  b = document.createElement("h1");
  b.setAttribute("id", "allTitle");
  divTag.appendChild(b);
  document.getElementById("allTitle").style.fontFamily = "DFT_PJ7APGCF";
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
  b = document.createElement("div");
  b.setAttribute("id", "helperInnerDiv");
  divTag.appendChild(b);
  divTag = document.getElementById("helperInnerDiv");
  if (0) {
    b = document.createElement("div");
    b.setAttribute("id", "helperTextarea1");
    divTag.appendChild(b);
    /*設定文字塊一*/
    document.getElementById("helperTextarea1").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea1;

    /*設置圖片一*/
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv1");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv1");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg1");
    b.setAttribute("class", "helperImg");
    b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img1);
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv2");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv2");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg2");
    b.setAttribute("class", "helperImg");
    b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img2);
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperTextarea2");
    divTag.appendChild(b);
    /*設定文字塊二*/
    document.getElementById("helperTextarea2").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea2;
  } else if (1) {
    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperTextarea3");
    b.setAttribute("contenteditable", "true");
    b.style.background = "white";
    divTag.appendChild(b);
    //document.getElementById("helperTextarea3").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea1;
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
  b.setAttribute("onclick", "clossFunc(\"helperView\",\"helperBkView\")");
  divTag.appendChild(b);
  b = document.createElement("h1");
  b.setAttribute("id", "allTitle");
  divTag.appendChild(b);
  document.getElementById("allTitle").style.fontFamily = "DFT_PJ7APGCF";
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
  b = document.createElement("div");
  b.setAttribute("id", "helperInnerDiv");
  divTag.appendChild(b);
  divTag = document.getElementById("helperInnerDiv");
  if (methodNumber == 2) {
    b = document.createElement("div");
    b.setAttribute("id", "helperTextarea1");
    b.setAttribute("contenteditable", "true");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊一*/
    // document.getElementById("helperTextarea1").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea1;

    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv1");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv1");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg1");
    b.setAttribute("class", "helperImg");
    b.style.background = "white";
    b.setAttribute("src", "img/noImage.png");
    divTag.appendChild(b);
    b = document.createElement("br");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("id", "helperImg1Input");
    b.setAttribute("type", "file");
    b.setAttribute("style", "margin-left:15%;");
    b.setAttribute("accept", "image/gif, image/jpeg, image/png");
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv2");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv2");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg2");
    b.setAttribute("class", "helperImg");
    b.style.background = "white";
    b.setAttribute("src", "img/noImage.png");
    divTag.appendChild(b);
    b = document.createElement("br");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("id", "helperImg2Input");
    b.setAttribute("type", "file");
    b.setAttribute("style", "margin-left:15%;");
    b.setAttribute("accept", "image/gif, image/jpeg, image/png");
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperTextarea2");
    b.setAttribute("contenteditable", "true");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊二*/
    // document.getElementById("helperTextarea2").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea2;
  } else if (methodNumber == 1) {
    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperTextarea3");
    b.setAttribute("contenteditable", "true");
    b.style.background = "white";
    divTag.appendChild(b);
    // document.getElementById("helperTextarea3").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea1;
  }else if(methodNumber == 3){
    b = document.createElement("div");
    b.setAttribute("id", "helperTextarea1");
    b.setAttribute("contenteditable", "true");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊一*/
    // document.getElementById("helperTextarea1").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea1;

    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv1");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv1");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg1");
    b.setAttribute("class", "helperImg");
    b.style.background = "white";
    b.setAttribute("src", "img/noImage.png");
    divTag.appendChild(b);
    b = document.createElement("br");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("id", "helperImg1Input");
    b.setAttribute("type", "file");
    b.setAttribute("style", "margin-left:15%;");
    b.setAttribute("accept", "image/gif, image/jpeg, image/png");
    b.setAttribute("onchange","readImgUrl(this)");
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv2");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv2");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg2");
    b.setAttribute("class", "helperImg");
    b.style.background = "white";
    b.setAttribute("src", "img/noImage.png");
    divTag.appendChild(b);
    b = document.createElement("br");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("id", "helperImg2Input");
    b.setAttribute("type", "file");
    b.setAttribute("style", "margin-left:15%;");
    b.setAttribute("accept", "image/gif, image/jpeg, image/png");
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperTextarea2");
    b.setAttribute("contenteditable", "true");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊二*/
    // document.getElementById("helperTextarea2").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea2;

    /*圖片四*/
    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv4");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv4");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg4");
    b.setAttribute("class", "helperImg");
    b.style.background = "white";
    b.setAttribute("src", "img/noImage.png");
    divTag.appendChild(b);
    b = document.createElement("br");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("id", "helperImg4Input");
    b.setAttribute("type", "file");
    b.setAttribute("accept", "image/gif, image/jpeg, image/png");
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperTextarea4");
    b.setAttribute("contenteditable", "true");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊四*/
    // document.getElementById("helperTextarea4").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea4;

    /*圖片五*/
    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv5");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv5");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg5");
    b.setAttribute("class", "helperImg");
    b.style.background = "white";
    b.setAttribute("src", "img/noImage.png");
    divTag.appendChild(b);
    b = document.createElement("br");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("id", "helperImg5Input");
    b.setAttribute("type", "file");
    b.setAttribute("accept", "image/gif, image/jpeg, image/png");
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperTextarea5");
    b.setAttribute("contenteditable", "true");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊五*/
    // document.getElementById("helperTextarea5").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea5;

    /*圖片六*/
    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv6");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv6");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg6");
    b.setAttribute("class", "helperImg");
    b.style.background = "white";
    b.setAttribute("src", "img/noImage.png");
    divTag.appendChild(b);
    b = document.createElement("br");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("id", "helperImg6Input");
    b.setAttribute("type", "file");
    b.setAttribute("accept", "image/gif, image/jpeg, image/png");
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperTextarea6");
    b.setAttribute("contenteditable", "true");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊六*/
    // document.getElementById("helperTextarea6").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea6;

    /*圖片七*/
    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv7");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv7");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg7");
    b.setAttribute("class", "helperImg");
    b.style.background = "white";
    b.setAttribute("src", "img/noImage.png");
    divTag.appendChild(b);
    b = document.createElement("br");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("id", "helperImg7Input");
    b.setAttribute("type", "file");
    b.setAttribute("accept", "image/gif, image/jpeg, image/png");
    divTag.appendChild(b);

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperTextarea7");
    b.setAttribute("contenteditable", "true");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊七*/
    // document.getElementById("helperTextarea7").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea7;

    divTag = document.getElementById("helperInnerDiv");
    b = document.createElement("div");
    b.setAttribute("id", "helperTextarea8");
    b.setAttribute("contenteditable", "true");
    b.style.background = "white";
    divTag.appendChild(b);
    /*設定文字塊八*/
    // document.getElementById("helperTextarea8").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea8;
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
/*讀取圖片*/
function readImgUrl(input){
  console.log(input.value);
  if(input.files && input.files[0]){
    var imageTagID = input.getAttribute("helperImg1");
    var reader = new FileReader();
    reader.onload = function (e) {
      var img = document.getElementById("helperImg1");
      console.log(img);
      img.setAttribute("src", e.target.result)
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
  } catch (e) {}
  divID = "userDataView";
  divTag = document.getElementById("centerLost");
  b = document.createElement("div");
  b.setAttribute("id", "userDataBkView");
  b.setAttribute("onclick", "clossFunc(\"userDataView\",\"userDataBkView\")");
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
  b.setAttribute("onclick", "clossFunc(\"userDataView\",\"userDataBkView\")");
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
  b.setAttribute("id", "userTitle");
  divTag.appendChild(b);
  document.getElementById("userTitle").style.fontFamily = "DFT_PJ7VNOMF";
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
        var getAchievement = Session.get("getAchievement");
        if(getAchievement == undefined){
          getAchievement=0;
          console.log("this is undefine");
        }
        userdataFont = getAchievement + "/9";
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

var thisSelectionId;
var args;
var divTag,level,b;
var lastObject = null;

/*div分頁*/
function clearLinkDot() {
  var i, a, main;
  for(i=0; (a = document.getElementsByTagName("a")[i]); i++) {
    if(a.getAttribute("onFocus")==null) {
      a.setAttribute("onFocus","this.blur();");
    }else{
      a.setAttribute("onFocus",a.getAttribute("onFocus")+";this.blur();");
    }
    a.setAttribute("hideFocus","hidefocus");
  }
}
function loadTab(obj,n){
  var layer;
  eval('layer=\'S'+n+'\'');
  //將 Tab 標籤樣式設成 Blur 型態
  var tabsF=document.getElementById('tabsF').getElementsByTagName('li');
  for (var i=0;i<tabsF.length;i++){
    tabsF[i].setAttribute('id',null);
    eval('document.getElementById(\'S'+(i+1)+'\').style.display=\'none\'')
  }
  editMapterrain
  //變更分頁標題樣式
  obj.parentNode.setAttribute('id','current');
  editMapterrain=false;
  if(n==3){
    editMapterrain=true;
    console.log(editMapterrain);
  }
  if(n == 4 && user.starNum <objectData.oblivionObject[13].requirementStar){
    document.getElementById(layer).style.display='none';
    console.log("aaa");
    lessRequirement(objectData.oblivionObject[13].requirementStar);
  }
  else if(n == 3 && user.starNum <objectData.oblivionObject[11].requirementStar){
    document.getElementById(layer).style.display='none';
    console.log("bbb");
    lessRequirement(objectData.oblivionObject[11].requirementStar);
  }
  else{
    document.getElementById(layer).style.display='inline';
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
  var tableId = ["enemyTable","lockAnswerTable","boxTable"];
  var tableValue = ["enemy","blueLock","box"];
  for(var i=0;i<objectData.oblivionObject.length;i++){
    if(objectName == objectData.oblivionObject[i].value){
      if(objectData.oblivionObject[i].requirementStar > user.starNum){
        document.getElementById("objectSelect").selectedIndex = 0;
        console.log("ccc");
        lessRequirement(objectData.oblivionObject[i].requirementStar);
      }
    }
  }
  for(var i=0;i<3;i++){
    divTag = document.getElementById(tableId[i]);
    console.log(tableValue[i]);
    if(objectName == tableValue[i]){
      document.getElementById(tableId[i]).style.display='';
    }else if(objectName == tableId[i]){
      document.getElementById(tableId[i]).style.display='';
    }else if(objectName == tableId[i]){
      document.getElementById(tableId[i]).style.display='';
    }else{
      document.getElementById(tableId[i]).style.display='none';
    }
  }
}

/*設置地圖*/
function settingMap() {
  if(objectData.oblivionObject[11].requirementStar > user.starNum){
    lessRequirement(objectData.oblivionObject[11].requirementStar);
  }else{
    document.getElementById("settingMapDiv").style.display='';
  }
}
function unSaveMap() {
  document.getElementById("settingMapDiv").style.display='none';
}
function saveMap() {
  document.getElementById("settingMapDiv").style.display='none';
}

/*未達成條件*/
function lessRequirement(starNum){
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
  b.setAttribute("onclick", "clossFunc(\"lessRequirementView\")");
  divTag.appendChild(b);
}

var levelDivAlive=false;
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
  b.setAttribute("id", "remindTrueBtn");
  b.setAttribute("value", "確定");
  b.setAttribute("onclick", "clossFunc(\"remindView\",\"remindBkView\")");
  divTag.appendChild(b);
}

/*儲存地圖*/
var versionNumber = 0;
function saveModifyMap(){
  divTag = document.getElementById("versionControl");
  var d = new Date();
  let year = d.getFullYear();
  var month = d.getMonth()+1;
  var day = d.getDate();
  if(month < 10){
    month = "0" + month;
  }
  if(day < 10){
    day = "0" + day;
  }
  let versionDate = year+ "/" + month + "/" + day;
  console.log(divTag);
  b = document.createElement("span");
  b.setAttribute("onclick", "selectVersion(this)");
  b.innerHTML = "v" + versionNumber + "_" + versionDate;
  divTag.appendChild(b);
  versionNumber++;
}

/*版本控制*/
var lastSelect = null;
function selectVersion(selectValue) {
  selectValue.style.background = "#E6E6E6";
  console.log("選擇版本號"+selectValue.innerHTML);
  if(lastSelect != null){
    lastSelect.style.background = "none";
  }
  lastSelect = selectValue;
}
