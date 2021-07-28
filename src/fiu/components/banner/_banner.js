function Banner(banner) {
  this.banner = banner;
  this.cookieName = this.banner.dataset.fiuBannerCookieName || 'fiu-banner';
  this.cookieValue = 'true';
  this.hidelink = this.banner.querySelector('[data-fiu-banner-hide-link]')
  this.setupEvents()
  this.init();
}

Banner.prototype.init = function () {
  if (this.checkCookie(this.cookieName) === this.cookieValue) {
    this.removeBanner()
  } else {
    this.showBanner()
  }
}

Banner.prototype.setupEvents = function () {
  this.hidelink.addEventListener('click', (event) => {
    this.removeBanner();
    event.preventDefault();
  });
}

Banner.prototype.showBanner = function () {
  this.banner.classList.remove('fiu-visually-hidden');
}

Banner.prototype.removeBanner = function () {
  this.createCookie(this.cookieName, this.cookieValue, 365)
  this.banner.parentNode.removeChild(this.banner);
}

Banner.prototype.createCookie = function (name, value, days) {
  let expires;
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toGMTString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

Banner.prototype.checkCookie = function (name) {
  let nameEQ = name + "=";
  let cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let c = cookies[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
}
