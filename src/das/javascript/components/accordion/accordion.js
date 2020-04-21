
/*
  Accordion

  This allows a collection of sections to be collapsed by default,
  showing only their headers. Sections can be exanded or collapsed
  individually by clicking their headers. An "Open all" button is
  also added to the top of the accordion, which switches to "Close all"
  when all the sections are expanded.

  The state of each section is saved to the DOM via the `aria-expanded`
  attribute, which also provides accessibility.

*/

// import {nodeListForEach} from '../../common'
// import '../../vendor/polyfills/Function/prototype/bind'
// import '../../vendor/polyfills/Element/prototype/classList'

function Accordion ($module) {
  this.$module = $module
  this.$sections = $module.querySelectorAll('.govuk-accordion__section')
  this.$openAllButton = ''
}

function nodeListForEach (nodes, callback) {
  if (window.NodeList.prototype.forEach) {
    return nodes.forEach(callback)
  }
  for (var i = 0; i < nodes.length; i++) {
    callback.call(window, nodes[i], i, nodes);
  }
}
Accordion.prototype.init = function () {
  
  // Check module exists
  var $module = this.$module
  if (!$module) {
    return
  }

  this.moduleId = $module.getAttribute('id')

  nodeListForEach(this.$sections, function ($section, i) {
    // Set header attributes
    var header = $section.querySelector('.govuk-accordion__section-header')
    this.setHeaderAttributes(header, i)

    this.setExpanded(this.isExpanded($section), $section)

    // Handle events
    header.addEventListener('click', this.onToggleExpanded.bind(this, $section))
  }.bind(this))

  // Create "Open all" button and set attributes
  this.$openAllButton = document.createElement('button')
  this.setOpenAllButtonAttributes(this.$openAllButton)

  // Create controls and set attributes
  var accordionControls = document.createElement('div')
  accordionControls.setAttribute('class', 'govuk-accordion__controls')
  accordionControls.appendChild(this.$openAllButton)
  this.$module.insertBefore(accordionControls, this.$module.firstChild)

  this.$module.classList.add('with-js')

  // Handle events
  this.$openAllButton.addEventListener('click', this.openOrCloseAllSections.bind(this))

  // See if there is any state stored in sessionStorage and set the sections to
  // open or closed.
  this.readState()

  // See if OpenAll button text should be updated
  var areAllSectionsOpen = this.checkIfAllSectionsOpen()
  this.updateOpenAllButton(areAllSectionsOpen)
}

// Open/close section
Accordion.prototype.onToggleExpanded = function ($section) {
  var expanded = this.isExpanded($section)
  this.setExpanded(!expanded, $section)

  // Store the state in sessionStorage when a change is triggered
  this.storeState()

  // See if OpenAll button text should be updated
  var areAllSectionsOpen = this.checkIfAllSectionsOpen()
  this.updateOpenAllButton(areAllSectionsOpen)
}


// Toggle aria-expanded when section opened/closed
Accordion.prototype.setExpanded = function (expanded, $section) {
  var $button = $section.querySelector('.govuk-accordion__section-header-button')
  $button.setAttribute('aria-expanded', expanded)

  if (expanded) {
    $section.classList.add('govuk-accordion__section--expanded')
  } else {
    $section.classList.remove('govuk-accordion__section--expanded')
  }

  // This is set to trigger reflow for IE8, which doesn't
  // always reflow after a setAttribute call.
  this.$module.className = this.$module.className
}

Accordion.prototype.isExpanded = function ($section) {
  return ($section.classList.contains('govuk-accordion__section--expanded'))
}

Accordion.prototype.setHeaderAttributes = function ($header, index) {
  var $button = $header.querySelector('.govuk-accordion__section-header-button')

  // Copy existing div element to an actual button element, for improved accessibility.
  // TODO: this probably needs to be more robust, and copy all attributes and child nodes?
  var $buttonAsButton = document.createElement('button')
  $buttonAsButton.setAttribute('class', $button.getAttribute('class'))
  $buttonAsButton.setAttribute('aria-controls', this.moduleId + '-panel-' + (index + 1))

  for (var i = 0; i < $button.childNodes.length; i++) {
    var child = $button.childNodes[i]
    $button.removeChild(child)
    $buttonAsButton.appendChild(child)
  }
  // $buttonAsButton.textContent = $button.textContent

  $header.removeChild($button)
  $header.appendChild($buttonAsButton)

  var icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  icon.setAttribute('width', '16')
  icon.setAttribute('height', '16')
  icon.setAttribute('viewBox', '0 0 32 32')
  icon.setAttribute('class', 'govuk-accordion--icon')
  icon.innerHTML = ' <path class="govuk-accordion--icon-open" d="M13.3721 -7.11581e-08L7.48837 5.84655L1.5814 -5.86546e-07L-6.9424e-08 1.58823L7.51163 9L15 1.61125L13.3721 -7.11581e-08Z"/><rect class="govuk-accordion--icon-close" x="1.58691" y="0.0893555" width="16.0371" height="2.16583" transform="rotate(45 1.58691 0.0893555)"/><rect class="govuk-accordion--icon-close" x="0.0966797" y="11.34" width="16.0371" height="2.16583" transform="rotate(-45 0.0966797 11.34)"/>';s

 
  $header.appendChild(icon)
}

