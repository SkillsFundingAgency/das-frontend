function Navigation(navigation) {
    this.list = navigation.querySelector('.das-nav__list')
    this.listItems = navigation.querySelectorAll('.das-nav__list-item')

    this.widthOfItems = nodeListForEach()

    //console.log(list.offsetWidth)
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
    new Navigation(navigation);
}