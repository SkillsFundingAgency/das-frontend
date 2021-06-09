
// Alert banner
const alert = document.querySelector('[data-fiu-alert]')
if (alert) {
  new Alert(alert);
}

// Mobile navigation
const nav = document.querySelector('[data-fiu-navigation]')
if (nav) {
  new Navigation(nav);
}

// Cookie Banner
const cookieBanner = document.querySelector('[data-fiu-cookie-banner]');
if (cookieBanner) {
  new CookieBanner(cookieBanner);
}

// Cookie Settings
const cookieSettings = document.querySelector('[data-fiu-cookie-settings]');
if (cookieSettings) {
  new CookieSettings(cookieSettings);
}

// Search Filter
const searchFilter = document.querySelector('[data-fiu-search-filter]');
if (searchFilter) {
  new SearchFilter(searchFilter);
}

// Back links
const backLinkContainer = document.querySelector('[data-fiu-back-link]');
if (backLinkContainer) {
  new BackLink(backLinkContainer);
}

// Tabs
const tabs = document.querySelector('[data-fiu-tabs]');
if (tabs) {
  new Tabs(tabs).init();
}