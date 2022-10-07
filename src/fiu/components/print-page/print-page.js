
function PrintPageLink(container) {
    const printLink = document.createElement('a');
    printLink.setAttribute("href", "#");
    printLink.setAttribute("class", "govuk-body govuk-link fiu-print-page-link");
    printLink.textContent = container.dataset.linkContent || "Print page"

    printLink.addEventListener('click', (event) => {
        window.print();
        event.preventDefault();
    });

    container.appendChild(printLink)
}