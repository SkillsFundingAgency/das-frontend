
function SearchFilter(searchForm) {
  this.form = searchForm;
  this.button = searchForm.querySelector('.fiu-button')
  this.checkboxes = searchForm.getElementsByClassName('fiu-search-filter__checkbox')
  this.setupEvents()
}

SearchFilter.prototype.setupEvents = function () {
  this.button.classList.add("fiu-visually-hidden");
  for (const checkbox of this.checkboxes) {
    checkbox.addEventListener('change', function() {
      this.form.submit();
    });
  }
}
