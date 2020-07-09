import Accordion from './components/accordion/accordion'
import Navigation from './components/navigation/_navigation'
import CookieBanner from './components/cookieBanner/_cookieBanner'
import CookieBannerCampaign from './components/cookieBannerCampaign/_cookieBannerCampaign'
import CookieSettings from './components/cookieSettings/_cookieSettings'
import JumpToScroll from './components/jumpToScroll/_jumpToScroll'
import VideoPlayer from './components/video-player/videoplayer'
import SmoothScroll from './components/smoothScroll/_smoothScroll'
import GoogleMaps from './components/googleMaps/_googleMaps'
import NetworkInformation from './components/networkInformation/_networkInformation'
import AlertBanner from './components/AlertBanner/_alertBanner'

import Radios from './components/gds-v2/radios/radios'
import Tabs from './components/gds-v2/tabs/tabs'
import Showhide from "./components/showHide/_showHide";

function nodeListForEach(nodes, callback) {
  if (window.NodeList.prototype.forEach) {
    return nodes.forEach(callback)
  }
  for (var i = 0; i < nodes.length; i++) {
    callback.call(window, nodes[i], i, nodes);
  }
}

function initAll() {

  var $gtmDataLayer = window.dataLayer;

  var $navs = document.querySelectorAll('[data-module="navigation"]');
  nodeListForEach($navs, function ($navs) {
    new Navigation($navs).init();
  });

  // Devolved alert Banner on Campaign
  var $alertBanners = document.querySelectorAll('[data-module="alertBanner"]');
  nodeListForEach($alertBanners, function ($alertBanner) {
    var $cookieName = $alertBanner.dataset.cookiename !== undefined ? $alertBanner.dataset.cookiename : 'DevolvedAuthorityBanner'
    new AlertBanner($alertBanner, $cookieName).init();
  });

  // Cookie Banner on Campaign
  var $cookieBannerCampaign = document.querySelector('[data-module="cookieBanner"]');
  if ($cookieBannerCampaign != null) {
    new CookieBannerCampaign($cookieBannerCampaign).init();
  }

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

  var $jumpToScroll = document.querySelector('[data-module="jumpToScroll"]');
  if ($jumpToScroll != null) {
    JumpToScroll($jumpToScroll);
  }

  var $accordions = document.querySelectorAll('[data-module="accordion"]');
  nodeListForEach($accordions, function ($accordion) {
    new Accordion($accordion).init();
  });

  var $smoothScroll = document.querySelectorAll('[data-module="smoothScroll"]')
  nodeListForEach($smoothScroll, function ($smoothScroll) {
    new SmoothScroll($smoothScroll).init();
  });

  var $videoPlayer = document.querySelectorAll('[data-module="videoPlayer"]')
  nodeListForEach($videoPlayer, function ($videoPlayer) {
    new VideoPlayer($videoPlayer, $gtmDataLayer).init();
  });

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
    new Showhide($showHide).init()
  })

  new NetworkInformation($gtmDataLayer).init();
}


function initMaps() {
  if (window.google != null && window.google.maps != null) {
    var $googleMaps = document.querySelectorAll('[data-module="googleMaps"]')
    nodeListForEach($googleMaps, function ($map) {
      new GoogleMaps($map).init();
    });
  }
}

export {
  initAll,
  initMaps,
  AlertBanner,
  Accordion,
  Navigation,
  CookieBanner,
  VideoPlayer,
  //JumpToScroll,
  GoogleMaps,
  Radios,
  Tabs
}