function CookieBanner(module) {
  this.module = module;
  this.settings = {
    seenCookieName: 'DASSeenCookieMessage',
    env: window.GOVUK.getEnv(),
    cookiePolicy: {
      AnalyticsConsent: false,
    },
  };
  if (!window.GOVUK.cookie(this.settings.seenCookieName + this.settings.env)) {
    this.start();
  }
}

CookieBanner.prototype.start = function () {
  this.module.cookieBanner = this.module.querySelector('.das-cookie-banner');
  this.module.cookieBannerInnerWrap = this.module.querySelector('.das-cookie-banner__wrapper');
  this.module.cookieBannerConfirmationMessage = this.module.querySelector(
    '.das-cookie-banner__confirmation'
  );
  this.setupCookieMessage();
};

CookieBanner.prototype.setupCookieMessage = function () {
  this.module.hideLink = this.module.querySelector('button[data-hide-cookie-banner]');
  this.module.acceptCookiesButton = this.module.querySelector('button[data-accept-cookies]');

  if (this.module.hideLink) {
    this.module.hideLink.addEventListener('click', this.hideCookieBanner.bind(this));
  }

  if (this.module.acceptCookiesButton) {
    this.module.acceptCookiesButton.addEventListener('click', this.acceptAllCookies.bind(this));
  }
  this.showCookieBanner();
};

CookieBanner.prototype.showCookieBanner = function () {
  var cookiePolicy = this.settings.cookiePolicy,
    that = this;
  this.module.cookieBanner.style.display = 'block';

  // Create the default cookies based on settings
  Object.keys(cookiePolicy).forEach(function (cookieName) {
    window.GOVUK.cookie(cookieName + that.settings.env, cookiePolicy[cookieName].toString(), {
      days: 365,
    });
  });
};

CookieBanner.prototype.hideCookieBanner = function () {
  this.module.cookieBanner.style.display = 'none';
  window.GOVUK.cookie(this.settings.seenCookieName + this.settings.env, true, {
    days: 365,
  });
};

CookieBanner.prototype.acceptAllCookies = function () {
  var that = this;
  this.module.cookieBannerInnerWrap.style.display = 'none';
  this.module.cookieBannerConfirmationMessage.style.display = 'block';

  window.GOVUK.cookie(this.settings.seenCookieName + this.settings.env, true, {
    days: 365,
  });

  Object.keys(this.settings.cookiePolicy).forEach(function (cookieName) {
    window.GOVUK.cookie(cookieName + that.settings.env, true, {days: 365});
  });
};

export default CookieBanner;
