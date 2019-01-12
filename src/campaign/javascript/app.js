
var headers = document.getElementsByClassName("header"),
    header = headers[0];

window.onscroll = function() { activeHeader() };

window.onload = function() {
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    header.className = "header header--active";
  }
}

function activeHeader() {
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    header.className = "header header--active";
  } else {
    header.className = "header";
  }
}
