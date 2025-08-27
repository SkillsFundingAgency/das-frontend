export class PrintLink {
  constructor(container) {
    if (!container) return;
    this.container = container;
  }

  init() {
    const printLink = document.createElement("a");
    printLink.href = "#";
    printLink.className = "govuk-body govuk-link fiu-print-page-link";
    printLink.textContent = this.container.dataset.linkContent || "Print page";

    printLink.addEventListener("click", (event) => {
      event.preventDefault();
      window.print();
    });

    this.container.appendChild(printLink);
  }
}
