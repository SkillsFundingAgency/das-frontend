var navLinksContainer = document.getElementsByClassName("das-navigation__list");
var navLinksListItems = document.getElementsByClassName(
  "das-navigation__list-item",
);
var availableSpace,
  currentVisibleLinks,
  numOfVisibleItems,
  requiredSpace,
  currentHiddenLinks;
var totalSpace = 0;
var breakWidths = [];

var addMenuButton = function () {
  var priorityLi = $("<li />")
    .addClass("das-navigation__priority-list-item govuk-visually-hidden")
    .attr("id", "priority-list-menu");
  var priorityUl = $("<ul />")
    .addClass("das-navigation__priority-list govuk-visually-hidden")
    .attr("id", "priority-list-menu-ul")
    .attr("hidden", "hidden");
  var priorityBut = $("<a />")
    .addClass("das-navigation__priority-button")
    .attr("href", "#")
    .attr("aria-expanded", "false")
    .attr("aria-controls", "priority-list-menu-ul")
    .text("More")
    .on("click", function (e) {
      e.preventDefault();
      if ($(this).hasClass("open")) {
        // Hide the menu
        $(this).attr("aria-expanded", "false");
        $(this).removeClass("open");
        $(menuLinksContainer).addClass("govuk-visually-hidden");
        $(menuLinksContainer).attr("hidden", "hidden");
      } else {
        // Show the menu
        $(this).attr("aria-expanded", "true");
        $(this).addClass("open");
        $(menuLinksContainer).removeClass("govuk-visually-hidden");
        $(menuLinksContainer).removeAttr("hidden");
      }
    });
  priorityLi
    .append(priorityBut, priorityUl)
    .appendTo($(navLinksContainer).eq(0));
  return priorityUl;
};

var checkSpaceForPriorityLinks = function () {
  availableSpace = navLinksContainer[0].offsetWidth - 80;
  currentVisibleLinks = document.querySelectorAll(
    ".das-navigation__list > .das-navigation__list-item",
  );
  currentHiddenLinks = document.querySelectorAll(
    ".das-navigation__priority-list > .das-navigation__list-item",
  );
  numOfVisibleItems = currentVisibleLinks.length;
  requiredSpace = breakWidths[numOfVisibleItems - 1];

  if (requiredSpace > availableSpace) {
    numOfVisibleItems -= 1;
    var lastVisibleLink = currentVisibleLinks[numOfVisibleItems];
    menuLinksContainer[0].insertBefore(
      lastVisibleLink,
      menuLinksContainer[0].childNodes[0],
    );
    $("#priority-list-menu").removeClass("govuk-visually-hidden");
    checkSpaceForPriorityLinks();
  } else if (availableSpace > breakWidths[numOfVisibleItems]) {
    if (currentHiddenLinks.length > 0) {
      var firstLink = currentHiddenLinks[0];
      var priorityListItem = document.getElementsByClassName(
        "das-navigation__priority-list-item",
      );
      navLinksContainer[0].insertBefore(firstLink, priorityListItem[0]);
      if (currentHiddenLinks.length === 1) {
        $("#priority-list-menu").addClass("govuk-visually-hidden");
      }
    }
    numOfVisibleItems += 1;
  }
};

if (navLinksContainer.length > 0) {
  var menuLinksContainer = addMenuButton();
  for (var i = 0; i < navLinksListItems.length; i++) {
    var width = navLinksListItems[i].offsetWidth;
    totalSpace += width;
    breakWidths.push(totalSpace);
  }
  checkSpaceForPriorityLinks();
}

$(window).resize(function () {
  if (navLinksContainer.length > 0) checkSpaceForPriorityLinks();
});
