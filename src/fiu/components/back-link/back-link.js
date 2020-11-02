
function BackLink(container) {
  const backLink = document.createElement('a');
        backLink.setAttribute("href", "#");
        backLink.setAttribute("class", "fiu-back-link");
        backLink.textContent = "Back"

  backLink.addEventListener('click', (event) => {
    window.history.back();
    event.preventDefault();
  });

  container.appendChild(backLink)
}