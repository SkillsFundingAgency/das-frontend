
  function CookieSettings ($module) {
    this.$module = $module;
    this.DEFAULT_COOKIE_CONSENT = [
      'AnalyticsConsent',
      'MarketingConsent'
    ]
    this.start()
  }

  CookieSettings.prototype.start = function () {

    this.$module.submitSettingsForm = this.submitSettingsForm.bind(this)

    document.querySelector('form[data-module=cookie-settings]').addEventListener('submit', this.$module.submitSettingsForm)

    this.setInitialFormValues()
  }

  CookieSettings.prototype.setInitialFormValues = function () {

    var cookieNames = this.DEFAULT_COOKIE_CONSENT

    cookieNames.forEach(function(cookieName) {

      var currentConsentCookie = window.GOVUK.cookie(cookieName)
      var radioButton

      if (currentConsentCookie === 'true' || currentConsentCookie === null) {
        radioButton = document.querySelector('input[name=cookies-' + cookieName + '][value=on]')
      } else {
        radioButton = document.querySelector('input[name=cookies-' + cookieName + '][value=off]')
      }

      radioButton.checked = true

    });

  }

  CookieSettings.prototype.submitSettingsForm = function (event) {

    event.preventDefault()

    var formInputs = event.target.getElementsByTagName("input")

    for ( var i = 0; i < formInputs.length; i++ ) {
      var input = formInputs[i]
      if (input.checked) {
        var name = input.name.replace('cookies-', '')
        var value = input.value === "on" ? true : false
        window.GOVUK.setCookie(name, value, { days: 365 })
      }
    }

  //  window.GOVUK.setConsentCookie(options)

    if (!window.GOVUK.cookie("SeenCookieMessage")) {
      window.GOVUK.setCookie("SeenCookieMessage", true, { days: 365 })
    }

    this.showConfirmationMessage()

    return false
  }


  CookieSettings.prototype.showConfirmationMessage = function () {
    var confirmationMessage = document.querySelector('div[data-cookie-confirmation]')
    var previousPageLink = document.querySelector('.cookie-settings__prev-page')
    var referrer = CookieSettings.prototype.getReferrerLink()

    document.body.scrollTop = document.documentElement.scrollTop = 0

    if (referrer && referrer !== document.location.pathname) {
      previousPageLink.href = referrer
      previousPageLink.style.display = "block"
    } else {
      previousPageLink.style.display = "none"
    }

    confirmationMessage.style.display = "block"
  }

  CookieSettings.prototype.getReferrerLink = function () {
    return document.referrer ? new URL(document.referrer).pathname : false
  }

  export default CookieSettings