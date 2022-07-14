function Navigation(navigation) {
    this.list = navigation.querySelector('.das-nav__list')
    this.availableSpace = this.list.offsetWidth
    this.listItems = navigation.querySelectorAll('.das-nav__list-item')
    this.setupEvents()
}

Navigation.prototype.init = function () {
    this.widthOfItems = 0
    nodeListForEach(this.listItems, this.addWidthOfItem.bind(this))
    console.log(`Available space: ${this.availableSpace}`)
    console.log(`Width of all the items: ${this.widthOfItems}`)
    if (this.widthOfItems > this.availableSpace) {
        this.doSomething()
    }
}

Navigation.prototype.doSomething = function () {
    console.log(123)
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