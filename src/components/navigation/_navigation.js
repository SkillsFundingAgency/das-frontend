function Navigation($module) {
  this.$module = $module
  this.$navToggle = $module.querySelector('.navigation__toggle');
  this.$navItems = $module.querySelectorAll('.navigation__list-item');
}

function nodeListForEach(nodes, callback) {
  if (window.NodeList.prototype.forEach) {
    return nodes.forEach(callback)
  }
  for (var i = 0; i < nodes.length; i++) {
    callback.call(window, nodes[i], i, nodes);
  }
}

Navigation.prototype.init = function () {

  // Check module exists
  var $module = this.$module
  if (!$module) {
    return
  }

  if (this.$navToggle != undefined) {
    this.$navToggle.addEventListener('click', this.onToggleNav.bind(this, this.$navToggle));
  }

  nodeListForEach(this.$navItems, function ($navItem, i) {
    this.$subnavToggle = $navItem.querySelector('.navigation__sub-menu-toggle');
    if (this.$subnavToggle != undefined) {
      this.$subnavToggle.addEventListener('click', this.onToggleSubNav.bind(this, $navItem));
    }
  }.bind(this));
}

Navigation.prototype.onToggleNav = function () {
  var menu = document.querySelector('body') // Using a class instead, see note below.
  menu.classList.toggle('js-menu-open');
}

Navigation.prototype.onToggleSubNav = function ($navItem,event) {
  event.preventDefault();
  $navItem.querySelector('.navigation__link--top-level').classList.toggle('sub-menu-open');
  $navItem.querySelector('.navigation__sub-menu').classList.toggle('js-show')
}


export default Navigation