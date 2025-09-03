function DasHeader(module) {
  this.module = module;
  this.hasMenuLinks = this.module.querySelectorAll('.das-header__nav__link--has-menu');
  if (this.hasMenuLinks.length) {
    this.hasMenuLinks.forEach(link => {
      const target = document.getElementById(link.getAttribute('aria-controls'));

      // Ensure the target menu is hidden initially
      target.classList.add('das-header__sub-menu--hidden');
      target.setAttribute('hidden', 'hidden');
      link.setAttribute('aria-expanded', 'false');

      // Add click event to toggle menu
      link.addEventListener('click', e => {
        e.preventDefault();
        if (link.classList.contains('open')) {
          // Hide the menu
          link.setAttribute('aria-expanded', 'false');
          link.classList.remove('open');
          target.classList.add('das-header__sub-menu--hidden');
          target.setAttribute('hidden', 'hidden');
        } else {
          // Show the menu
          link.setAttribute('aria-expanded', 'true');
          link.classList.add('open');
          target.classList.remove('das-header__sub-menu--hidden');
          target.removeAttribute('hidden');
        }
      });
    });
  }
}

function initDasHeader() {
  const dasHeaders = document.querySelectorAll("[data-module='one-login-header']");
  if (dasHeaders && DasHeader) {
    dasHeaders.forEach(header => {
      new DasHeader(header);
    });
  }
}

initDasHeader();
