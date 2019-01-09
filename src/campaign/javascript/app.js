
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

function closePlayer(player, fullscreen) {
  if (fullscreen) {
    player.fullscreen.exit();
  }
  player.stop();
}


var plyr1 = document.getElementById('player-1'),
  plyr2 = document.getElementById('player-2');

if (plyr1 && plyr2) {

  var player1 = new Plyr(plyr1),
    play1 = document.getElementById('play-mobile-1'),
    play1dt = document.getElementById('play-desktop-1'),
    close1 = document.getElementById('close-mobile-1'),
    close1dt = document.getElementById('close-desktop-1');

  var player2 = new Plyr(plyr2),
    play2 = document.getElementById('play-mobile-2'),
    play2dt = document.getElementById('play-desktop-2'),
    close2 = document.getElementById('close-mobile-2'),
    close2dt = document.getElementById('close-desktop-2');

  play1.addEventListener("click", function (e) {
    player1.play();
    player1.fullscreen.enter();
    e.preventDefault();
  });

  play1dt.addEventListener("click", function (e) {
    player1.play();
    e.preventDefault();
  });

  close1.addEventListener("click", this.closePlayer.bind(this, player1, true));
  close1.addEventListener("touchstart", this.closePlayer.bind(this, player1, true));

  close1dt.addEventListener("click", function (e) {
    player1.stop();
    e.preventDefault();
  });

  play2.addEventListener("click", function (e) {
    player2.play();
    player2.fullscreen.enter();
    e.preventDefault();
  });

  play2dt.addEventListener("click", function (e) {
    player2.play();
    e.preventDefault();
  });

  close2.addEventListener("click", this.closePlayer.bind(this, player2, true));
  close2.addEventListener("touchstart", this.closePlayer.bind(this, player2, true));

  close2dt.addEventListener("click", function (e) {
    player2.stop();
    e.preventDefault();
  });

}



