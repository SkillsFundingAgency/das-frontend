function Navigation(nav) {
  this.toggleIcon = nav.getElementsByClassName('fiu-navigation__toggle')[0];
  this.setupEvents()
}

Navigation.prototype.setupEvents = function () {

}

var navs = document.getElementsByClassName('fiu-navigation');
var fiuNavigation = new Navigation(navs[0])
