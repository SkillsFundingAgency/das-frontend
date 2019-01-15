import Accordion from './components/accordion/accordion'
import Navigation from './components/navigation/_navigation'
import CookieBanner from './components/cookieBanner/_cookieBanner'
import VideoPlayer from './components/video-player/videoplayer'

function nodeListForEach(nodes, callback) {
  if (window.NodeList.prototype.forEach) {
    return nodes.forEach(callback)
  }
  for (var i = 0; i < nodes.length; i++) {
    callback.call(window, nodes[i], i, nodes);
  }
}

function initAll() {
  var $accordions = document.querySelectorAll('[data-module="accordion"]');
  nodeListForEach($accordions, function ($accordion) {
    new Accordion($accordion).init();
  });

  var $navs = document.querySelectorAll('[data-module="navigation"]');
  nodeListForEach($navs, function ($navs) {
    new Navigation($navs).init();
  });

  var $cookieBanner = document.querySelector('[data-module="cookieBanner"]');
  if ($cookieBanner != null) {
    new CookieBanner($cookieBanner).init();
  }

  var $gtmDataLayer = window.dataLayer;

  var $videoPlayer = document.querySelectorAll('[data-module="videoPlayer"]')
  $videoPlayer.forEach(function ($videoPlayer) {
    new VideoPlayer($videoPlayer,$gtmDataLayer).init();
  });

  if (typeof aspnetValidation != "undefined") {
    let validationService = new aspnetValidation.ValidationService();
    validationService.bootstrap();
  }

}

export {
  initAll,
  Accordion,
  Navigation,
  CookieBanner,
  VideoPlayer
}