var selectElements = $('.das-autocomplete')

if (selectElements) {

  selectElements.each(function () {
    var form = $(this).closest('form');
    accessibleAutocomplete.enhanceSelectElement({
      selectElement: this,
      minLength: 3,
      autoselect: true,
      defaultValue: '',
      displayMenu: 'overlay',
      placeholder: $(this).data('placeholder') || '',
      onConfirm: function (opt) {
        var txtInput = document.querySelector('#' + this.id);
        var searchString = opt || txtInput.value;
        var requestedOption = [].filter.call(this.selectElement.options,
          function (option) {
            return (option.textContent || option.innerText) === searchString
          }
        )[0];
        if (requestedOption) {
          requestedOption.selected = true;
        } else {
          this.selectElement.selectedIndex = 0;
        }
      }
    });
    form.on('submit', function() {
      $('.autocomplete__input').each(function() {
        var that = $(this);
        if (that.val().length === 0) {
          var fieldId = that.attr('id'),
            selectField = $('#' + fieldId + '-select');
          selectField[0].selectedIndex = 0;
        }
      });
    });
  })

}