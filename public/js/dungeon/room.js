window.onload = function functionName() { //當頁面載入時，先創建房間的頁面，然後隱藏
  createMapView();
  $("#userDataBkView").hide();
  $("#map-view").hide();
}



var app = {
  chat: function(roomId, username) {

    var socket = io('/rooms'
      /*, {
            transports: ['websocket']
          }*/
    );

    socket.on('connect', function() {


      socket.emit('join', roomId);

      socket.on('updateUsersList', function(users, i) {
        console.log(users, i);
        updateUsersList(users, i);
      });


      $(".chat-btn").on('click', function(e) {
        var textareaEle = $("textarea[name='message']");
        var messageContent = textareaEle.val().trim();
        if (messageContent !== '') {
          var message = {
            content: messageContent,
            username: username,
            date: Date.now()
          };

          socket.emit('newMessage', roomId, message);
          textareaEle.val('');
          addMessage(message);
        }
      })



      socket.on('removeUser', function(userId) {
        $('.users-list ul').html('');
      });

      socket.on('addMessage', function(message) {
        addMessage(message);
      });


      $(".removeRoom").click(function() {
        socket.emit("removeRoom", roomId);
        document.location.replace("/lobby"); //用replace就不會讓使用者利用返回鍵進入已刪除的房間
      });

      $(".game-btn").click(function() { //按鈕變顏色、變換text
        if ($(this).html() == "開始") {
          $(this).html("準備");
          socket.emit("start", 1, roomId); //玩家狀態--->1是準備中，0是無狀態
          socket.emit("ready", roomId);
        } else {
          $(this).text("開始");
          socket.emit("start", 0, roomId);
          socket.emit("ready", roomId);
        }
      });


      $(".rooms-btn").click(function() { //按鈕變顏色、變換text
        $("#userDataBkView").toggle();
        $("#map-view").toggle();

      });


      socket.on("ready", function(playerId) {
        var player = "#user-" + playerId + " .status" //把按下準備按鈕的玩家的狀態顯示出來
        $(player).toggle();
      })

      socket.on("go", function() {
        document.location.replace("/lobby/" + roomId + "/dungeon");
      })



      $(".map-grid-item").click(function() {
        $("#userDataBkView").toggle();
        $("#map-view").toggle();
        var mapName = $(this).attr("id");
        $('.Room-map-picture').attr('src', `/img/地圖照片/${mapName}.png`)
        $(".map-name").text(mapName);
        socket.emit("MapChange", roomId, mapName);
      });


    })
  }
}

function updateUsersList(user, i) {
  var html = '';
  html = `<li class="clearfix" id="user-${user.userId}">
             <img src="/img/player${i+1}.png" alt="${user.name}" />
             <div class="about">
                <div class="name"> <i class="fa fa-circle online"></i> ${user.name} <span class="status">完成準備</span> </div>
             </div>
          </li>`;

  $('.users-list ul').append(html);
  updateNumOfUsers();
}


function updateNumOfUsers() {
  var num = $('.users-list ul li').length;
  $('.chat-num-users').text(num + " User(s)");
}


function addMessage(message) {
  message.date = (new Date(message.date)).toLocaleTimeString();
  var html = `<div>
                        <div class="message-data">
                          <span class="message-data-name">${message.username}</span>
                          <span class="message-data-time">${message.date}</span>
                        </div>
                        <div class="message my-message" dir="auto">${message.content}</div>
              </div>`;

  $(html).hide().appendTo('.chat-history ').slideDown(500); //顯示效果

  // Keep scroll bar down
  $(".chat-history").animate({
    scrollTop: $('.chat-history')[0].scrollHeight
  }, 1000);
}


function createMapView() {
  var html = `<div id="userDataBkView"></div>
              <div id="map-view"></div>`

  $("#center").append(html);
  html = `      <div class="map-bar">選擇地圖</div>
                <input type="button" title="關閉" id="closeDiv" value="X">
                <div class="map-grid">
                <div class="map-grid-item" id="map1" style="background-image:url(${"/img/地圖照片/map1.png"})"></div>
                <div class="map-grid-item" id="map2" style="background-image:url(${"/img/地圖照片/map2.png"})"></div>
                <div class="map-grid-item" id="map3" style="background-image:url(${"/img/地圖照片/map3.png"})"></div>
                <div class="map-grid-item" id="map4" style="background-image:url(${"/img/地圖照片/map4.png"})"></div>
                </div>
                <div class="map-explanation">
                <div class="map-explanationBar">地圖簡介</div>
                <div class="map-name">map1</div>
                </div>

        `



  $("#map-view").append(html);



  $("#closeDiv").click(function() {
    $("#userDataBkView").hide();
    $("#map-view").hide();
  });
}
