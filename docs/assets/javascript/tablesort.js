const tableSort = () => {
  const getCellValue = (tr, idx) => {
    return tr.children[idx].innerText || tr.children[idx].textContent
  };

  const comparer = (idx, asc) => (a, b) => ((v1, v2) =>
    v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
  )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

  const sortableTable = document.querySelector('[data-module="das-table-sort"]');
  const allSortLinks = sortableTable.querySelectorAll('.govuk-table__header .govuk-link');

  const handleClick = event => {
    event.preventDefault();
    const sortLink = event.target

    allSortLinks.forEach(link => {
      if (link === event.target) return false;
      link.parentNode.classList.add("das-table--double-arrows")
      link.classList.remove("das-table__sort--asc", "das-table__sort--desc")
      link.setAttribute("aria-sort", "none")
    });

    if (sortLink.classList.contains("das-table__sort--asc")) {
      sortLink.parentNode.classList.remove("das-table--double-arrows")
      sortLink.classList.replace("das-table__sort--asc", "das-table__sort--desc")
      sortLink.setAttribute("aria-sort", "descending")
    } else if (sortLink.classList.contains("das-table__sort--desc")) {
      sortLink.parentNode.classList.remove("das-table--double-arrows")
      sortLink.classList.replace("das-table__sort--desc", "das-table__sort--asc")
      sortLink.setAttribute("aria-sort", "ascending")
    } else {
      sortLink.parentNode.classList.remove("das-table--double-arrows")
      sortLink.classList.add("das-table__sort--desc")
      sortLink.setAttribute("aria-sort", "descending")
    }

    Array.from(sortableTable.querySelectorAll('.govuk-table__body .govuk-table__row'))
      .sort(comparer(Array.from(sortLink.parentNode.parentNode.children)
        .indexOf(sortLink.parentNode), this.asc = !this.asc))
      .forEach(tr => sortableTable.querySelector(".govuk-table__body").appendChild(tr));
  }

  allSortLinks.forEach(link => {
    link.addEventListener('click', handleClick)
  });
}

if (document.querySelector('[data-module="das-table-sort"]')) {
  tableSort();
}