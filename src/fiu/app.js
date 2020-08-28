// Mobile navigation

const nav = document.querySelector('[data-fiu-navigation]')
if (nav) {
  const navigation = new Navigation(nav)
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