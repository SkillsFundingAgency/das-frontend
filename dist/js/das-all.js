(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define('DASFrontend', ['exports'], factory) :
	(factory((global.DASFrontend = {})));
}(this, (function (exports) { 'use strict';

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
  this.$module = $module;
  this.$sections = $module.querySelectorAll('.govuk-accordion__section');
  this.$openAllButton = '';
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
  var $module = this.$module;
  if (!$module) {
    return
  }

  this.moduleId = $module.getAttribute('id');

  nodeListForEach(this.$sections, function ($section, i) {
    // Set header attributes
    var header = $section.querySelector('.govuk-accordion__section-header');
    this.setHeaderAttributes(header, i);

    this.setExpanded(this.isExpanded($section), $section);

    // Handle events
    header.addEventListener('click', this.onToggleExpanded.bind(this, $section));
  }.bind(this));

  // Create "Open all" button and set attributes
  this.$openAllButton = document.createElement('button');
  this.setOpenAllButtonAttributes(this.$openAllButton);

  // Create controls and set attributes
  var accordionControls = document.createElement('div');
  accordionControls.setAttribute('class', 'govuk-accordion__controls');
  accordionControls.appendChild(this.$openAllButton);
  this.$module.insertBefore(accordionControls, this.$module.firstChild);

  this.$module.classList.add('with-js');

  // Handle events
  this.$openAllButton.addEventListener('click', this.openOrCloseAllSections.bind(this));

  // See if there is any state stored in sessionStorage and set the sections to
  // open or closed.
  this.readState();

  // See if OpenAll button text should be updated
  var areAllSectionsOpen = this.checkIfAllSectionsOpen();
  this.updateOpenAllButton(areAllSectionsOpen);
};

// Open/close section
Accordion.prototype.onToggleExpanded = function ($section) {
  var expanded = this.isExpanded($section);
  this.setExpanded(!expanded, $section);

  // Store the state in sessionStorage when a change is triggered
  this.storeState();

  // See if OpenAll button text should be updated
  var areAllSectionsOpen = this.checkIfAllSectionsOpen();
  this.updateOpenAllButton(areAllSectionsOpen);
};


// Toggle aria-expanded when section opened/closed
Accordion.prototype.setExpanded = function (expanded, $section) {
  var $button = $section.querySelector('.govuk-accordion__section-header-button');
  $button.setAttribute('aria-expanded', expanded);

  if (expanded) {
    $section.classList.add('govuk-accordion__section--expanded');
  } else {
    $section.classList.remove('govuk-accordion__section--expanded');
  }

  // This is set to trigger reflow for IE8, which doesn't
  // always reflow after a setAttribute call.
  this.$module.className = this.$module.className;
};

Accordion.prototype.isExpanded = function ($section) {
  return ($section.classList.contains('govuk-accordion__section--expanded'))
};

Accordion.prototype.setHeaderAttributes = function ($header, index) {
  var $button = $header.querySelector('.govuk-accordion__section-header-button');

  // Copy existing div element to an actual button element, for improved accessibility.
  // TODO: this probably needs to be more robust, and copy all attributes and child nodes?
  var $buttonAsButton = document.createElement('button');
  $buttonAsButton.setAttribute('class', $button.getAttribute('class'));
  $buttonAsButton.setAttribute('aria-controls', this.moduleId + '-panel-' + (index + 1));

  for (var i = 0; i < $button.childNodes.length; i++) {
    var child = $button.childNodes[i];
    $button.removeChild(child);
    $buttonAsButton.appendChild(child);
  }
  // $buttonAsButton.textContent = $button.textContent

  $header.removeChild($button);
  $header.appendChild($buttonAsButton);

  var icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  icon.setAttribute('width', '16');
  icon.setAttribute('height', '16');
  icon.setAttribute('viewBox', '0 0 32 32');
  icon.setAttribute('class', 'govuk-accordion--icon');
  icon.innerHTML = ' <path class="govuk-accordion--icon-open" d="M13.3721 -7.11581e-08L7.48837 5.84655L1.5814 -5.86546e-07L-6.9424e-08 1.58823L7.51163 9L15 1.61125L13.3721 -7.11581e-08Z"/><rect class="govuk-accordion--icon-close" x="1.58691" y="0.0893555" width="16.0371" height="2.16583" transform="rotate(45 1.58691 0.0893555)"/><rect class="govuk-accordion--icon-close" x="0.0966797" y="11.34" width="16.0371" height="2.16583" transform="rotate(-45 0.0966797 11.34)"/>';
 
  $header.appendChild(icon);
};

Accordion.prototype.setOpenAllButtonAttributes = function ($button) {
  $button.textContent = 'Open all';
  $button.setAttribute('class', 'govuk-accordion__expand-all');
  $button.setAttribute('aria-expanded', 'false');
  $button.setAttribute('type', 'button');
};

// Open or close all sections
Accordion.prototype.openOrCloseAllSections = function () {
  var $module = this;
  var $sections = this.$sections;

  var nowExpanded = !($module.$openAllButton.getAttribute('aria-expanded') === 'true');

  nodeListForEach($sections, function ($section) {
    $module.setExpanded(nowExpanded, $section);
  });

  $module.updateOpenAllButton(nowExpanded);
};

// Update "Open all" button
Accordion.prototype.updateOpenAllButton = function (expanded) {
  var newButtonText = expanded ? 'Close all' : 'Open all';
  this.$openAllButton.setAttribute('aria-expanded', expanded);
  this.$openAllButton.textContent = newButtonText;
};

// Check if all sections are open and update button text
Accordion.prototype.checkIfAllSectionsOpen = function () {
  var $this = this;
  var $sections = this.$sections;
  var sectionsCount = this.$sections.length;
  var openSectionsCount = 0;
  var areAllSectionsOpen = false;

  nodeListForEach($sections, function ($section) {
    if ($this.isExpanded($section)) {
      openSectionsCount++;
    }
  });

  areAllSectionsOpen = sectionsCount === openSectionsCount;

  return areAllSectionsOpen
};

// Check for `window.sessionStorage`, and that it actually works.
var helper = {
  checkForSessionStorage: function () {
    var testString = 'this is the test string';
    var result;
    try {
      window.sessionStorage.setItem(testString, testString);
      result = window.sessionStorage.getItem(testString) === testString.toString();
      window.sessionStorage.removeItem(testString);
      return result
    } catch (exception) {
      // console.log('Notice: sessionStorage not available.')
    }
  }
};

// Set the state of the accordions in sessionStorage
Accordion.prototype.storeState = function () {
  if (helper.checkForSessionStorage()) {
    nodeListForEach(this.$sections, function (element) {
      // We need a unique way of identifying each panel in the accordion. Since
      // an `#id` should be unique and an `id` is required for `aria-` attributes
      // `id` can be safely used.
      var panelId = element.querySelector('h2 [aria-controls]') ? element.querySelector('h2 [aria-controls]').getAttribute('aria-controls') : false;
      var panelState = element.querySelector('h2 [aria-expanded]') ? element.querySelector('h2 [aria-expanded]').getAttribute('aria-expanded') : false;

      if (panelId === false && console) {
        console.error(new Error('No aria controls present in accordion heading.'));
      }

      if (panelState === false && console) {
        console.error(new Error('No aria expanded present in accordion heading.'));
      }

      // Only set the state when both `panelId` and `panelState` are taken from the DOM.
      if (panelId && panelState) {
        window.sessionStorage.setItem(panelId, panelState);
      }
    });
  }
};

// Read the state of the accordions from sessionStorage
Accordion.prototype.readState = function () {
  if (helper.checkForSessionStorage()) {
    nodeListForEach(this.$sections, function ($section) {
      var panelId = $section.querySelector('h2 [aria-controls]') ? $section.querySelector('h2 [aria-controls]').getAttribute('aria-controls') : false;
      var panelState;

      if (panelId) {
        panelState = window.sessionStorage.getItem(panelId);
      }

      if (panelState !== null) {
        var trueState = panelState === 'true';
        this.setExpanded(trueState, $section);
      }
    }.bind(this));
  }
};

function Navigation($module) {
  this.$module = $module;
  this.$navToggle = $module.querySelector('.navigation__toggle');
  this.$navItems = $module.querySelectorAll('.navigation__list-item');
}

function nodeListForEach$1(nodes, callback) {
  if (window.NodeList.prototype.forEach) {
    return nodes.forEach(callback)
  }
  for (var i = 0; i < nodes.length; i++) {
    callback.call(window, nodes[i], i, nodes);
  }
}

Navigation.prototype.init = function () {

  // Check module exists
  var $module = this.$module;
  if (!$module) {
    return
  }

  if (this.$navToggle != undefined) {
    this.$navToggle.addEventListener('click', this.onToggleNav.bind(this, this.$navToggle));
  }

  nodeListForEach$1(this.$navItems, function ($navItem, i) {
    this.$subnavToggle = $navItem.querySelector('.navigation__sub-menu-toggle');
    if (this.$subnavToggle != undefined) {
      this.$subnavToggle.addEventListener('click', this.onToggleSubNav.bind(this, $navItem));
    }
  }.bind(this));
};

Navigation.prototype.onToggleNav = function () {
  var menu = document.querySelector('body'); // Using a class instead, see note below.
  menu.classList.toggle('js-menu-open');
};

Navigation.prototype.onToggleSubNav = function ($navItem,event) {
  event.preventDefault();
  $navItem.querySelector('.navigation__link--top-level').classList.toggle('sub-menu-open');
  $navItem.querySelector('.navigation__sub-menu').classList.toggle('js-show');
};

function CookieBanner($module) {

    this.$dropCookie = true;                      // false disables the Cookie, allowing you to style the banner
    this.$cookieDuration = 365;                    // Number of days before the cookie expires, and the banner reappears
    this.$cookieName = 'CookieConsent';        // Name of our cookie
    this.$cookieValue = 'true';                     // Value of cookie

    this.$cookieBanner = $module;
    this.$cookieBannerParent = this.$cookieBanner.parentNode;
    this.$cookieBannerContinue = document.querySelector(".cookiebanner__button--continue");
    this.$cookieBannerClose = document.querySelector(".cookiebanner--close");

    this.$cookieModal = document.getElementById("modal-cookiesettings");

    this.$MarketingcookieName = 'MarketingConsent';        // Name of our cookie
    this.$MarketingcookieValue = 'false';
    this.$Marketingcheckbox = document.getElementById('cbxMarketingConsent');

    this.$AnalyticscookieName = 'AnalyticsConsent';        // Name of our cookie
    this.$AnalyticscookieValue = 'true';
    this.$AnalyticsCheckbox = document.getElementById('cbxAnalyticsConsent');
}

CookieBanner.prototype.init = function () {

    //if cookies dont exist, create them.
    if (this.checkCookie(this.$MarketingcookieName) == null) {
        this.createCookie(this.$MarketingcookieName, this.$MarketingcookieValue, this.$cookieDuration); // Create the cookie
    }
    if (this.checkCookie(this.$AnalyticscookieName) == null) {
        this.createCookie(this.$AnalyticscookieName, this.$AnalyticscookieValue, this.$cookieDuration); // Create the cookie
    }

    //hide cookie notice if already been displayed
    if (this.checkCookie(this.$cookieName) == this.$cookieValue) {
        this.removeBanner();
        this.removeModal();
    } else {
        this.showBanner();

        this.$cookieBannerContinue.addEventListener('click', this.removeBannerEvent.bind(this, true));
        this.$cookieBannerClose.addEventListener('click', this.removeBannerEvent.bind(this, false));
    }

    //if cookie setting check boxes are present, make sure they have correct value
    if (this.$Marketingcheckbox != null && this.$AnalyticsCheckbox != null) {
        this.$Marketingcheckbox.checked = (this.checkCookie(this.$MarketingcookieName) === "true");
        this.$AnalyticsCheckbox.checked = (this.checkCookie(this.$AnalyticscookieName) === "true");
    }
};

CookieBanner.prototype.removeBannerEvent = function (enableAll, event) {

    this.createCookie(this.$cookieName, this.$cookieValue, this.$cookieDuration); // Create the cookie

    //if clicked continue, make sure all cookies are enabled
    if (enableAll) {
        this.createCookie(this.$MarketingcookieName, 'true', this.$cookieDuration);
        this.createCookie(this.$AnalyticscookieName, 'true', this.$cookieDuration);
        this.removeModal();
    }

    this.removeBanner();
};

CookieBanner.prototype.showBanner = function () {
    if (this.$cookieBanner !== null) {
        var bannerClass = this.$cookieBanner.getAttribute('class').replace(' visually-hidden', '');
        this.$cookieBanner.setAttribute('class', bannerClass);
    }
};
CookieBanner.prototype.setChecked = function (elem, cookie) {
    var value = elem.checked ? "true" : "false";
    this.createCookie(cookie, value, this.$cookieDuration);
};

CookieBanner.prototype.createCookie = function (name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    if (this.$dropCookie) {
        document.cookie = name + "=" + value + expires + "; path=/";
    }
};

CookieBanner.prototype.checkCookie = function (name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

CookieBanner.prototype.eraseCookie = function (name) {
    this.createCookie(name, "", -1);
};

CookieBanner.prototype.removeBanner = function () {
    if (this.$cookieBanner !== null)
        this.$cookieBannerParent.removeChild(this.$cookieBanner);


    if (this.$Marketingcheckbox != null) {
        this.$Marketingcheckbox.addEventListener('click', this.setChecked.bind(this, this.$Marketingcheckbox, this.$MarketingcookieName));
    }
    if (this.$AnalyticsCheckbox) {
        this.$AnalyticsCheckbox.addEventListener('click', this.setChecked.bind(this, this.$AnalyticsCheckbox, this.$AnalyticscookieName));
    }
};

CookieBanner.prototype.removeModal = function () {
    if (this.$cookieModal !== null)
        this.$cookieBannerParent.removeChild(this.$cookieModal);
};

function GoogleTagManager($DataLayer) {
    this.$trackingEnabled = $DataLayer != null;
    this.$DataLayer = $DataLayer;

}


GoogleTagManager.prototype.sendEvent = function (event, properties) {

properties.event = event;

var propertiesJson = JSON.stringify(properties);
this.$DataLayer.push(properties);
  

};

// import Plyr from 'plyr'

function VideoPlayer($module, $gtmDataLayer) {
    this.$module = $module;
    this.$videoPlayerId = this.$module.dataset.videoplayerid;
    this.$videoUrl = this.$module.dataset.videourl;
    this.$player = null;
    this.$playerElement = null;
    this.$videoWrap = null;
    this.$playerClass = this.$module.dataset.playerclass;
    this.$videoPlayerTemplate = '<div class="video-player__wrap"><a href="#" class="video-player__close" id="close-{videoPlayerId}" tabindex="0">Close</a><div class="video-player plyr__video-embed js-player visually-hidden" id="{videoPlayerId}"><div class="video-player--inner-wrap"><iframe src="{videoUrl}" allowfullscreen allowtransparency allow="autoplay"></iframe></div></div></div>';

    this.$trackingEnabled = $gtmDataLayer != null;
    this.$gtmDataLayer = $gtmDataLayer;
    this.$gtm = null;

    this.$playingTimer = null;
    this.$playingTimerTimespan = 5000;
}

VideoPlayer.prototype.init = function () {

    // Check module exists
    var $module = this.$module;
    if (!$module) {
        return
    }

    this.appendPlayer();
    this.$playerElement = document.getElementById(this.$videoPlayerId);
    this.$videoWrap = this.$playerElement.parentNode;

    if (this.$playerClass != null) {
        this.$videoWrap.classList.add(this.$playerClass);
    }

    this.$player = new Plyr(this.$playerElement, {
        fullscreen: { enabled: true }
    });

    var event = 'click';
    if (this.$player.touch == true) {
        event = 'touchstart';
    }

    this.$module.addEventListener(event, this.play.bind(this));

    this.$closeButton = document.getElementById('close-' + this.$videoPlayerId);
    this.$closeButton.addEventListener('click', this.close.bind(this));

    this.$module.classList.remove('visually-hidden');

    if (this.$trackingEnabled) {
        this.$gtm = new GoogleTagManager(this.$gtmDataLayer);
        this.enableTrackingEvents();
    }

};

VideoPlayer.prototype.appendPlayer = function () {
    var playerHtml = this.$videoPlayerTemplate.replace(/{videoPlayerId}/g, this.$videoPlayerId).replace('{videoUrl}', this.$videoUrl);
    window.document.body.insertAdjacentHTML('beforeend', playerHtml);
};

VideoPlayer.prototype.close = function (event) {
    this.$videoWrap.classList.remove('video-player__playing');
    this.$module.classList.remove('js-video-player__playing');
    this.$player.stop();
    event.preventDefault();
};

VideoPlayer.prototype.play = function (event) {
    var that = this;
    this.$videoWrap.classList.add('video-player__playing');
    this.$module.classList.add('js-video-player__playing');
    this.$player.play();

    window.addEventListener('keydown', function(e){
        if((e.key=='Escape'||e.key=='Esc')){
            that.close(e);
            e.preventDefault();
            return false;
        }
    }, true);

    this.$closeButton.focus();
    event.preventDefault();
};

VideoPlayer.prototype.enableTrackingEvents = function () {
    var that = this;
    this.$player.on('play', function(event) {
        if (that.$player.currentTime == 0) {
            that.sendEvent('video_started');
        }
        else {
            that.sendEvent('video_play');
        }

        that.$playingTimer = setInterval(that.sendPlayingEvent.bind(that,that), that.$playingTimerTimespan);
    });

    this.$player.on('ended', function(event) {
        that.sendEvent('video_ended');
        clearInterval(that.$playingTimer);
    });

    this.$player.on('pause', function(event) {
        that.sendEvent('video_paused');
        clearInterval(that.$playingTimer);
    });


};
VideoPlayer.prototype.sendEvent = function (event) {

    var properties = {
        'currentTimestamp': round(this.$player.currentTime,1),
        'totalVideoPlayed': round(this.$player.currentTime/this.$player.duration,2),
        'totalVideoDuration': this.$player.duration,
        'videoId': this.$player.embed.getVideoData().video_id
    };
    this.$gtm.sendEvent(event, properties);
};

VideoPlayer.prototype.sendPlayingEvent = function (vp) {
    vp.sendEvent('video_playing');
};

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

function SmoothScroll($module) {
    this.$module = $module;
    this.$anchorLinks = $module.querySelectorAll('a[href^="#"]');
}


SmoothScroll.prototype.smoothScroll = function(destination, duration, easing, callback) {

    const easings = {
      easeInOutQuart : function(t) {
        return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
      }
    };
  
    const start = window.pageYOffset;
    const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();
  
    const documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
    const destinationOffset = (typeof destination === 'number' ? destination : destination.offsetTop) - 150;
    const destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);
  
    if ('requestAnimationFrame' in window === false) {
      window.scroll(0, destinationOffsetToScroll);
      if (callback) {
        callback();
      }
      return;
    }
  
    function scroll() {
      const now = 'now' in window.performance ? performance.now() : new Date().getTime();
      const time = Math.min(1, ((now - startTime) / duration));
      const timeFunction = easings[easing](time);
      window.scroll(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start));
  
      if (window.pageYOffset === destinationOffsetToScroll) {
        if (callback) {
          callback();
        }
        return;
      }
      requestAnimationFrame(scroll);
    }
    scroll();
  };


SmoothScroll.prototype.init = function (event, properties) {
  var that = this;
  this.$anchorLinks.forEach(function(element) {
    var anchor = document.querySelector(element.hash);

    if (anchor != null) {
      element.addEventListener('click', that.smoothScroll.bind(this, anchor, 500,'easeInOutQuart',null));
    }
  });
};

function Template(template, data) {
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            var value = data[key];
            template = template.replace('((' + key + '))', value);
        }
    }
    return template;
}

