function Autocomplete(select) {
    this.select = select;
    this.selectId = this.select.id
}

Autocomplete.prototype.init = function () {
    accessibleAutocomplete.enhanceSelectElement({
        selectElement: this.select,
        minLength: 2,
        defaultValue: '',
        displayMenu: 'overlay',
        placeholder: '',
        onConfirm: (opt) => {
            const txtInput = document.querySelector('#' + this.selectId);
            const searchString = opt || txtInput.value
            const requestedOption = [].filter.call(this.select.options,
                function (option) {
                    return (option.textContent || option.innerText) === searchString
                }
            )[0];
            if (requestedOption) {
                requestedOption.selected = true;
            } else {
                this.select.selectedIndex = 0;
            }
        }
    });
}