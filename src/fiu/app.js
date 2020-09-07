// Mobile navigation
const nav = document.querySelector('[data-fiu-navigation]')
if (nav) {
  new Navigation(nav);
}

// Cookie Banner GDS style
const cookieBanner = document.querySelector('[data-fiu-cookie-banner]');
if (cookieBanner) {
  new CookieBanner(cookieBanner);
}

// Cookie Settings Page
const cookieSettings = document.querySelector('[data-fiu-cookie-settings]');
if (cookieSettings) {
  new CookieSettings(cookieSettings);
}

// Search Filter
const searchFilter = document.querySelector('[data-fiu-search-filter]');
if (searchFilter) {
  new SearchFilter(searchFilter);
}