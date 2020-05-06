
function CookieSettings (module, options) {
  this.module = module
  this.settings = {
    seenCookieName: 'DASSeenCookieMessage',
    cookiePolicy: {
      AnalyticsConsent: false,
      MarketingConsent: false
    },
    isModal: options === 'modal'
  }

  if (!this.settings.isModal) {
    // Hide cookie banner on settings page
    var cookieBanner = document.querySelector('.das-cookie-banner')
    cookieBanner.style.display = 'none'
  }

  if (this.settings.isModal) {
    // Hide cookie settings if modal option is set
    this.hideCookieSettings()
    this.modalControls()
  }

  this.start()
}

CookieSettings.prototype.start = function () {
  this.setRadioValues()
  this.module.addEventListener('submit', this.formSubmitted.bind(this))
}

CookieSettings.prototype.setRadioValues = function () {
  var cookiePolicy = this.settings.cookiePolicy

  Object.keys(cookiePolicy).forEach(function (cookieName) {
    var existingCookie = window.GOVUK.cookie(cookieName),
        radioButtonValue = existingCookie !== null ? existingCookie : cookiePolicy[cookieName],
        radioButton = document.querySelector('input[name=cookies-' + cookieName + '][value=' + (radioButtonValue === 'true' ? 'on' : 'off') + ']')

    radioButton.checked = true
  });
}

CookieSettings.prototype.formSubmitted = function (event) {

  event.preventDefault()

  var formInputs = event.target.getElementsByTagName("input"),
      button = event.target.getElementsByTagName("button")

  for ( var i = 0; i < formInputs.length; i++ ) {
    var input = formInputs[i]
    if (input.checked) {
      var name = input.name.replace('cookies-', '')
      var value = input.value === "on"
      window.GOVUK.setCookie(name, value, { days: 365 })
    }
  }

  window.GOVUK.setCookie(this.settings.seenCookieName, true, { days: 365 })

  if (button.length > 0) {
    button[0].removeAttribute('disabled')
  }

  if (this.settings.isModal) {
    document.location.href = document.location.pathname
  }

  if (!this.settings.isModal) {
    this.showConfirmationMessage()
  }
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

CookieSettings.prototype.hideCookieSettings = function () {
  document.getElementById('cookie-settings').style.display = 'none';
}

CookieSettings.prototype.modalControls = function () {
  var closeLink = document.createElement('a');
  var closeLinkText = document.createTextNode("Close cookie preferences");
  closeLink.appendChild(closeLinkText);
  closeLink.href = document.location.pathname
  closeLink.classList.add('das-cookie-settings__close-modal')
  this.module.appendChild(closeLink);
}

export default CookieSettings