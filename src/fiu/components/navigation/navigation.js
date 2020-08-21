function Navigation(nav) {
  this.navToggle = nav.querySelector('[data-fiu-nav-toggle]')
  this.navMenu = nav.querySelector('[data-fiu-nav-menu]')
  this.setupEvents()
}

Navigation.prototype.setupEvents = function () {
  this.navToggle.addEventListener('click', () => {
    const body = document.querySelector('body');
    body.classList.toggle('fiu-navigation-menu-open');
  });
}