//import GoogleMapsApi from './_googleMapsApi';


function GoogleMaps($module, $apiKey) {
    this.$module = $module;
    this.$gmapApi = null;
    this.$gmapApiKey = $apiKey;
    this.$map = null;

    if(this.$module.dataset.lat != null && this.$module.dataset.lon != null){
        this.$center = {lat: parseFloat(this.$module.dataset.lat),lon: parseFloat(this.$module.dataset.lon)};
    }

this.$distance = 5;

    this.$markers = new Array();
    this.$markersData = null;
    this.$MarkerDataUrl = this.$module.dataset.markerdataurl;
    this.$markerClusterer = null;

    this.$infoboxTemplate = this.$module.querySelector("[data-google-map-infobox-template]").innerHTML;
}

GoogleMaps.prototype.init = function (markers) {
    // this.$gmapApi = new GoogleMapsApi(this.$gmapApiKey);
    // this.$gmapApi.load().then(() => {


    // });

    this.$markersData = markers;

    

    if (this.$center != null){
        this.$center = new google.maps.LatLng(this.$center.lat, this.$center.lon);
    } else{
        this.$center =  new google.maps.LatLng(52.4387, 1.6478);
    }
    // safe to start using the API now
    this.$map = new google.maps.Map(this.$module, {
        center: this.$center,
        scrollwheel: false,
        zoom: 10,
        maxZoom: 14,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        },
        mapTypeControl: false,
        streetViewControl: false
    });

    if (this.$MarkerDataUrl != null) {
        this.GetResults();
    }

    if (this.$distance != null){
        this.addRadius(this.$distance);
    }


};

