
var UserName = document.getElementById('userName');
var eMail = document.getElementById('userEmail');
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

function forgetPass() {
    call_forgetPass_api();
}
function call_forgetPass_api() {
    var strN = UserName.value;
    var strE = eMail.value;

    if (UserName.value == "") {
        alert("動作失敗\n" + "\"使用者名稱\"不能為空");
    }
    else if (strN.indexOf(" ") != -1) {
        alert("動作失敗\n" + "使用者名稱有空白字元");
    }
    else if (eMail.value == "") {
        alert("動作失敗\n" + "\"信箱\"不能為空");
    }
    else if (strE.indexOf(" ") != -1) {
        alert("動作失敗\n" + "\"信箱\"有空白字元");
    }
    else if (!validateEmail(eMail.value)) {
        alert("動作失敗\n"+"\"信箱\"格式錯誤");
    }
    else {
        var href = window.location.href;
        for (var i = 0; i < href.length; ++i) {
            if (href[i] == '/' || href[i] == "\\") {
                index = i;
            }
        }
        href = href.substr(0, index + 1);
        // alert(href)
        var scriptData = {
            username: UserName.value,
            email: eMail.value,
            homeUrl:href
        }
        console.log(scriptData);
        var href = window.location.href;
        $.ajax({
            url: href,              // 要傳送的頁面
            method: 'POST',               // 使用 POST 方法傳送請求
            dataType: 'json',             // 回傳資料會是 json 格式
            data: scriptData,  // 將表單資料用打包起來送出去
            success: function (res) {
                // alert(res.responce);
                var result = "動作失敗\n";
                if (res.responce == "sucesss") {
                    result = "請收信確認";
                    alert(result);
                    var href = "/login";
                    window.location.replace(href);
                }
                else if (res.responce == "failNamUndifine") {
                    result += "\"使用者\"未被啟用";
                    alert(result);
                }
                else if (res.responce == "failuserisNotEmail") {
                    result += "\"信箱\"錯誤";
                    alert(result);
                }
                else if (res.responce == "failEMailUndifine") {
                    result += "\"信箱\"未被啟用";
                    alert(result);
                }
                else if (res.responce == "fail") {
                    resul+= "未達預期結果,請再試一次";
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
