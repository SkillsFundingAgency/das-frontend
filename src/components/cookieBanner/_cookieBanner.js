
function CookieBanner (module) {
  this.module = module;
  this.settings = {
    seenCookieName: 'DASSeenCookieMessage'
  }

  if ( !window.GOVUK.cookie(this.settings.seenCookieName) ) {
    this.start()
  }

}

CookieBanner.prototype.start = function () {
  this.module.cookieBanner = this.module.querySelector('.das-cookie-banner')
  this.module.cookieBannerInnerWrap = this.module.querySelector('.das-cookie-banner__wrapper')
  this.module.cookieBannerConfirmationMessage = this.module.querySelector('.das-cookie-banner__confirmation')
  this.setupCookieMessage()
}

CookieBanner.prototype.setupCookieMessage = function () {
  this.module.hideLink = this.module.querySelector('button[data-hide-cookie-banner]')
  this.module.acceptCookiesButton = this.module.querySelector('button[data-accept-cookies]')

  if (this.module.hideLink) {
    this.module.hideLink.addEventListener('click', this.hideCookieBanner.bind(this))
  }

  if (this.module.acceptCookiesButton) {
    this.module.acceptCookiesButton.addEventListener('click', this.acceptAllCookies.bind(this))
  }
  console.log('setupCookieMessage')
  this.showCookieBanner()
}

CookieBanner.prototype.showCookieBanner = function () {
  this.module.cookieBanner.style.display = 'block';
  console.log('showCookieBanner')
}

CookieBanner.prototype.hideCookieBanner = function () {
  this.module.cookieBanner.style.display = 'none';
  window.GOVUK.cookie(this.settings.seenCookieName, true, { days: 365 })
  console.log('hideCookieBanner')
}

CookieBanner.prototype.acceptAllCookies = function () {
  this.module.cookieBannerInnerWrap.style.display = 'none';
  this.module.cookieBannerConfirmationMessage.style.display = 'block';
  console.log('acceptAllCookies')
}


















  CookieBanner.prototype.startOLD = function () {

    this.$module.hideCookieMessage = this.hideCookieMessage.bind(this)
    this.$module.showConfirmationMessage = this.showConfirmationMessage.bind(this)
    this.$module.setCookieConsent = this.setCookieConsent.bind(this)

    this.$module.cookieBanner = document.querySelector('.das-cookie-banner')
    this.$module.cookieBannerConfirmationMessage = this.$module.querySelector('.das-cookie-banner__confirmation')

    this.setupCookieMessage()
  }

  CookieBanner.prototype.setupCookieMessageOLD = function () {
    this.$hideLink = this.$module.querySelector('button[data-hide-cookie-banner]')
    if (this.$hideLink) {
      this.$hideLink.addEventListener('click', this.$module.hideCookieMessage)
    }

    this.$acceptCookiesLink = this.$module.querySelector('button[data-accept-cookies]')
    if (this.$acceptCookiesLink) {
      this.$acceptCookiesLink.addEventListener('click', this.$module.setCookieConsent)
    }

    if (!window.GOVUK.cookie('DASSeenCookieMessage')) {
      if (window.GOVUK.cookie('DASSeenCookieMessage') === true) {
        window.GOVUK.cookie('DASSeenCookieMessage', false, { days: 365 })
      }
    }
    this.showCookieMessage()
  }

  CookieBanner.prototype.showCookieMessage = function () {
    if (!this.isInCookiesPage() && !this.isInIframe()) {
      var showCookieBanner = (this.$module && window.GOVUK.cookie('DASSeenCookieMessage') !== 'true')
      if (showCookieBanner) {
        this.$module.style.display = 'block'
      }
    }
  }

  CookieBanner.prototype.hideCookieMessage = function (event) {
    if (this.$module) {
      this.$module.style.display = 'none'
      window.GOVUK.cookie('DASSeenCookieMessage', true, { days: 365 })
    }
    if (event.target) {
      event.preventDefault()
    }
  }

  CookieBanner.prototype.setCookieConsent = function () {
    window.GOVUK.approveAllCookieTypes()
    this.$module.showConfirmationMessage()
    this.$module.cookieBannerConfirmationMessage.focus()
    window.GOVUK.cookie('DASSeenCookieMessage', true, { days: 365 })
  }

  CookieBanner.prototype.showConfirmationMessage = function () {
    this.$cookieBannerMainContent = document.querySelector('.das-cookie-banner__wrapper')
    this.$cookieBannerMainContent.style.display = 'none'
    this.$module.cookieBannerConfirmationMessage.style.display = 'block'
  }

  CookieBanner.prototype.isInCookiesPage = function () {
    return window.location.pathname === '/help/cookies'
  }

  CookieBanner.prototype.isInIframe = function () {
    return window.parent && window.location !== window.parent.location
  }

  export default CookieBanner