GoogleMaps.prototype.initMarkers = function (data) {

    let markerData = this.$markersData;
    this.setMarkersOnMap(markerData);

};
GoogleMaps.prototype.addRadius = function (distance) {

    var circ = new google.maps.Circle({
        strokeColor: "#111111",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#111111",
        fillOpacity: 0.35,
        map: this.$map,
        center: this.$center,
        radius: distance * 1609.0
    });
    this.$map.fitBounds(circ.getBounds());
};
GoogleMaps.prototype.addMarker = function (title, lat, lon, enableInfobox) {
    if (enableInfobox === void 0) { enableInfobox = true; }
    var markerData = {
        Title: title,
        Latitude: lat,
        Longitude: lon,
        Location: { Latitude: lat, Longitude: lon }
    };
    this.setMarkerOnMap(markerData, enableInfobox);
};
/**
 * Transforms the current MarkerData to google maps markers
 * and saves them in the markes array.
 */
GoogleMaps.prototype.setMarkersOnMap = function (markerData, enableInfobox) {
    if (enableInfobox === void 0) { enableInfobox = true; }
    var icon = {
        //url: '/images/icon.png?v=' + config.project.version,
        // This marker is 45 pixels wide by 40 pixels high.
        size: new google.maps.Size(45, 40),
        scaledSize: new google.maps.Size(45, 40),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 0).
        anchor: new google.maps.Point(0, 0)
    };
    // iterate over marker data and create a marker
    // also we will append the current marker data to the
    // google marker itself - maybe we will need it later
    for (var i = 0, max = markerData.length; i < max; i++) {
        this.setMarkerOnMap(markerData[i], enableInfobox);
    }
    // initialize MarkerClusterer        
    this.initMarkerClusterer();
    // Resize Event will be triggered once after markers are set.
    google.maps.event.trigger(this.$map, 'resize');
};
GoogleMaps.prototype.setMarkerOnMap = function (currentMarkerData, enableInfobox) {
    if (enableInfobox === void 0) { enableInfobox = true; }
    var markerObject = {
        position: new google.maps.LatLng(currentMarkerData.Location.Latitude, currentMarkerData.Location.Longitude),
        //  icon: icon,
        map: this.$map
    };
    if (window.InfoBox) {
        markerObject['infobox'] = this.getInfoBox(currentMarkerData);
    }
    var marker = new google.maps.Marker(markerObject);
    if (window.InfoBox) {
        // add on click handler to the marker itself
        // so it will open our infobox.
        var self = this;
        marker.addListener('click', function () {
            if (this.openInfoBox) {
                this.openInfoBox.close();
                if (this.openInfoBox === marker.infobox) {
                    this.openInfoBox = null;
                    return;
                }
            }
            marker.infobox.open(self.$map, marker);
            this.openInfoBox = marker.infobox;
        });
    }
    // add to controllers markers array.
    this.$markers.push(marker);
};
GoogleMaps.prototype.getLatLngByPostcode = function (postcode) {
    var geocoder = new google.maps.Geocoder();
};
//**
// * Generates an InfoBox Element using the InfoBox.JS Library
// * replacing the placeholder from the <script> tag and retrieves it.
// * 
// * @param {IMarkerData} markerData current markerData
// * @returns Instance of an InfoBox
// */
GoogleMaps.prototype.getInfoBox = function (markerData) {
    var infoBoxTemplate = this.$infoboxTemplate;
    var infoBoxTemplateData = {
        Title: markerData.Title,
        ShortDescription: markerData.ShortDescription,
        Url: markerData.VacancyUrl
    };
    var currentInfoBox = new InfoBox({
        content: Template(infoBoxTemplate, infoBoxTemplateData),
        disableAutoPan: false,
        maxWidth: 'auto',
        pixelOffset: new google.maps.Size(-132, -120),
        infoBoxClearance: new google.maps.Size(1, 1),
        closeBoxMargin: "5px 5px 2px 2px",
        closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif"
    });
    return currentInfoBox;
};
///**
// * Initialize MarkerClusterer with current Map & Markers
// * 
// * 
// * @memberOf MapController
// */
GoogleMaps.prototype.initMarkerClusterer = function () {
    
        this.$markerClusterer = new MarkerClusterer(this.$map, this.$markers, { imagePath: 'https://googlemaps.github.io/js-marker-clusterer/images/m' });
    
};


