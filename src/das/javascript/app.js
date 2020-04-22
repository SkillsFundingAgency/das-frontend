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

window.GOVUK.cookie('Hello', true, { days: 365, domain: 'frontend.das.com'  })