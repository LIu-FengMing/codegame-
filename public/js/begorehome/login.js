
var UserName = document.getElementById('UsreName');
var UserPass = document.getElementById('UsrePass');
var loginBtn = document.getElementById('loginBtn');

window.onload=function(){
    var href = new URL( window.location.href);
    let params = href.searchParams;
    if(params.has('token')){
        // console.log("0.0");
        console.log(UserName.value);
        console.log(UserPass.value);
        if(UserName.value&&UserPass.value){
        if(params.get('token')=="IncorrectUsername"){
         
            alert("'使用者帳號'輸入錯誤");
        }
        else if(params.get('token')=="InvalidPassword"){
            alert("'密碼'輸入錯誤");
        }  }
    }
}

function login() {
    call_Login_api();
}
function call_Login_api() {
    var strN = UserName.value;
    var strP = UserPass.value;
    if (UserName.value == "") {
        alert("使用者名稱不能為空");
    }
    else if (strN.indexOf(" ") != -1) {
        alert("使用者名稱有空白字元");
    }
    else if (UserPass.value == "") {
        alert("密碼不能為空");
    }
    else if (strP.indexOf(" ") != -1) {
        alert("密碼有空白字元");
    }
    else {
        var scriptData = {
            username: UserName.value,
            password: UserPass.value,
        }
        console.log(scriptData);
        var href = window.location.href;
        post_to_url(href, scriptData);

    }
}

function forgest() {
    var index = 0;
    var href = window.location.href;
    for (var i = 0; i < href.length; ++i) {
        if (href[i] == '/' || href[i] == "\\") {
            index = i;
        }
    }
    href = href.substr(0, index + 1) + "forgetPass";
    window.location.replace(href);
    console.log(href);
}
function registered() {
    var index = 0;
    var href = window.location.href;
    for (var i = 0; i < href.length; ++i) {
        if (href[i] == '/' || href[i] == "\\") {
            index = i;
        }
    }
    href = href.substr(0, index + 1) + "register";
    window.location.replace(href);
    console.log(href);
}
function post_to_url(path, params, method) {
    method = method || "post"; // Set method to post by default, if not specified.
    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);
    for (var key in params) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", params[key]);

        form.appendChild(hiddenField);
    }
    document.body.appendChild(form);    // Not entirely sure if this is necessary
    form.submit();
}