GoogleMaps.prototype.GetResults = function () {
    var map = this;
    var request = new XMLHttpRequest();
    request.open('GET', this.$MarkerDataUrl, true);

    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            // Success! 
            map.$markersData = JSON.parse(this.response).Results;
            map.initMarkers(map.$markersData);
        } else {
            // We reached our target server, but it returned an error

        }
    };

    request.onerror = function () {
        // There was a connection error of some sort
    };

    request.send();
};

GoogleMaps.prototype.LoadMarkers = function (markers) {

};

function SearchResults($module, $apiKey) {
    this.$module = $module;
    this.$gmapApi = null;
    this.$gmapApiKey = $apiKey;
    this.$map = null;

    this.$searchResultsUrl = this.$module.dataset.searchresultsurl;
    this.$mapElementId = this.$module.dataset.mapId;

    this.mainContentElement = $module;
    this.searchResultsElement = document.getElementById("vacancy-search-results");
    this.lat = parseFloat(document.getElementById("Latitude").value);
    this.lon = parseFloat(document.getElementById("Longitude").value);
    this.distance = parseFloat(document.getElementById("Distance").value);
    this.center = { latitude: this.lat, longitude: this.lon };
    this.markersData = null;
}

SearchResults.prototype.init = function () {

    this.$map = new GoogleMaps(this.$mapElementId, this.center);

     this.$map.init();
   // map.addRadius(this.distance);

   // this.GetResults();
    // searchResults.forEach(function (element) {
    //     var center = { latitude: element.dataset.lat, longitude: element.dataset.lon };
    //     var resultMap = new MapController(element, center, null);
    //     resultMap.addMarker(element.dataset.id, parseFloat(element.dataset.lat), parseFloat(element.dataset.lon), false);
    // });
};

