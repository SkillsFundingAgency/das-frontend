
function CookieSettings (module, options) {
  this.module = module;
  this.settings = {
    seenCookieName: 'DASSeenCookieMessage',
    env: window.GOVUK.getEnv(),
    cookiePolicy: {
      AnalyticsConsent: false
    }
  };

  var cookieBanner = document.querySelector('.das-cookie-banner');
  cookieBanner.style.display = 'none';

  this.start()
}

CookieSettings.prototype.start = function () {
  this.setRadioValues();
  this.module.addEventListener('submit', this.formSubmitted.bind(this))
}

CookieSettings.prototype.setRadioValues = function () {
  var cookiePolicy = this.settings.cookiePolicy,
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

  var formInputs = event.target.getElementsByTagName("input"),
      button = event.target.getElementsByTagName("button"),
      that = this;

  for ( var i = 0; i < formInputs.length; i++ ) {
    var input = formInputs[i]
    if (input.checked) {
      var name = input.name.replace('cookies-', '')
      var value = input.value === "on"
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
  var confirmationMessage = document.querySelector('div[data-cookie-confirmation]')
  var previousPageLink = document.querySelector('.cookie-settings__prev-page')
  var referrer = CookieSettings.prototype.getReferrerLink()

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

export default CookieSettings