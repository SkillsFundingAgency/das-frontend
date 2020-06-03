var dasJs = dasJs || {};

dasJs.backLink = function () {
    var backLinkControl = $('<a>')
      .attr({'href': '#', 'class': 'govuk-back-link'})
      .text('Back')
      .on('click', function (e) {
        window.history.back();
        e.preventDefault();
      });
    $('.das-js-back-link').replaceWith(backLinkControl);
}

if ($('#das-user-navigation')) {
  dasJs.userNavigation.init();
}

if ($('.das-js-back-link')) {
  dasJs.backLink();
}

dasJs.forms.init();


// Legacy cookie clean up

var currentDomain = window.location.hostname;
var cookieDomain = window.GOVUK.getDomain();

if (currentDomain !== cookieDomain) {
  // Delete the 3 legacy cookies without the domain attribute defined
  document.cookie = "DASSeenCookieMessage=false; path=/;SameSite=None; expires=Thu, 01 Jan 1970 00:00:01 GMT";
  document.cookie = "AnalyticsConsent=false; path=/;SameSite=None; expires=Thu, 01 Jan 1970 00:00:01 GMT";
  document.cookie = "MarketingConsent=false; path=/;SameSite=None; expires=Thu, 01 Jan 1970 00:00:01 GMT";
}

// Delete the MarketingConsent with the domain attribute defined
window.GOVUK.cookie('MarketingConsent', '',{days: -1})


