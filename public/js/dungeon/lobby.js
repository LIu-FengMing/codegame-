var href = window.location.href;
// createLoadingMainView("center");
var user;
var achievemenData;
var scriptData = {
  type: "init"
}
$.ajax({
  url: href, // 要傳送的頁面
  method: 'POST', // 使用 POST 方法傳送請求
  dataType: 'json', // 回傳資料會是 json 格式
  async: false,
  data: scriptData, // 將表單資料用打包起來送出去
  success: function(res) {
    // console.log(res);
    user = res;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        achievemenData = JSON.parse(this.responseText);
        initHome();
      }
    };
    xmlhttp.open("GET", "json/achievement.json", true);
    xmlhttp.send();
  }
})


function initHome() {
  var userName = document.getElementById("userName");
  var starNumber = document.getElementById("starNumber");
  userName.textContent = user.name;
  starNumber.textContent = user.starNum;
}




// -------------------------------------------------
var CurrentMap="map1";//預設為第一張地圖
var app = {
  rooms: function() {
    var socket = io('/lobby'
      /*, {
            transports: ['websocket']
          }*/
    );


    socket.on('connect', function() {

      socket.on('updateRoomsList', function(room) {
        if (room.error != null) {
          var errorMessage = document.getElementById("roomCreateMsg");
          errorMessage.style.color = "red";
          errorMessage.innerHTML = room.error;
        } else {
          updateRoomsList(room.newRoom);
        }
      });


      socket.on("GoToRoom", function(room) {
        document.location.href = "/lobby/" + room._id; //馬上創建馬上進入房間
      });


      $("#createRoom").on('click', function() {
        $("#userDataBkView").toggle();
        $("#roomView").toggle();
        $("#changeRoomBtn").on('click', function() {
          var inputEle = $("#roomnNameInput");
          var roomTitle = inputEle.val().trim();
          if (roomTitle !== '') {
            socket.emit('createRoom', roomTitle,CurrentMap);
            inputEle.val('');
          }
        })
      })


      $("#msg-button").on('click', function() {
        var messageContent = $("#msg-input").val().trim();
        if (messageContent !== '') {
          var message = {
            content: messageContent,
            username: user.username,
            date: Date.now()
          };
          socket.emit('newMessage', message);
          $("#msg-input").val("");
          addMessage(message);
        }
      });



      $(".room-item a").bind("click", function(event) {
        roomId = $(this).attr("id")
        socket.emit("check", roomId);
      });



      socket.on('full', function() {
        alert("人數已滿");
      });


      socket.on('addMessage', function(message) {
        addMessage(message);
      });

      socket.on('RoomPlayerNum', function(room) {
        updateRoomPlayerNum(room);
      });

      socket.on('AllRoomPlayerNum', function(room) {
        room.forEach(function(rooms) {
          updateRoomPlayerNum(rooms);
        });
      });

      socket.on("removeRoom", function(roomId) {
        removeRoom(roomId);
      })


      socket.on("changeRoomStatus", function(room, status) {
        changeRoomStatus(room, status)
      })

    });
  },
}

function updateRoomsList(room) {
  // if ($("#room-table.message")) { //移除還沒創造房間的div
  //   $("#room-table .message").remove();
  // }
  room.title = room.title.length > 25 ? room.title.substr(0, 25) + '...' : room.title; //避免房間名稱過長

  if (room.roomStatus == 0) { // 房間狀態
    TableRoomStatus = "準備中"
  } else {
    TableRoomStatus = "開局中"
  }

  var roomindex = $("#room-table tr").length //房間號碼no.
  var html = `<tr>
                      <td id="room-index">${roomindex}</td>
                      <td>${room.title}</td>
                      <td>${room.CurrentMap}</td>
                      <td id="${room._id}">${room.connections.length}/4</td>
                      <td id="roomStatus${room.roomStatus}"> ${TableRoomStatus}</td>
                      <td class="room-item"><a href="/lobby/${room._id}"><i class="fa fa-gamepad"></i></a></td>
                      </tr>`

  $("#room-table").append(html);
}


function updateRoomPlayerNum(data) {
  $("table").find("tr").find("td").each(function() {
    a = $(this).attr("id");
    if (a == data._id) {
      $(this).text(data.connections.length + "/4");
    }
  });
}

function removeRoom(roomId) {
  $("table").find("tr").find("td").each(function() {
    a = $(this).attr("id");
    if (a == roomId) {
      $(this).parent().remove();
    }
  });

  $("table").find("tr").find("td").each(function(i, val) { //更新房間no.
    b = $(this).attr("id");
    if (b == 'room-index') {
      // console.log(i/6);
      $(this).text(i / 6);
    }
  });
}

function changeRoomStatus(room, status) {

  if (status == 0) { // 房間狀態
    TableRoomStatus = "準備中"
    statusId = 'roomStatus0'
  } else {
    TableRoomStatus = "開局中"
    statusId = 'roomStatus1'
  }


  $("table").find("tr").find("td").each(function() {
    a = $(this).attr("id");
    if (a == room._id) {
      $(this).next().text(TableRoomStatus);
      $(this).next().attr('id', statusId);
    }
  });

}




window.onload = function functionName() { //當頁面載入時，先創建房間的頁面，然後隱藏
  createRoomView();
  $("#userDataBkView").hide();
  $("#roomView").hide();
}

function createRoomView() {
  var html = `<div id="userDataBkView"></div>
              <div id="roomView"></div>
              `

  $("#center").append(html);
  html = `<input type="button" title="關閉" id="closeDiv" value="X">
          <div id="roomNameTitle">創建房間</div>
          <div id="roomNameInnerDiv">房間名稱
          <input type="text" title="房間名稱" id="roomnNameInput">
          </div>
          <div id="roomSelectMap">選擇地圖
          <select id="MapSelectBox">
            <option value="map1">地圖一</option>
            <option value="map2">地圖二</option>
            <option value="map3">地圖三</option>
            <option value="map4">地圖四</option>
          </select>
          </div>
          <div id="changeRoomBtn">創建</div>
          <img class="map-picture" src="/img/地圖照片/map1.png">
          <div id="mapText">地圖簡介</div>
          `
  $("#roomView").append(html);

  $('#MapSelectBox option[value=map1]').attr('selected', 'selected'); //讓下拉式選單預設為設定的地圖

  $("#MapSelectBox").change(function() {
    var mapName = $(this).val();
    CurrentMap = mapName;
    $('.map-picture').attr('src', `/img/地圖照片/${mapName}.png`)
  })

  $("#closeDiv").click(function() {
    $("#userDataBkView").hide();
    $("#roomView").hide();
  });

}

function addMessage(message) {
  message.date = (new Date(message.date)).toLocaleTimeString();
  var html = `<li>
                <div>
                  <span style="font-size:10px;">${message.username}<span>
                  <span style="font-size:10px">(${message.date}):</span>
                  <span style="font-size:10px;">${message.content}<span>
                </div>
              </li>`;


  $("#msg-content").append(html);

  $(".message").animate({
    scrollTop: $('.message')[0].scrollHeight
  }, 1000);

}
function logout() {
  var href = "/logout";
  window.location.replace(href);
}