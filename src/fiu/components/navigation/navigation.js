function Navigation(nav) {
  this.navToggle = nav.querySelector('[data-nav-toggle]')
  this.navMenu = nav.querySelector('[data-nav-menu]')
  this.setupEvents()
}

Navigation.prototype.setupEvents = function () {
  this.navToggle.addEventListener('click', () => {
    const body = document.querySelector('body');
    body.classList.toggle('fiu-navigation-menu-open');
  });
}