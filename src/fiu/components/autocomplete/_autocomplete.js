export class Autocomplete {
  constructor(select) {
    if (!select) return;
    this.select = select;
    this.selectId = this.select.id;
  }

  init() {
    accessibleAutocomplete.enhanceSelectElement({
      selectElement: this.select,
      minLength: 2,
      defaultValue: "",
      displayMenu: "overlay",
      placeholder: "",
      onConfirm: (opt) => {
        const inputEl = document.getElementById(this.select.name);
        const searchString = opt || inputEl?.value || "";

        if (!searchString.trim()) {
          this.select.selectedIndex = 0;
          return;
        }

        const matchedOption = Array.from(this.select.options).find(
          (option) =>
            (option.textContent || option.innerText).toLowerCase() ===
            searchString.toLowerCase(),
        );

        if (matchedOption) {
          matchedOption.selected = true;
        } else {
          this.select.selectedIndex = 0;
        }
      },
    });
  }
}