function nodeListForEach$2(nodes, callback) {
  if (window.NodeList.prototype.forEach) {
    return nodes.forEach(callback)
  }
  for (var i = 0; i < nodes.length; i++) {
    callback.call(window, nodes[i], i, nodes);
  }
}

function initAll() {

  var $accordions = document.querySelectorAll('[data-module="accordion"]');
  nodeListForEach$2($accordions, function ($accordion) {
    new Accordion($accordion).init();
  });

  var $navs = document.querySelectorAll('[data-module="navigation"]');
  nodeListForEach$2($navs, function ($navs) {
    new Navigation($navs).init();
  });

  var $cookieBanner = document.querySelector('[data-module="cookieBanner"]');
  if ($cookieBanner != null) {
    new CookieBanner($cookieBanner).init();
  }

  var $smoothScroll = document.querySelectorAll('[data-module="smoothScroll"]');
  nodeListForEach$2($smoothScroll, function ($smoothScroll) {
    new SmoothScroll($smoothScroll).init();
  });

  var $gtmDataLayer = window.dataLayer;

  var $videoPlayer = document.querySelectorAll('[data-module="videoPlayer"]');
  nodeListForEach$2($videoPlayer, function ($videoPlayer) {
    new VideoPlayer($videoPlayer, $gtmDataLayer).init();
  });




  window.onload = function () {
    nodeListForEach$2($videoPlayer, function ($videoPlayer) {
      $videoPlayer.classList.add('js-video-player__ready');
    });

    if (window.google != null && window.google.maps != null) {
      var $googleMaps = document.querySelectorAll('[data-module="googleMaps"]');
      var $apiKey = 'AIzaSyCIhjmd9QkQXP_s9nULNsMRkPJgT8tv4_8';
      nodeListForEach$2($googleMaps, function ($map) {
        new GoogleMaps($map, $apiKey).init();
      });
    }
    var $searchResults = document.querySelectorAll('[data-module="searchResults"]');

    nodeListForEach$2($searchResults, function ($searchResult) {
      new SearchResults($searchResult, $apiKey).init();
    });
  };

}

exports.initAll = initAll;
exports.Accordion = Accordion;
exports.Navigation = Navigation;
exports.CookieBanner = CookieBanner;
exports.VideoPlayer = VideoPlayer;

})));
