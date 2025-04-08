export class Banner {
  constructor(bannerElement) {
    if (!bannerElement) {
      throw new Error('No banner element provided.');
    }

    this.banner = bannerElement;
    this.cookieName = this.banner.dataset.fiuBannerCookieName || 'fiu-banner';
    this.cookieValue = 'true';
    this.hidelink = this.banner.querySelector('[data-fiu-banner-hide-link]');
    this.setupEvents();
    this.init();
  }

  init() {
    if (this.checkCookie(this.cookieName) === this.cookieValue) {
      this.removeBanner();
    } else {
      this.showBanner();
    }
  }

  setupEvents() {
    if (!this.hidelink) return;

    this.hidelink.addEventListener('click', (event) => {
      event.preventDefault();
      this.removeBanner();
    });
  }

  showBanner() {
    this.banner.classList.remove('fiu-visually-hidden');
  }

  removeBanner() {
    this.createCookie(this.cookieName, this.cookieValue, 365);
    if (this.banner.parentNode) {
      this.banner.parentNode.removeChild(this.banner);
    }
  }

  createCookie(name, value, days) {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 86400000); // 24 * 60 * 60 * 1000
      expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value}${expires}; path=/`;
  }

  checkCookie(name) {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');
    for (let c of cookies) {
      c = c.trim();
      if (c.startsWith(nameEQ)) {
        return c.substring(nameEQ.length);
      }
    }
    return null;
  }
}
