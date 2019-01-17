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
    this.$playerClass = this.$module.dataset.playerclass;
    this.$videoPlayerTemplate = '<div class="video-player plyr__video-embed js-player visually-hidden" id="{videoPlayerId}"><div class="video-player--inner-wrap"><iframe src="{videoUrl}" allowfullscreen allowtransparency allow="autoplay"></iframe></div></div>';

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

    if (this.$playerClass != null) {
        this.$playerElement.classList.add(this.$playerClass);
    }

    this.$player = new Plyr(this.$playerElement, {
        fullscreen: { enabled: false }
    });

    var event = 'click';
    if (this.$player.touch == true) {
        event = 'touchstart';
    }

    this.$module.addEventListener(event, this.play.bind(this));

    //this.$closeButton = this.$playerElement.querySelector('.video-player__close');
    //this.$closeButton.addEventListener('click', this.close.bind(this));

    this.$module.classList.remove('visually-hidden');

    if (this.$trackingEnabled) {
        this.$gtm = new GoogleTagManager(this.$gtmDataLayer);
        this.enableEvents();
    }

};

VideoPlayer.prototype.appendPlayer = function () {
    var playerHtml = this.$videoPlayerTemplate.replace('{videoPlayerId}', this.$videoPlayerId).replace('{videoUrl}', this.$videoUrl);
    this.$module.insertAdjacentHTML('afterend', playerHtml);
};

VideoPlayer.prototype.close = function (event) {
    this.$module.classList.remove('js-video-player__playing');
    this.$player.stop();
    event.preventDefault();
};

VideoPlayer.prototype.play = function (event) {
    this.$module.classList.add('js-video-player__playing');
    this.$player.play();
    event.preventDefault();
};

VideoPlayer.prototype.enableEvents = function () {
    this.$player.on('play', event => {
        if (this.$player.currentTime == 0) {
            this.sendEvent('video_started');
        }
        else {
            this.sendEvent('video_play');
        }

        this.$playingTimer = setInterval(this.sendPlayingEvent.bind(this,this), this.$playingTimerTimespan);
    });

    this.$player.on('ended', event => {
        this.sendEvent('video_ended');
        clearInterval(this.$playingTimer);
    });

    this.$player.on('pause', event => {
        this.sendEvent('video_paused');
        clearInterval(this.$playingTimer);
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


SmoothScroll.prototype.init = function (event, properties) {
    this.$anchorLinks.forEach(element => {
        var anchor = document.querySelector(element.hash);

        if (anchor != null) {
            element.addEventListener('click', this.smoothScroll.bind(this, anchor, 500,'easeInOutQuart',null));
        }
    });
};

SmoothScroll.prototype.smoothScroll = function(destination, duration = 500, easing = 'easeInOutQuart', callback) {

    const easings = {
      easeInOutQuart(t) {
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
  $smoothScroll.forEach(function ($smoothScroll) {
    new SmoothScroll($smoothScroll).init();
  });

  var $gtmDataLayer = window.dataLayer;

  var $videoPlayer = document.querySelectorAll('[data-module="videoPlayer"]');
  $videoPlayer.forEach(function ($videoPlayer) {
    new VideoPlayer($videoPlayer,$gtmDataLayer).init();
  });

  window.onload = function() {
    $videoPlayer.forEach(function ($videoPlayer) {
      $videoPlayer.classList.add('js-video-player__ready');
    });
  };

}

exports.initAll = initAll;
exports.Accordion = Accordion;
exports.Navigation = Navigation;
exports.CookieBanner = CookieBanner;
exports.VideoPlayer = VideoPlayer;

})));
