
var headers = document.getElementsByClassName("header"),
    header = headers[0];

window.onscroll = function() { activeHeader() };

function activeHeader() {
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    header.className = "header header--active";
  } else {
    header.className = "header";
  }
}

var appInit = function () {

  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    header.className = "header header--active";
  }

  var topLevelLinks = document.querySelectorAll('.navigation__list-item > a'),
      topLevelLis = document.querySelectorAll('.navigation__list-item');

  for (var li of topLevelLis) {
    var menu = li.querySelector('.navigation__sub-menu');
    if (menu !== null) {
      li.addEventListener('mouseover', function() {
        showMenu(this.querySelector('.navigation__sub-menu'))
      });
      li.addEventListener('mouseout', hideAllMenus);
    }
  }

  for (var link of topLevelLinks) {
    link.addEventListener('focus', hideAllMenus);
    link.addEventListener('keydown', function (e) {
      var key = e.which,
        menu = this.parentNode.querySelector('.navigation__sub-menu');

      if (menu !== null) {
        if (key == 40) {
          hideAllMenus();
          showMenu(menu);
        }
        if (key == 38) {
          hideMenu(menu);
        }
      }
    });
  }
}

window.addEventListener('keydown', function(e){
  if((e.key=='Escape'||e.key=='Esc')){
    hideAllMenus();
    e.preventDefault();
    return false;
  }
}, true);

var showMenu = function(menu) {
  menu.classList.add("js-show-menu");
}

var hideMenu = function(menu) {
  menu.classList.remove("js-show-menu");
}

var hideAllMenus = function() {
  var menus = document.querySelectorAll('.navigation__sub-menu');
  for (var menu of menus) {
    hideMenu(menu);
  }
}

function addLoadEvent(func)
{
  var currentOnLoad = window.onload;
  if (typeof window.onload != 'function')
  {
    window.onload = func;
  }
  else
  {
    window.onload = function()
    {
      currentOnLoad();
      func();
    }
  }
}

addLoadEvent(appInit);