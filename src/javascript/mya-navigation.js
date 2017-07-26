var esfa = esfa || {};

esfa.navigation = {
    elems: {
        userNav: $('nav#user-nav > ul'),
        levyNav: $('ul#global-nav-links')
    },
    init: function () {
        this.setupMenus(this.elems.userNav);
        this.setupEvents(this.elems.userNav);
    },
    setupMenus: function (menu) {
       menu.find('ul').addClass("js-hidden").attr("aria-hidden", "true");
    },
    setupEvents: function (menu) {
        var that = this;
        menu.find('li.has-sub-menu > a').on('click', function (e) {
            var $that = $(this);
            that.toggleMenu($that, $that.next('ul'));
            e.stopPropagation();
            e.preventDefault();
        });
        // Focusout event on the links in the dropdown menu
        menu.find('li.has-sub-menu > ul > li > a').on('focusout', function (e) {
            // If its the last link in the drop down menu, then close
            var $that = $(this);
            if ($(this).parent().is(':last-child')) {
                that.toggleMenu($that, $that.next('ul'));
            }
        });
    },
    toggleMenu: function (link, subMenu) {
        var $li = link.parent();
        if ($li.hasClass("open")) {
            // Close menu
            $li.removeClass("open");
            subMenu.addClass("js-hidden").attr("aria-hidden", "true");
        } else {
            // Open menu
            this.closeAllOpenMenus();         
            $li.addClass("open");
            subMenu.removeClass("js-hidden").attr("aria-hidden", "false");
        }
    },
    closeAllOpenMenus: function () {
        this.elems.userNav.find('li.has-sub-menu.open').removeClass('open').find('ul').addClass("js-hidden").attr("aria-hidden", "true");
        this.elems.levyNav.find('li.open').removeClass('open').addClass("js-hidden").attr("aria-hidden", "true");
    },
    linkSettings: function () {
        var $settingsLink = $('a#link-settings'),
            that = this;
        this.toggleUserMenu();
        $settingsLink.attr("aria-hidden", "false");
        $settingsLink.on('click touchstart', function (e) {
            var target = $(this).attr('href');
            $(this).toggleClass('open');
            that.toggleUserMenu();
            e.preventDefault();
        });
    },
    toggleUserMenu: function () {
        var $userNavParent = this.elems.userNav.parent();
        if ($userNavParent.hasClass("close")) {
            //open it
            $userNavParent.removeClass("close").attr("aria-hidden", "false");
        } else {
            // close it 
            $userNavParent.addClass("close").attr("aria-hidden", "true");
        }
    }
}
