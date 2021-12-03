// Step by step

var $stepByStep = $('#step-by-step-navigation')
if ($stepByStep.length > 0) {
    var stepByStepNavigation = new GOVUK.Modules.AppStepNav()
    stepByStepNavigation.start($stepByStep)
}

function Navigation(navigation) {
  this.navigation = navigation
  if (!this.navigation) {
    return
  }
  this.navToggle = navigation.querySelector('[data-app-nav-toggle]')
  this.navMenu = navigation.querySelector('[data-app-nav-menu]')
  this.init()
}

Navigation.prototype.init = function () {
  if (!this.navToggle || !this.navMenu) {
    return
  }
  this.setAttributes()
  this.setupEvents()
}

Navigation.prototype.setAttributes = function () {
  var ariaControl = this.navToggle.hash
  this.navToggle.setAttribute('aria-controls', ariaControl.substring(1))
  this.navToggle.setAttribute('aria-expanded', false)
  this.navMenu.setAttribute('hidden', 'hidden')
}

Navigation.prototype.setupEvents = function () {
  var toggle = this.navToggle,
      menu = this.navMenu
  this.navToggle.addEventListener('click', function (e)  {
    var expandedMenu = toggle.getAttribute('aria-expanded')
    if (expandedMenu === "false") {
      document.querySelector('body').classList.add('app-navigation-menu-open');
      toggle.setAttribute('aria-expanded', true)
      menu.removeAttribute('hidden')
    } else {
      document.querySelector('body').classList.remove('app-navigation-menu-open');
      toggle.setAttribute('aria-expanded', false)
      menu.setAttribute('hidden', 'hidden')
    }
    e.preventDefault();
  });
}

var nav = document.querySelector('[data-app-navigation]')
var navInstance = new Navigation(nav);

