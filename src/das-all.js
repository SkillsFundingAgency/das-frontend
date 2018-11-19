import Accordion from './components/accordion/accordion'


function nodeListForEach (nodes, callback) {
  if (window.NodeList.prototype.forEach) {
    return nodes.forEach(callback)
  }
  for (var i = 0; i < nodes.length; i++) {
    callback.call(window, nodes[i], i, nodes);
  }
}

function initAll () {
  var $accordions = document.querySelectorAll('[data-module="accordion"]');
  nodeListForEach($accordions, function ($accordion) {
    new Accordion($accordion).init();
  });
}

export {
  initAll,
  Accordion
}