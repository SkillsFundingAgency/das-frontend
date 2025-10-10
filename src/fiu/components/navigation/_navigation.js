export class Navigation {
  constructor(nav) {
    if (!nav) return;
    this.navToggle = nav.querySelector('[data-fiu-nav-toggle]');
    if (!this.navToggle) return;
    this.navToggle.addEventListener('click', e => {
      document.body.classList.toggle('fiu-navigation-menu-open');
      e.preventDefault();
    });
  }
}
