import {Autocomplete} from './components/autocomplete/_autocomplete.js';
import {BackLink} from './components/back-link/_back-link.js';
import {Banner} from './components/banner/_banner.js';
import {Navigation} from './components/navigation/_navigation.js';
import {PrintLink} from './components/print-page/_print-page';

// Autocomplete
const autocompleteSelects = document.querySelectorAll('[data-fiu-autocomplete]');
autocompleteSelects.forEach(autocomplete => {
  if (autocomplete) {
    new Autocomplete(autocomplete).init();
  }
});

// Back links (JS)
const backLinkContainer = document.querySelector('[data-fiu-back-link]');
if (backLinkContainer) {
  new BackLink(backLinkContainer).init();
}

// Banners
const banners = document.querySelectorAll('[data-fiu-banner]');
banners.forEach(banner => {
  new Banner(banner).init();
});

// Navigation
const nav = document.querySelector('[data-fiu-navigation]');
if (nav) {
  let navObj = new Navigation(nav);
}

// Print Page
const printPageLinkContainer = document.querySelector('[data-fiu-print-page-link]');
if (printPageLinkContainer) {
  new PrintLink(printPageLinkContainer).init();
}
