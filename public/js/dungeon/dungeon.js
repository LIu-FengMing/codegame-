// createLoadingMainView("center");
var href = window.location.href;
var user;
var scriptData = {
  type: "init"
}

$.ajax({
  url: href,
  method: 'POST',
  dataType: 'json',
  async: false,
  data: scriptData,
  success: function(res) {
    user = res;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        achievemenData = JSON.parse(this.responseText);
        initHome();
      }
    };
    xmlhttp.open("GET", "/json/achievement.json", true);
    xmlhttp.send();
  }
})

function initHome(){
	$('#userName').text(user.name);
	$('#starNumber').text(user.starNum);
}

// -------------------------------------------------

		var app = {
			  game: function(roomId) {

			    var socket = io('/game');

			    socket.on('connect', function() {

			      socket.emit('joinGame', roomId);

			      $(".msg-room-open i").on("click", function() {
			        var messageContent = $("#msg-text").val();
			        if (messageContent !== '') {
			          socket.emit('newMessage', roomId, messageContent);
			          $("#msg-text").val('');
			        }
			        //addMessage(messageContent);
			      });

			      socket.on('addMessage', function(message) {
			        addMessage(message);
			      });
                  //動作同步
                  socket.on("action", function(s, u) {
                      decodeOutput = s;
                      player = u;
                      console.log("player :", player);
                      console.log("decode :", decodeOutput);
                      codeOutputTranstionAction();
                  });

			    });


			  }
			}



//--------------------------- 聊天室--------------------------- 
			$('.msg-room').on('click', function() {
			  $('.msg-room-content').animate({
			    height: "toggle",
			    opacity: "toggle"
			  }, "slow");

			  $('.msg-room-input').animate({
			    height: "toggle",
			    opacity: "toggle"
			  }, "slow");

			});




			function addMessage(message) {
			  var html = `<div>${message}</div>`

			  $(html).hide().appendTo('.msg-room-content').slideDown(500); //顯示效果

			  // Keep scroll bar down
			  $('.msg-room-content').animate({
			    scrollTop: $('.msg-room-content')[0].scrollHeight
			  }, 1000);
			}
