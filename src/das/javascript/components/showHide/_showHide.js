function Showhide(module) {
  this.module = module;
  this.buttons = module.querySelectorAll('.das-show-hide__button');
  this.showLinks = module.querySelectorAll('.das-show-hide__show-link');
  this.sectionExpandedClass = 'das-show-hide__section--show';
}

Showhide.prototype.init = function () {
  var buttons = this.buttons;
  var showLinks = this.showLinks;
  var that = this;

  nodeListForEach(buttons, function (button) {
    var controls = button.getAttribute('data-aria-controls');
    var section = document.getElementById(controls);
    var sectionExpanded = that.isExpanded(section);
    if (!controls || !section) {
      return;
    }
    section.classList.add('das-show-hide__section');
    button.setAttribute('aria-controls', controls);
    button.setAttribute('aria-expanded', sectionExpanded);
    button.removeAttribute('data-aria-controls');
    button.addEventListener('click', that.handleButtonClick.bind(that));
  });

  this.updateButtons(this.buttons, false);

  // Show links - will just show a hidden section - rather than toggling
  nodeListForEach(showLinks, function (showLink) {
    var controls = showLink.getAttribute('data-aria-controls');
    var section = document.getElementById(controls);
    var sectionExpanded = that.isExpanded(section);
    if (!controls || !section) {
      return;
    }
    section.classList.add('das-show-hide__section');
    showLink.setAttribute('aria-controls', controls);
    showLink.setAttribute('aria-expanded', sectionExpanded);
    showLink.removeAttribute('data-aria-controls');
    showLink.addEventListener('click', that.handleShowLinkClick.bind(that));
  });
};

Showhide.prototype.handleButtonClick = function (event) {
  var button = event.target;
  var hasAriaControls = button.getAttribute('aria-controls');

  event.preventDefault();

  if (hasAriaControls) {
    var section = document.getElementById(hasAriaControls),
      isSectionExpanded = this.isExpanded(section);
    if (!isSectionExpanded) {
      this.showSection(section, button);
    } else {
      this.hideSection(section);
    }
    this.updateButtons(this.buttons, !isSectionExpanded);
  }
};

Showhide.prototype.handleShowLinkClick = function (event) {
  var showLink = event.target;
  var hasAriaControls = showLink.getAttribute('aria-controls');
  var buttons = document.querySelectorAll(
    '.das-show-hide__button[aria-controls="' + hasAriaControls + '"]'
  );
  event.preventDefault();

  if (hasAriaControls) {
    var section = document.getElementById(hasAriaControls);
    this.showSection(section, showLink, hasAriaControls);
    // Update any additional buttons to show/hide status of section
    this.updateButtons(buttons, true);
  }
};

Showhide.prototype.showSection = function (section, control) {
  var focusId = control.getAttribute('data-focus-id'),
    focusIdExists = document.querySelector('#' + focusId);

  // Show the section
  section.classList.add(this.sectionExpandedClass);
  // Focus on element if exists
  if (focusIdExists) {
    focusIdExists.focus();
  }
};

Showhide.prototype.hideSection = function (section) {
  section.classList.remove(this.sectionExpandedClass);
};

Showhide.prototype.isExpanded = function (section) {
  return section.classList.contains(this.sectionExpandedClass);
};

Showhide.prototype.updateButtons = function (buttons, isSectionExpanded) {
  nodeListForEach(buttons, function (button) {
    var additionalButtonString = button.getAttribute('data-button-string');
    button.innerHTML =
      (!isSectionExpanded ? 'Show' : 'Hide') +
      (additionalButtonString ? ' ' + additionalButtonString : '');
    button.setAttribute('aria-expanded', !isSectionExpanded);
  });
};

function nodeListForEach(nodes, callback) {
  if (window.NodeList.prototype.forEach) {
    return nodes.forEach(callback);
  }
  for (var i = 0; i < nodes.length; i++) {
    callback.call(window, nodes[i], i, nodes);
  }
}

export default Showhide;
