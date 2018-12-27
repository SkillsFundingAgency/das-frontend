var dropCookie = true;                      // false disables the Cookie, allowing you to style the banner
var cookieDuration = 365;                    // Number of days before the cookie expires, and the banner reappears
var cookieName = 'CookieConsent';        // Name of our cookie
var cookieValue = 'true';                     // Value of cookie
var cookieBannerId = "cookieBanner";

var MarketingcookieName = 'MarketingConsent';        // Name of our cookie
var MarketingcookieValue = 'true';
var MarketingcheckboxId = 'cbxMarketingConsent';

var AnalyticscookieName = 'AnalyticsConsent';        // Name of our cookie
var AnalyticscookieValue = 'true';
var AnalyticsCheckboxId = 'cbxAnalyticsConsent';

function removeBanner() {
    createCookie(window.cookieName, window.cookieValue, window.cookieDuration); // Create the cookie
    createCookie(window.MarketingcookieName, window.MarketingcookieValue, window.cookieDuration); // Create the cookie
    createCookie(window.AnalyticscookieName, window.AnalyticscookieValue, window.cookieDuration); // Create the cookie
    removeMe();
}

function showMe() {
    var banner = document.getElementById(cookieBannerId);
    if (banner !== null) {
        var bannerClass = banner.getAttribute('class').replace(' visually-hidden', '');
        banner.setAttribute('class', bannerClass);
    }
}
function setChecked(elem, cookie) {
    value = elem.checked ? "true" : "false";
    createCookie(cookie, value, cookieDuration);
}

function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    if (window.dropCookie) {
        document.cookie = name + "=" + value + expires + "; path=/";
    }
}

function checkCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

window.onload = function () {

    var mCheckbox = document.getElementById(MarketingcheckboxId);
    var aCheckbox = document.getElementById(AnalyticsCheckboxId);

    if (checkCookie(window.cookieName) == window.cookieValue) {
        removeMe();
    } else {
        showMe();
    }
    if (mCheckbox !== null && aCheckbox !== null) {
        mCheckbox.checked = (checkCookie(MarketingcookieName) === "true");
        aCheckbox.checked = (checkCookie(AnalyticscookieName) === "true");
    }
}

function removeMe() {
    var element = document.getElementById(cookieBannerId);
    if (element !== null)
        element.parentNode.removeChild(element);
}