export class BackLink {
  constructor(container) {
    if (!container) return;
    this.container = container;
  }

  init() {
    const backLink = document.createElement('a');
    backLink.href = '#';
    backLink.className = 'fiu-back-link';
    backLink.textContent = 'Back';

    backLink.addEventListener('click', event => {
      event.preventDefault();
      window.history.back();
    });

    this.container.appendChild(backLink);
  }
}
