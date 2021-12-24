/**
 * Login
 */
function login() {
  username = $("#username").val();
  window.location.href = `/index?username=${username}`;
}

/**
 * Enter to login.
 */
document.onkeydown = function (event) {
  var e = event || window.event || arguments.callee.caller.arguments[0];
  if (e.keyCode === 13) {
    event.preventDefault();
    login();
  }
};
