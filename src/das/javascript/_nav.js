function Navigation(navigation) {
    this.navigation = navigation
    this.setupEvents()
}

Navigation.prototype.init = function () {
    this.list = this.navigation.querySelector('.das-nav__list')
    this.availableSpace = this.list.offsetWidth
    this.listItems = this.navigation.querySelectorAll('.das-nav__list-item')
    this.widthOfItems = 0

    this.createAdditionalMenu()

    nodeListForEach(this.listItems, this.addWidthOfItem.bind(this))
    console.log(`Available space: ${this.availableSpace}`)
    console.log(`Width of all the items: ${this.widthOfItems}`)
    if (this.widthOfItems > this.availableSpace) {
        this.moveItemsThatDoNotFit()
    }
}

Navigation.prototype.moveItemsThatDoNotFit = function () {
    var runningTotal = 0;
    var overflowItems = [];
    var that = this
    nodeListForEach(this.listItems, function (item) {
        var currentAvailableSpace = that.availableSpace - runningTotal;
        if (item.offsetWidth <= currentAvailableSpace) {
            item.classList.remove('no')
            item.classList.add('ok')
        } else {
            item.classList.remove('ok')
            item.classList.add('no')
            overflowItems.push(item)
        }
        runningTotal += item.offsetWidth
        //console.log(`Running total: ${runningTotal} - Available Space: ${that.availableSpace}`)
    });
}

Navigation.prototype.createAdditionalMenu = function () {
    var extraMenuWrapper = document.createElement('span')

    var extraMenuToggle = document.createElement('button')
        extraMenuToggle.textContent = 'Menu'

    var extraMenu = document.createElement('ul')
        extraMenu.setAttribute('id', 'priority-ui-menu')

    extraMenuToggle.setAttribute('aria-controls', 'priority-ui-menu');
    extraMenuToggle.setAttribute('type', 'button');
    extraMenu.setAttribute('aria-hidden', 'true');

    extraMenuWrapper.appendChild(extraMenuToggle);
    extraMenuWrapper.appendChild(extraMenu);

   // this.navigation.appendChild(extraMenuWrapper)

}

Navigation.prototype.addWidthOfItem = function (item) {
    this.widthOfItems += item.offsetWidth
}

Navigation.prototype.setupEvents = function () {
    window.onresize = this.init.bind(this);
}
















function nodeListForEach(nodes, callback) {
    if (window.NodeList.prototype.forEach) {
        return nodes.forEach(callback)
    }
    for (var i = 0; i < nodes.length; i++) {
        callback.call(window, nodes[i], i, nodes);
    }
}


var navigation = document.querySelector('.das-nav--provider')

if (navigation) {
    new Navigation(navigation).init();
}