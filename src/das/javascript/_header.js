(function () {
  // ================== Header/settings dropdown ==================
  class DasHeader {
    constructor(module) {
      this.module = module;
      this.triggers = [];
      this.menus = new Map();

      this.init();

      this.onTriggerClick = this.onTriggerClick.bind(this);
      this.onDocPointerDown = this.onDocPointerDown.bind(this);
      this.onDocFocusIn = this.onDocFocusIn.bind(this);
      this.onDocKeyDown = this.onDocKeyDown.bind(this);
      this.onCloseAllEvent = this.onCloseAllEvent.bind(this);

      document.addEventListener('pointerdown', this.onDocPointerDown, true);
      document.addEventListener('focusin', this.onDocFocusIn, true);
      document.addEventListener('keydown', this.onDocKeyDown, true);
      document.addEventListener('das:close-all', this.onCloseAllEvent);
    }

    init() {
      this.triggers = Array.from(this.module.querySelectorAll('.das-header__nav__link--has-menu'));

      this.menus.clear();
      this.triggers.forEach(trigger => {
        const id = trigger.getAttribute('aria-controls');
        const menu = id && this.module.querySelector(`#${CSS.escape(id)}`);
        if (!menu) return;

        // Ensure initial state
        trigger.setAttribute('aria-expanded', 'false');
        menu.classList.add('das-header__sub-menu--hidden');
        menu.setAttribute('hidden', 'hidden');

        this.menus.set(trigger, menu);
        trigger.removeEventListener('click', this.onTriggerClick);
        trigger.addEventListener('click', this.onTriggerClick.bind(this));
      });
    }

    onCloseAllEvent() {
      this.closeAll();
    }

    onTriggerClick(e) {
      e.preventDefault();
      const trigger = e.currentTarget;
      const menu = this.menus.get(trigger);
      if (!menu) return;

      const wasOpen = trigger.classList.contains('open');
      this.closeAll();
      if (!wasOpen) this.open(trigger, menu);
    }

    onDocPointerDown(e) {
      if (this.isOutsideAllPairs(e.target)) this.closeAll();
    }

    onDocFocusIn(e) {
      if (this.isOutsideAllPairs(e.target)) this.closeAll();
    }

    onDocKeyDown(e) {
      if (e.key === 'Escape' || e.key === 'Esc') {
        const openTrigger = this.getOpenTrigger();
        if (openTrigger) {
          e.preventDefault();
          this.closeAll();
          openTrigger.focus();
        }
      }
    }

    getOpenTrigger() {
      return this.triggers.find(t => t.classList.contains('open')) || null;
    }

    open(trigger, menu) {
      trigger.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
      menu.classList.remove('das-header__sub-menu--hidden');
      menu.removeAttribute('hidden');
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

    isOutsideAllPairs(target) {
      for (const [trigger, menu] of this.menus.entries()) {
        if (trigger.contains(target) || menu.contains(target)) return false;
      }
      return true;
    }
  }

  // ================== Main service nav ==================
  class DasPriorityPlusNav {
    constructor(listEl, opts = {}) {
      this.list = listEl;
      this.breakpoint = window.matchMedia(opts.minWidthQuery || '(min-width: 40.0625em)');
      this.moreId = opts.moreId || 'service-nav__more';
      this.desktopText = opts.moreText || 'More';
      this.mobileText = opts.mobileText || 'Menu';

      this.items = Array.from(this.list.children).filter(li => !li.dataset.ppMore);

      this.more = null;
      this.moreTrigger = null;
      this.moreMenu = null;

      this.setupMore();
      this.bind();
      this.layout();
    }

    setupMore() {
      const li = document.createElement('li');
      li.className = 'govuk-service-navigation__item das-header__item--more';
      li.dataset.ppMore = 'true';

      const trigger = document.createElement('a');
      trigger.href = `#${this.moreId}`;
      trigger.className = 'das-header__nav__link--has-menu das-header__navigation__menu-link';
      trigger.setAttribute('aria-controls', this.moreId);
      trigger.setAttribute('aria-expanded', 'false');
      trigger.textContent = this.desktopText;

      const menu = document.createElement('ul');
      menu.className =
        'das-header__sub-menu das-header__sub-menu--hidden das-header__navigation__sub-menu';
      menu.id = this.moreId;
      menu.setAttribute('hidden', 'hidden');

      li.appendChild(trigger);
      li.appendChild(menu);
      this.list.appendChild(li);

      this.more = li;
      this.moreTrigger = trigger;
      this.moreMenu = menu;
    }

    bind() {
      this.onResize = this.debounce(() => this.layout(), 100);
      window.addEventListener('resize', this.onResize);
      window.addEventListener('orientationchange', this.onResize);
      window.addEventListener('load', () => this.layout());
    }

    isMobile() {
      return !this.breakpoint.matches;
    }

    updateTriggerLabel() {
      this.moreTrigger.textContent = this.isMobile() ? this.mobileText : this.desktopText;
    }

    layout() {
      this.updateTriggerLabel();

      // Move all back into main line
      while (this.moreMenu.firstChild) {
        this.list.insertBefore(this.moreMenu.firstChild, this.more);
      }

      if (this.isMobile()) {
        // All into dropdown
        this.items.forEach(li => this.moreMenu.appendChild(li));
        this.more.style.display = '';
        document.dispatchEvent(new CustomEvent('das:close-all'));
        return;
      }

      // Fit what we can on desktop
      this.more.style.display = '';
      let available = this.list.clientWidth - this.outerWidth(this.more);

      for (const li of this.items) {
        const w = this.outerWidth(li);
        if (available >= w) {
          available -= w;
        } else {
          this.moreMenu.appendChild(li);
        }
      }

      if (!this.moreMenu.children.length) {
        this.more.style.display = 'none';
      }

      document.dispatchEvent(new CustomEvent('das:close-all'));
    }

    outerWidth(el) {
      const rect = el.getBoundingClientRect();
      const cs = window.getComputedStyle(el);
      return rect.width + parseFloat(cs.marginLeft) + parseFloat(cs.marginRight);
    }

    debounce(fn, wait) {
      let t;
      return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), wait);
      };
    }
  }

  function initAll() {
    const navs = document.querySelectorAll('.das-header__navigation__list');
    navs.forEach((nav, index) => {
      new DasPriorityPlusNav(nav, {
        minWidthQuery: '(min-width: 40.0625em)',
        moreId: `das-pp-nav__more${index > 0 ? `-${index + 1}` : ''}`,
        moreText: 'More',
        mobileText: 'Menu',
      });
    });

    const settingsNavs = document.querySelectorAll("[data-module='one-login-header']");
    settingsNavs.forEach(header => new DasHeader(header));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
