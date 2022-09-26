import CookieBanner from './components/cookieBanner/_cookieBanner'
import CookieSettings from './components/cookieSettings/_cookieSettings'
import Radios from './components/gds-v2/radios/radios'
import Tabs from './components/gds-v2/tabs/tabs'
import ShowHide from './components/showHide/_showHide'


function initAll() {

  // Cookie Banner GDS style
  var $cookieBanner = document.querySelector('[data-module="cookie-banner"]');
  if ($cookieBanner != null) {
    new CookieBanner($cookieBanner);
  }

  // Cookie Settings Page
  var $cookieSettings = document.querySelector('[data-module="cookie-settings"]');
  if ($cookieSettings != null) {
    var $cookieSettingsOptions = $cookieSettings.dataset.options;
    new CookieSettings($cookieSettings, $cookieSettingsOptions);
  }

  // GDS v2 Radios
  var $radios = document.querySelectorAll('[data-module="radios"]')
  nodeListForEach($radios, function ($radio) {
    new Radios($radio).init()
  })

  // GDS v2 Tabs

  var $tabs = document.querySelectorAll('[data-module="tabs"]')
  nodeListForEach($tabs, function ($tabs) {
    new Tabs($tabs).init()
  })

  var $showHide = document.querySelectorAll('[data-module="das-show-hide"]')
  nodeListForEach($showHide, function ($showHide) {
    new ShowHide($showHide).init()
  })
}

export {
  initAll,
  CookieBanner,
  Radios,
  Tabs
}