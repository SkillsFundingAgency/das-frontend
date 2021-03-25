function Alert(alert) {
  this.alertBanner = alert;
  this.cookieName = this.alertBanner.dataset.fiuAlertCookieName || 'fiu-alert-banner';
  this.cookieValue = 'true';
  this.hidelink = this.alertBanner.querySelector('[data-fiu-alert-hide-link]')
  this.setupEvents()
  this.init();
}

Alert.prototype.init = function () {
  if (this.checkCookie(this.cookieName) === this.cookieValue) {
    this.removeBanner()
  } else {
    this.showBanner()
  }
}

Alert.prototype.setupEvents = function () {
  this.hidelink.addEventListener('click', (event) => {
    this.removeBanner();
    event.preventDefault();
  });
}

Alert.prototype.showBanner = function () {
  this.alertBanner.classList.remove('fiu-visually-hidden');
}

Alert.prototype.removeBanner = function () {
  this.createCookie(this.cookieName, this.cookieValue, 365)
  this.alertBanner.parentNode.removeChild(this.alertBanner);
}

Alert.prototype.createCookie = function (name, value, days) {
  let expires;
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toGMTString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

Alert.prototype.checkCookie = function (name) {
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
