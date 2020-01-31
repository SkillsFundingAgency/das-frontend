// used by the cookie banner component

(function (root) {
  'use strict'
  window.GOVUK = window.GOVUK || {}

  var DEFAULT_COOKIE_CONSENT = {
    'AnalyticsConsent': 'true',
    'MarketingConsent': 'false'
  }

  window.GOVUK.cookie = function (name, value, options) {
    if (typeof value !== 'undefined') {
      if (value === false || value === null) {
        return window.GOVUK.setCookie(name, '', { days: -1 })
      } else {
        // Default expiry date of 30 days
        if (typeof options === 'undefined') {
          options = { days: 30 }
        }
        return window.GOVUK.setCookie(name, value, options)
      }
    } else {
      return window.GOVUK.getCookie(name)
    }
  }

  window.GOVUK.approveAllCookieTypes = function () {
    Object.keys(DEFAULT_COOKIE_CONSENT).forEach(function (cookie) {
      window.GOVUK.setCookie(cookie, DEFAULT_COOKIE_CONSENT[cookie], {days: 365})
    });
  }

  window.GOVUK.getConsentCookie = function () {
    var consentCookie = window.GOVUK.cookie('cookie_policy')
    var consentCookieObj

    if (consentCookie) {
      try {
        consentCookieObj = JSON.parse(consentCookie)
      } catch (err) {
        return null
      }

      if (typeof consentCookieObj !== 'object' && consentCookieObj !== null) {
        consentCookieObj = JSON.parse(consentCookieObj)
      }
    } else {
      return null
    }

    return consentCookieObj
  }

  window.GOVUK.setConsentCookie = function (options) {
    var cookieConsent = window.GOVUK.getConsentCookie()

    if (!cookieConsent) {
      cookieConsent = JSON.parse(JSON.stringify(DEFAULT_COOKIE_CONSENT))
    }

    for (var cookieType in options) {
      cookieConsent[cookieType] = options[cookieType]

      // Delete cookies of that type if consent being set to false
      if (!options[cookieType]) {
        for (var cookie in COOKIE_CATEGORIES) {
          if (COOKIE_CATEGORIES[cookie] === cookieType) {
            window.GOVUK.cookie(cookie, null)

            if (window.GOVUK.cookie(cookie)) {
              var domain = window.location.hostname !== 'localhost' 
                ? window.location.hostname.slice(window.location.hostname.indexOf('.') + 1)
                : window.location.hostname;

              document.cookie = cookie + '=;expires=' + new Date() + ';domain=.' + domain + ';path=/'
            }
          }
        }
      }
    }

    window.GOVUK.setCookie('cookie_policy', JSON.stringify(cookieConsent), { days: 365 })
  }

  window.GOVUK.setCookie = function (name, value, options) {

      if (typeof options === 'undefined') {
       options = {}
      }
      var cookieString = name + '=' + value + '; path=/'

      if (options.days) {
        var date = new Date()
        date.setTime(date.getTime() + (options.days * 24 * 60 * 60 * 1000))
        cookieString = cookieString + '; expires=' + date.toGMTString()
      }

      if (document.location.protocol === 'https:') {
        cookieString = cookieString + '; Secure'
      }

      document.cookie = cookieString
  }

  window.GOVUK.getCookie = function (name) {
    var nameEQ = name + '='
    var cookies = document.cookie.split(';')
    for (var i = 0, len = cookies.length; i < len; i++) {
      var cookie = cookies[i]
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1, cookie.length)
      }
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length))
      }
    }
    return null
  }
}(window))