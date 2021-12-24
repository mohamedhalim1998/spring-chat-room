/**
 * WebSocket Client
 *
 * 1、WebSocket client receive messages with callback. example：webSocket.onmessage
 * 2、WebSocket client send message to server. example：webSocket.send();
 */
function getWebSocket() {
  /**
   * WebSocket client PS：URL shows WebSocket protocal, port number, and then end point.
   */
  var webSocket = new WebSocket(
    /*[[${webSocketUrl}]]*/ "ws://localhost:8080/chat"
  );
  /**
   * websocket open connection.
   */
  webSocket.onopen = function (event) {
    console.log("WebSocket open connection");

    webSocket.send(
      JSON.stringify({
        msg: $("#username").text() + " joined the room",
        type: "CONNECT",
      })
    );
  };

  /**
   * Server send 1) broadcast message, 2) online users.
   */
  webSocket.onmessage = function (event) {
    console.log("WebSocket Receives：%c" + event.data, "color:green");
    //Receive Message from Server
    var message = JSON.parse(event.data) || {};
    var $messageContainer = $(".message-container");
    console.log(message.type);
    if (message.type == "SPEAK") {
      $messageContainer.append(
        '<div class="mdui-card" style="margin: 10px 0;">' +
          '<div class="mdui-card-primary">' +
          '<div class="mdui-card-content message-content">' +
          message.username +
          "：" +
          message.msg +
          "</div>" +
          "</div></div>"
      );
    } else {
      $(".chat-num").text(message.onlineCount);
      if (message.type == "CONNECT") {
        $messageContainer.append(
          '<div class="mdui-card mdui-text-color-green" style="margin: 10px 0;padding: 8px">' +
            '<div class="message-content">' +
            message.msg +
            "</div></div>"
        );
      } else {
        $messageContainer.append(
          '<div class="mdui-card mdui-text-color-red" style="margin: 10px 0;padding: 8px">' +
            '<div class="message-content">' +
            message.msg +
            "</div></div>"
        );
      }
    }
    var $cards = $messageContainer.children(".mdui-card:visible").toArray();
    if ($cards.length > 10) {
      $cards.forEach(function (item, index) {
        index < $cards.length - 5 && $(item).slideUp("fast");
      });
    }
  };

  /**
   * Close connection
   */
  webSocket.onclose = function (event) {
    console.log("WebSocket close connection.");
  };

  /**
   * Exception
   */
  webSocket.onerror = function (event) {
    console.log("WebSocket exception.");
  };
  return webSocket;
}

var webSocket = getWebSocket();

/**
 * Send messages to server use webSocket.
 */
function sendMsgToServer() {
  var $message = $("#msg");
  if ($message.val()) {
    webSocket.send(
      JSON.stringify({
        username: $("#username").text(),
        msg: $message.val(),
        type: "SPEAK",
      })
    );
    $message.val(null);
  }
}

/**
 * Clear screen
 */
function clearMsg() {
  $(".message-container").empty();
}

function closeSocket() {
  webSocket.send(
    JSON.stringify({
      msg: $("#username").text() + " left the room",
      type: "DISCONNECT",
    })
  );
  webSocket.close();
}

/**
 * Enter to send message.
 */
document.onkeydown = function (event) {
  var e = event || window.event || arguments.callee.caller.arguments[0];
  e.keyCode === 13 && sendMsgToServer();
};