Accordion.prototype.setOpenAllButtonAttributes = function ($button) {
  $button.textContent = 'Open all'
  $button.setAttribute('class', 'govuk-accordion__expand-all')
  $button.setAttribute('aria-expanded', 'false')
  $button.setAttribute('type', 'button')
}

// Open or close all sections
Accordion.prototype.openOrCloseAllSections = function () {
  var $module = this
  var $sections = this.$sections

  var nowExpanded = !($module.$openAllButton.getAttribute('aria-expanded') === 'true')

  nodeListForEach($sections, function ($section) {
    $module.setExpanded(nowExpanded, $section)
  })

  $module.updateOpenAllButton(nowExpanded)
}

// Update "Open all" button
Accordion.prototype.updateOpenAllButton = function (expanded) {
  var newButtonText = expanded ? 'Close all' : 'Open all'
  this.$openAllButton.setAttribute('aria-expanded', expanded)
  this.$openAllButton.textContent = newButtonText
}

// Check if all sections are open and update button text
Accordion.prototype.checkIfAllSectionsOpen = function () {
  var $this = this
  var $sections = this.$sections
  var sectionsCount = this.$sections.length
  var openSectionsCount = 0
  var areAllSectionsOpen = false

  nodeListForEach($sections, function ($section) {
    if ($this.isExpanded($section)) {
      openSectionsCount++
    }
  })

  areAllSectionsOpen = sectionsCount === openSectionsCount

  return areAllSectionsOpen
}

// Check for `window.sessionStorage`, and that it actually works.
var helper = {
  checkForSessionStorage: function () {
    var testString = 'this is the test string'
    var result
    try {
      window.sessionStorage.setItem(testString, testString)
      result = window.sessionStorage.getItem(testString) === testString.toString()
      window.sessionStorage.removeItem(testString)
      return result
    } catch (exception) {
      // console.log('Notice: sessionStorage not available.')
    }
  }
}

// Set the state of the accordions in sessionStorage
Accordion.prototype.storeState = function () {
  if (helper.checkForSessionStorage()) {
    nodeListForEach(this.$sections, function (element) {
      // We need a unique way of identifying each panel in the accordion. Since
      // an `#id` should be unique and an `id` is required for `aria-` attributes
      // `id` can be safely used.
      var panelId = element.querySelector('h2 [aria-controls]') ? element.querySelector('h2 [aria-controls]').getAttribute('aria-controls') : false
      var panelState = element.querySelector('h2 [aria-expanded]') ? element.querySelector('h2 [aria-expanded]').getAttribute('aria-expanded') : false

      if (panelId === false && console) {
        console.error(new Error('No aria controls present in accordion heading.'))
      }

      if (panelState === false && console) {
        console.error(new Error('No aria expanded present in accordion heading.'))
      }

      // Only set the state when both `panelId` and `panelState` are taken from the DOM.
      if (panelId && panelState) {
        window.sessionStorage.setItem(panelId, panelState)
      }
    })
  }
}

// Read the state of the accordions from sessionStorage
Accordion.prototype.readState = function () {
  if (helper.checkForSessionStorage()) {
    nodeListForEach(this.$sections, function ($section) {
      var panelId = $section.querySelector('h2 [aria-controls]') ? $section.querySelector('h2 [aria-controls]').getAttribute('aria-controls') : false
      var panelState

      if (panelId) {
        panelState = window.sessionStorage.getItem(panelId)
      }

      if (panelState !== null) {
        var trueState = panelState === 'true'
        this.setExpanded(trueState, $section)
      }
    }.bind(this))
  }
}

export default Accordion
