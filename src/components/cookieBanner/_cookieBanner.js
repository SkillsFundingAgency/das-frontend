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
}

CookieBanner.prototype.removeBannerEvent = function (enableAll, event) {

    this.createCookie(this.$cookieName, this.$cookieValue, this.$cookieDuration); // Create the cookie

    //if clicked continue, make sure all cookies are enabled
    if (enableAll) {
        this.createCookie(this.$MarketingcookieName, 'true', this.$cookieDuration);
        this.createCookie(this.$AnalyticscookieName, 'true', this.$cookieDuration);
        this.removeModal();
    }

    this.removeBanner();
}

CookieBanner.prototype.showBanner = function () {
    if (this.$cookieBanner !== null) {
        var bannerClass = this.$cookieBanner.getAttribute('class').replace(' visually-hidden', '');
        this.$cookieBanner.setAttribute('class', bannerClass);
    }
}
CookieBanner.prototype.setChecked = function (elem, cookie) {
    var value = elem.checked ? "true" : "false";
    this.createCookie(cookie, value, this.$cookieDuration);
}

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
}

CookieBanner.prototype.checkCookie = function (name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

CookieBanner.prototype.eraseCookie = function (name) {
    this.createCookie(name, "", -1);
}

CookieBanner.prototype.removeBanner = function () {
    if (this.$cookieBanner !== null)
        this.$cookieBannerParent.removeChild(this.$cookieBanner);


    if (this.$Marketingcheckbox != null) {
        this.$Marketingcheckbox.addEventListener('click', this.setChecked.bind(this, this.$Marketingcheckbox, this.$MarketingcookieName));
    }
    if (this.$AnalyticsCheckbox) {
        this.$AnalyticsCheckbox.addEventListener('click', this.setChecked.bind(this, this.$AnalyticsCheckbox, this.$AnalyticscookieName));
    }
}

CookieBanner.prototype.removeModal = function () {
    if (this.$cookieModal !== null)
        this.$cookieBannerParent.removeChild(this.$cookieModal);
}

export default CookieBanner