window.dataLayer = window.dataLayer || [];
window.onload = function() {
  setTimeout(function() {

    var widgetLauncher = $('#launcher'),
      widgetHelpButton = widgetLauncher.contents().find('button');

    if (widgetLauncher.length > 0 && widgetHelpButton.length > 0) {
      widgetHelpButton.on('click', function() {
        gtmEventPush({'action' : 'Help button clicked'});
        widgetOpened();
      })
    }
  }, 1500);
}


var widgetOpened = function() {
  setTimeout(function() {
    var widgetLauncherInnerWidget = $('#webWidget');
    searchFormEvents(widgetLauncherInnerWidget);
    setTimeout(function() {
      checkForSearchResults(widgetLauncherInnerWidget);
    }, 200);
  }, 200);
}

var searchFormEvents = function(container) {

  var searchForm = container.contents().find('form'),
    searchTextField = container.contents().find('input[id^="garden-field-container"]'),
    searchIcon = searchTextField.next()

  searchForm.unbind('submit')
  searchForm.on('submit', function() {
    searchFormSubmit(searchTextField)
  })

  searchIcon.unbind('click')
  searchIcon.on('click', function() {
    searchFormSubmit(searchTextField)
  })
}

var searchFormSubmit = function(textField) {
  searchSubmit(textField.val())
  setTimeout(function() {

    // Did the search product results, if so attach events
    var widgetLauncherInnerWidget = $('#webWidget');

    setTimeout(function() {
      checkForSearchResults(widgetLauncherInnerWidget);
    }, 500);

    checkForSearchResults(widgetLauncherInnerWidget);

    setTimeout(function() {
      searchFormEvents(widgetLauncherInnerWidget);
    }, 200)

    // Set up search form events again because the view may reload if no results are found
    searchFormEvents(widgetLauncherInnerWidget);

  }, 200);
}

var checkForSearchResults = function(container) {
  var listResultsLinks = container.contents().find('ol > li > a');
  if (listResultsLinks.length > 0) {
    trackSearchResults(listResultsLinks, container)
  }

}

var trackSearchResults = function(links, container) {
  links.unbind('click');
  links.on('click', function() {
    // Track article title click
    articleClick($(this).html());
    // Setup events on the article view
    articlePageEvents(container);
  })
}

var articlePageEvents = function(container) {
  setTimeout(function() {
    var backButton = container.contents().find('button').eq(0);
    backButton.unbind('click');
    backButton.on('click', function() {
      widgetOpened();
    });
  });
}


var articleClick = function(title) {
  gtmEventPush({'action' : 'Article clicked', 'title' : title})
}

var searchSubmit = function(term) {
  gtmEventPush({'action' : 'Search form submitted', 'term' : term})
}

var gtmEventPush = function(eventObj) {
  eventObj.event = 'widget'
  window.dataLayer.push(eventObj)
  console.log(eventObj)
}
