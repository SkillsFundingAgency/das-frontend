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


window.GOVUK.cookie('DASSeenCookieMessage', 'false',{days: 200, domain: 'frontend.das.com'})


// If the current domain does not equal the domain
// that we would like to set our cookies against,
// then let's remove any legacy cookies that may
// be hanging around

var currentDomain = window.location.hostname;
var cookieDomain = window.GOVUK.getDomain();

if (currentDomain !== cookieDomain) {
  window.GOVUK.cookie('DASSeenCookieMessage', '',{days: -1, domain: currentDomain})
  window.GOVUK.cookie('AnalyticsConsent', '',{days: -1, domain: currentDomain})
  window.GOVUK.cookie('MarketingConsent', '',{days: -1, domain: currentDomain})
}


