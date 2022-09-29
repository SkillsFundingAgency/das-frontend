function Autocomplete(select) {
    this.select = select;
}

Autocomplete.prototype.init = function () {
    accessibleAutocomplete.enhanceSelectElement({
        selectElement: this.select,
        minLength: 2,
        defaultValue: '',
        displayMenu: 'overlay',
        placeholder: ''
    });
}