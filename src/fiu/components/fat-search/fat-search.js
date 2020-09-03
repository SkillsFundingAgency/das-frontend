const keywordsInput = document.getElementById('Keywords');
const configUrl = document.querySelector('body').dataset.fatApi;

if (keywordsInput && configUrl) {

  const apiUrl = configUrl + '/v3/apprenticeship-programmes/autocomplete';
  const container = document.createElement('div');
        container.setAttribute("id", "fat-autocomplete-container");

  keywordsInput.parentNode.replaceChild(container, keywordsInput);

  const getSuggestions = function (query, updateResults) {
    let results = [];
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        var jsonResponse = JSON.parse(xhr.responseText);
        results = jsonResponse.Results.map(function (r) {
          return r.Title;
        });
        updateResults(results);
      }
    }
    xhr.open("GET", apiUrl + '?searchString=' + query, true);
    xhr.send();
  };

  accessibleAutocomplete({
    element: container,
    id: 'Keywords',
    name: 'Keywords',
    displayMenu: 'overlay',
    showNoOptionsFound: false,
    source: getSuggestions,
    placeholder: "Job role or keyword..."
  });

}