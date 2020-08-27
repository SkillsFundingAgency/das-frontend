
function CookieSettings (module, options) {
  this.module = module;
  this.settings = {
    seenCookieName: 'DASSeenCookieMessage',
    env: window.GOVUK.getEnv(),
    cookiePolicy: {
      AnalyticsConsent: false,
      MarketingConsent: false
    }
  };

  const cookieBanner = document.querySelector('.fiu-cookie-banner');
  cookieBanner.style.display = 'none';

  this.start()
}

CookieSettings.prototype.start = function () {
  this.setRadioValues();
  this.module.addEventListener('submit', this.formSubmitted.bind(this))
}

CookieSettings.prototype.setRadioValues = function () {
  const cookiePolicy = this.settings.cookiePolicy,
    that = this;
  Object.keys(cookiePolicy).forEach(function (cookieName) {
    var existingCookie = window.GOVUK.cookie(cookieName + that.settings.env),
      radioButtonValue = existingCookie !== null ? existingCookie : cookiePolicy[cookieName],
      radioButton = document.querySelector('input[name=cookies-' + cookieName + '][value=' + (radioButtonValue === 'true' ? 'on' : 'off') + ']')
    radioButton.checked = true
  });
}

CookieSettings.prototype.formSubmitted = function (event) {

  event.preventDefault();

  const formInputs = event.target.getElementsByTagName("input"),
    button = event.target.getElementsByTagName("button"),
    that = this;

  for ( let i = 0; i < formInputs.length; i++ ) {
    const input = formInputs[i]
    if (input.checked) {
      const name = input.name.replace('cookies-', '')
      const value = input.value === "on"
      window.GOVUK.setCookie(name + that.settings.env, value, { days: 365 })
    }
  }

  window.GOVUK.setCookie(this.settings.seenCookieName + that.settings.env, true, { days: 365 })

  if (button.length > 0) {
    button[0].removeAttribute('disabled')
  }

  this.showConfirmationMessage()

}

CookieSettings.prototype.showConfirmationMessage = function () {
  const confirmationMessage = document.querySelector('div[data-cookie-confirmation]')
  const previousPageLink = document.querySelector('.fiu-cookie-settings__prev-page')
  const referrer = CookieSettings.prototype.getReferrerLink()

  document.body.scrollTop = document.documentElement.scrollTop = 0

  if (referrer && referrer !== document.location.pathname) {
    previousPageLink.href = referrer
    previousPageLink.style.display = "inline-block"
  } else {
    previousPageLink.style.display = "none"
  }

  confirmationMessage.style.display = "block"
}

CookieSettings.prototype.getReferrerLink = function () {
  return document.referrer ? new URL(document.referrer).pathname : false
}
