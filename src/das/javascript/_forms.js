var dasJs = dasJs || {};

dasJs.forms = {
  init: function () {
    this.preventDoubleSubmit();
  },
  preventDoubleSubmit: function () {
    var forms = $('form').not('.das-ajax-form');
    forms.on('submit', function (e) {
      var button = $(this).find('.govuk-button');
      button.attr('disabled', 'disabled');
      setTimeout(function () {
        button.removeAttr('disabled');
      }, 20000);
    });
  }
};
