/*loading*/
function createLoadingMainView(mainDiv) {
  divTag = document.getElementById(mainDiv);
  b = document.createElement("div");
  b.setAttribute("id", "loadingMainBkView");
  // b.setAttribute("onclick", "closeFunc(\"loadingMainBkView\",\"loadingMainView\")");
  divTag.appendChild(b);
  b = document.createElement("div");
  b.setAttribute("id", "loadingMainView");
  b.setAttribute("class", "loadEffect");
  divTag.appendChild(b);
  divTag = document.getElementById("loadingMainView");
  for (var i = 0; i < 8; i++) {
    b = document.createElement("span");
    divTag.appendChild(b);
  }
}

function closeMainLoadingView() {
  var divTag = document.getElementById("loadingMainView");
  try {
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
  } catch (e) { }
  var divTag = document.getElementById("loadingMainBkView");
  try {
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
  } catch (e) { }
}
var behavior = {
  "username": "",
  "name": "",
  "email": "",
  "startDate": "",
  "endDate": ""
}
$(document).ready(function() {
  behavior = {
    "username": user.username,
    "name":user.name,
    "email":user.email,
    "startDate":new Date()
  }
})

//頁面離開或者瀏覽器關閉的時候給予提示 防止用戶誤操作 離開當前頁面未保存數據可能丟失
window.onbeforeunload = function(event) {
  return beforunload(event);
};

function beforunload(event) {
  behavior.endDate = new Date();
  $.ajax({
    url: "API/createUserLoginState",              // 要傳送的頁面
    method: 'POST',               // 使用 POST 方法傳送請求
    dataType: 'json',             // 回傳資料會是 json 格式
    data: behavior,  // 將表單資料用打包起來送出去
    success: function (res) {
    }
  });
}

/*** * 獲取當前瀏覽器類型 */
function myBrowser() {
  var userAgent = navigator.userAgent; //取得瀏覽器的userAgent字符串

  var isOpera = userAgent.indexOf("Opera") > -1;
  //判斷是否Opera瀏覽器
  if (isOpera) return "Opera";
  //判斷是否Firefox瀏覽器
  if (userAgent.indexOf("Firefox") > -1) return "FF";
  //判斷是否google瀏覽器
  if (userAgent.indexOf("Chrome") > -1) return "Chrome";
  //判斷是否Safari瀏覽器
  if (userAgent.indexOf("Safari") > -1) return "Safari";
  //判斷是否IE瀏覽器
  if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) return "IE";
}
