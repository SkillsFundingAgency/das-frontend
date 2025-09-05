(function () {
  class DasHeader {
    constructor(module) {
      this.module = module;

      // Only submenus with this class are toggled
      this.triggers = Array.from(this.module.querySelectorAll('.das-header__nav__link--has-menu'));

      if (!this.triggers.length) return;

      // Map trigger -> menu
      this.menus = new Map();
      this.triggers.forEach(trigger => {
        const controlsId = trigger.getAttribute('aria-controls');
        const menu = controlsId && this.module.querySelector(`#${CSS.escape(controlsId)}`);
        if (!menu) return;

        // Initial state (hidden)
        trigger.setAttribute('aria-expanded', 'false');
        menu.classList.add('das-header__sub-menu--hidden');
        menu.setAttribute('hidden', 'hidden');

        this.menus.set(trigger, menu);
      });

      // Bind once
      this.onTriggerClick = this.onTriggerClick.bind(this);
      this.onDocPointerDown = this.onDocPointerDown.bind(this);
      this.onDocFocusIn = this.onDocFocusIn.bind(this);
      this.onDocKeyDown = this.onDocKeyDown.bind(this);

      // Events
      this.triggers.forEach(t => t.addEventListener('click', this.onTriggerClick));

      // Use capture so we hear it before other handlers
      document.addEventListener('pointerdown', this.onDocPointerDown, true);
      document.addEventListener('focusin', this.onDocFocusIn, true);
      document.addEventListener('keydown', this.onDocKeyDown, true);
    }

    // --- Event handlers ---
    onTriggerClick(e) {
      // allow href="#settings" without navigation
      e.preventDefault();
      const trigger = e.currentTarget;
      const menu = this.menus.get(trigger);
      if (!menu) return;

      const wasOpen = trigger.classList.contains('open');

      // Close everything first
      this.closeAll();

      // Re-open if it was closed
      if (!wasOpen) {
        this.open(trigger, menu);
      }
    }

    onDocPointerDown(e) {
      // Close if clicking outside *every* trigger/menu pair
      if (this.clickedOrFocusedOutsideAllPairs(e.target)) {
        this.closeAll();
      }
    }

    onDocFocusIn(e) {
      // Close when focus moves outside all pairs (keyboard users tabbing away)
      if (this.clickedOrFocusedOutsideAllPairs(e.target)) {
        this.closeAll();
      }
    }

    onDocKeyDown(e) {
      if (e.key === 'Escape' || e.key === 'Esc') {
        const openTrigger = this.getOpenTrigger();
        if (openTrigger) {
          e.preventDefault();
          this.closeAll();
          openTrigger.focus(); // return focus to the control
        }
      }
    }

    // --- Helpers ---
    getOpenTrigger() {
      return this.triggers.find(t => t.classList.contains('open')) || null;
    }

    open(trigger, menu) {
      trigger.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
      menu.classList.remove('das-header__sub-menu--hidden');
      menu.removeAttribute('hidden');
      // const first = menu.querySelector('a, [tabindex]:not([tabindex="-1"])');
      // if (first) first.focus();
    }

    close(trigger, menu) {
      trigger.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
      menu.classList.add('das-header__sub-menu--hidden');
      menu.setAttribute('hidden', 'hidden');
    }

    closeAll() {
      this.menus.forEach((menu, trigger) => this.close(trigger, menu));
    }

    // Returns true if target is outside every (trigger OR its menu)
    clickedOrFocusedOutsideAllPairs(target) {
      for (const [trigger, menu] of this.menus.entries()) {
        if (trigger.contains(target) || menu.contains(target)) {
          return false; // inside one pair → do not close
        }
      }
      return true; // outside all pairs → close
    }
  }

  function initDasHeader() {
    const headers = document.querySelectorAll("[data-module='one-login-header']");
    headers.forEach(header => new DasHeader(header));
  }

  // Run on DOM ready (in case script is in <head>)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDasHeader);
  } else {
    initDasHeader();
  }
})();
