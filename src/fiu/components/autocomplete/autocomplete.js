function Autocomplete(select) {
    this.select = select;
}

Autocomplete.prototype.init = function () {
    accessibleAutocomplete.enhanceSelectElement({
        selectElement: this.select,
        minLength: 2,
        defaultValue: '',
        displayMenu: 'overlay',
        placeholder: '',
        onConfirm: (opt) => {
            const txtInput = document.querySelector('#' + this.id);
            const searchString = opt || txtInput.value;
            const requestedOption = [].filter.call(this.selectElement.options,
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
}