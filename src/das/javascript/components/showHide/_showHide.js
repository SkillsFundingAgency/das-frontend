function Showhide ($module) {
  this.$module = $module
  this.$buttons = $module.querySelectorAll('.das-show-hide__button')
  this.sectionExpandedClass = 'das-show-hide__section--show'
}

Showhide.prototype.init = function () {
  var $module = this.$module
  var $buttons = this.$buttons
  var that = this

  nodeListForEach($buttons, function ($button) {
    var controls = $button.getAttribute('data-aria-controls')
    var $section = $module.querySelector('#' + controls)
    var sectionExpanded

    if (!controls || !$section) {
      return
    }

    sectionExpanded = that.isExpanded($section)
    $section.classList.add('das-show-hide__section')
    that.changeButtonText($button, sectionExpanded)
    $button.setAttribute('aria-controls', controls)
    $button.setAttribute('aria-expanded', sectionExpanded)
    $button.removeAttribute('data-aria-controls')
  })

  $module.addEventListener('click', this.handleClick.bind(this))
}

Showhide.prototype.handleClick = function (event) {
  var $button = event.target
  var hasAriaControls = $button.getAttribute('aria-controls')
  if (hasAriaControls) {
    var $section = this.$module.querySelector('#' + hasAriaControls)
    var isSectionExpanded = this.isExpanded($section)
    $button.setAttribute('aria-expanded', !isSectionExpanded)
    this.changeButtonText($button, !isSectionExpanded)
    if (!isSectionExpanded) {
      $section.classList.add(this.sectionExpandedClass)
    } else {
      $section.classList.remove(this.sectionExpandedClass)
    }
  }
}

Showhide.prototype.isExpanded = function ($section) {
  return $section.classList.contains(this.sectionExpandedClass)
}

Showhide.prototype.changeButtonText = function ($button, isExpanded) {
  var additionalButtonString = $button.getAttribute('data-button-string')
  $button.innerHTML = (!isExpanded ? 'Show' : 'Hide') + (additionalButtonString ? ' ' + additionalButtonString : '')
}

function nodeListForEach (nodes, callback) {
  if (window.NodeList.prototype.forEach) {
    return nodes.forEach(callback)
  }
  for (var i = 0; i < nodes.length; i++) {
    callback.call(window, nodes[i], i, nodes);
  }
}

export default Showhide