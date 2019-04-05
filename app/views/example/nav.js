<script>

var collapsableNav = function (elem) {

  this.stacker = {
    elem: null,
    html: '<li class="menu-link"><a href="#">More</a><ul></ul></li>',
    width: 0
  };

  this.elem = $(elem);
  this.navItems = {
    items: {},
    length: 0
  };

  this.navWidth = 0;
  this.containerWidth = 0;

  var t = 0,
    tw = 0,
    to = this.navItems.items;

  this.elem.children('li').each(function () {

    to[t] = {
      html: $(this)[0].outerHTML,
      width: $(this).outerWidth(true),
      submenu: false,
      visible: true
    };

    if ($(this).hasClass('submenu'))
      to[t].submenu = true;

    tw += to[t].width;
    t++;

  });

  this.navItems.length = t;
  this.navWidth = tw;

  this.stacker.elem = $(this.stacker.html).appendTo(this.elem);
  this.stacker.width = this.stacker.elem.outerWidth(true);
  this.stacker.elem.remove();

  this.magic();
}

collapsableNav.prototype.resetStack = function () {
  for (var tc = 0; tc < this.navItems.length; tc++) {
    this.navItems.items[tc].visible = true;
  }
};

collapsableNav.prototype.magic = function () {

  this.resetStack();
  this.containerWidth = this.elem.parent().width()-15;

  var match = 0, tc = 0;

  console.log(this.navWidth);

  if (this.containerWidth < this.navWidth) {
    for (tc = 0; tc < this.navItems.length; tc++) {
      match += this.navItems.items[tc].width;
      if ((match + this.stacker.width) > this.containerWidth) {
        this.navItems.items[tc].visible = false;
      }
    }
  }
  this.stack();
};

collapsableNav.prototype.stack = function () {
  this.elem.empty();
  var showStacker = false, tc = 0;
  for (tc = 0; tc < this.navItems.length; tc++) {
    if (this.navItems.items[tc].visible) {
      $(this.navItems.items[tc].html).appendTo(this.elem);
    } else {
      showStacker = true;
      break;
    }
  }

  if (showStacker) {
    this.stacker.elem = $(this.stacker.html).appendTo(this.elem);
    for (tc = 0; tc < this.navItems.length; tc++) {
      if (!this.navItems.items[tc].visible) {
        var th = this.navItems.items[tc].html;
        if (th.indexOf('<ul>') !== -1) {
          th = th.replace(/<a[^>]*>/, '<span class="sa-anchor-replacement">').replace(/<\/a>/, '</span>');
        }
        $(th).appendTo(this.stacker.elem.children('ul'));
        this.navItems.items[tc].visible = false;
      }
    }
  }
};

collapsableNav.prototype.setActions = function () {

  var te = this.elem,
    menuSelector = 'li.submenu, li.menu-link',
    menuAnchorSelector = 'li.submenu>a, li.menu-link>a';

  $(te).on('click.stackable.nav', menuAnchorSelector, function () {
    if ($(this).parent().hasClass('sub-menu-open')) {
      $(te.selector).children(menuSelector).removeClass('sub-menu-open');
    } else {
      sfa.navigation.closeAllOpenMenus();
      $(te.selector).children(menuSelector).removeClass('sub-menu-open');
      $(this).parent().toggleClass('sub-menu-open');
    }
    return false;
  });

  $(document).on('click.stackable.closure', function () {
    $(te.selector).children(menuSelector).removeClass('sub-menu-open');
    sfa.navigation.closeAllOpenMenus();
  });

  $(document).on("keydown", this, function (e) {
    if (e.keyCode !== 9) {
      $(te.selector).children(menuSelector).removeClass('sub-menu-open');
      sfa.navigation.closeAllOpenMenus();
    }
  });
};


var navigation = document.getElementById('navigation');
var nav = new collapsableNav(navigation);

</script>