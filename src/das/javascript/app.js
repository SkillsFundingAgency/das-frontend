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


// Remove any legacy cookies that may be hanging around
// (cookies with the same name, but without the domain set)

document.cookie = "DASSeenCookieMessage=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/"
document.cookie = "AnalyticsConsent=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/"
document.cookie = "MarketingConsent=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/"

