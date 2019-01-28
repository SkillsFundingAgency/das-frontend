import Accordion from './components/accordion/accordion'
import Navigation from './components/navigation/_navigation'
import CookieBanner from './components/cookieBanner/_cookieBanner'
import VideoPlayer from './components/video-player/videoplayer'
import SmoothScroll from './components/smoothScroll/_smoothScroll'
import GoogleMaps from './components/googleMaps/_googleMaps'
import SearchResults from './components/SearchResults/_searchResults'

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

  var $smoothScroll = document.querySelectorAll('[data-module="smoothScroll"]')
  nodeListForEach($smoothScroll, function ($smoothScroll) {
    new SmoothScroll($smoothScroll).init();
  });

  var $gtmDataLayer = window.dataLayer;

  var $videoPlayer = document.querySelectorAll('[data-module="videoPlayer"]')
  nodeListForEach($videoPlayer, function ($videoPlayer) {
    new VideoPlayer($videoPlayer, $gtmDataLayer).init();
  });




  window.onload = function () {
    nodeListForEach($videoPlayer, function ($videoPlayer) {
      $videoPlayer.classList.add('js-video-player__ready');
    });

    if (window.google != null && window.google.maps != null) {
      var $googleMaps = document.querySelectorAll('[data-module="googleMaps"]')
      var $apiKey = 'AIzaSyCIhjmd9QkQXP_s9nULNsMRkPJgT8tv4_8';
      nodeListForEach($googleMaps, function ($map) {
        new GoogleMaps($map, $apiKey).init();
      });
    }
    var $searchResults = document.querySelectorAll('[data-module="searchResults"]')

    nodeListForEach($searchResults, function ($searchResult) {
      new SearchResults($searchResult, $apiKey).init();
    });
  }

}

export {
  initAll,
  Accordion,
  Navigation,
  CookieBanner,
  VideoPlayer
}