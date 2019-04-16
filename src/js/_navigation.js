

var $btn = $('.das-navigation__priority-button');

var navLinksContainer = document.getElementsByClassName('das-navigation__list');
var navLinksListItems = document.getElementsByClassName('das-navigation__list-item');
var menuLinksContainer = document.getElementsByClassName('das-navigation__priority-list');
var availableSpace, currentVisibleLinks, numOfVisibleItems, requiredSpace, currentHiddenLinks;

var totalSpace = 0;
var breakWidths = [];

for (var i = 0; i < navLinksListItems.length; i++) {
  var width = navLinksListItems[i].offsetWidth;
  totalSpace += width;
  breakWidths.push(totalSpace);
}

$(window).resize(function() {
  checkSpaceForPriorityLinks();
});

$(function() {
  checkSpaceForPriorityLinks();
});

$btn.on('click', function(e) {
  $(menuLinksContainer).toggleClass('visually-hidden');
  $(this).toggleClass('open');
  e.preventDefault();
});

function checkSpaceForPriorityLinks() {
  availableSpace = navLinksContainer[0].offsetWidth - 80;
  currentVisibleLinks = document.querySelectorAll('.das-navigation__list > .das-navigation__list-item');
  currentHiddenLinks = document.querySelectorAll('.das-navigation__priority-list > .das-navigation__list-item');
  numOfVisibleItems = currentVisibleLinks.length;
  requiredSpace = breakWidths[numOfVisibleItems - 1];

  if (requiredSpace > availableSpace) {
    numOfVisibleItems -= 1;
    var lastVisibleLink = currentVisibleLinks[numOfVisibleItems];
    menuLinksContainer[0].insertBefore(lastVisibleLink, menuLinksContainer[0].childNodes[0]);

    checkSpaceForPriorityLinks();

  } else if (availableSpace > breakWidths[numOfVisibleItems]) {

    if (currentHiddenLinks.length > 0) {
      var firstLink = currentHiddenLinks[0];
      var priorityListItem = document.getElementsByClassName('das-navigation__priority-list-item');
      navLinksContainer[0].insertBefore(firstLink, priorityListItem[0])
    }
    numOfVisibleItems += 1;
  }
}

