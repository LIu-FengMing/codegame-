var Name = document.getElementById('Name');
var UserName = document.getElementById('userName');
var eMail = document.getElementById('userEmail');
var UserPass = document.getElementById('Pass');
var UserCheckPass = document.getElementById('checkPass');
// history.pushState("", "page", "");

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

function register() {
    call_Registered_api();
}
function call_Registered_api() {
    var sN = Name.value;
    var strN = UserName.value;
    var strP = UserPass.value;
    var strE = eMail.value;
    var strCP = UserCheckPass.value;
    if (Name.value == "") {
        alert("註冊失敗\n" + "使用者名稱有空白字元");
    }
    else if (sN.indexOf(" ") != -1) {
        alert("註冊失敗\n" + "\"使用者名稱\"不能為空");
    }
    else if (UserName.value == "") {
        alert("註冊失敗\n" + "\"使用者帳號\"不能為空");
    }
    else if (strN.indexOf(" ") != -1) {
        alert("註冊失敗\n" + "使用者帳號有空白字元");
    }
    else if (eMail.value == "") {
        alert("註冊失敗\n" + "\"信箱\"不能為空");
    }
    else if (strE.indexOf(" ") != -1) {
        alert("註冊失敗\n" + "\"信箱\"有空白字元");
    }
    else if (!validateEmail(eMail.value)) {
        alert("註冊失敗\n" + "\"信箱\"格式錯誤");
    }
    else if (UserPass.value == "") {
        alert("註冊失敗\n" + "\"密碼\"不能為空");
    }
    else if (strP.indexOf(" ") != -1) {
        alert("註冊失敗\n" + "\"密碼\"有空白字元");
    }
    else if (UserCheckPass.value == "") {
        alert("註冊失敗\n" + "\"確認密碼\"不能為空");
    }
    else if (strCP.indexOf(" ") != -1) {
        alert("註冊失敗\n" + "\"確認密碼\"有空白字元");
    }
    else if (UserCheckPass.value != UserPass.value) {
        alert("註冊失敗\n" + "\"密碼\"與\"確認密碼\"不同");
    }
    else {
        var scriptData = {
            username: UserName.value,
            password: UserPass.value,
            email: eMail.value,
            name:Name.value
        }
        var href = window.location.href;
        // post_to_url(href,scriptData);
        $.ajax({
            url: href,              // 要傳送的頁面
            method: 'POST',               // 使用 POST 方法傳送請求
            dataType: 'json',             // 回傳資料會是 json 格式
            data: scriptData,  // 將表單資料用打包起來送出去
            success: function(res){
                result = "註冊失敗\n";
                // alert(res.responce );
                if (res.responce == "sucesss") {
                    result = "註冊成功";
                    var href = "/login";
                    window.location.replace(href);
                }
                else if (res.responce == "failRepeatEmail") {
                    result += "\"信箱\"已被使用";
                    alert(result);
                }
                else if (res.responce == "failRepeatName") {
                    result += "\"使用者帳號\"已被使用";
                    alert(result);
                }
            },
        });
    }
}
function validateEmail(email) {
    reg = /^[^\s]+@[^\s]+\.[^\s]{2,3}$/;
    if (reg.test(email)) {
        // alert("E-Mail 格式正確!");
        return true;
    } else {
        // alert("E-Mail 格式錯誤!");
        return false;
    }
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
