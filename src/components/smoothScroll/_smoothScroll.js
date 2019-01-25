function SmoothScroll($module) {
    this.$module = $module;
    this.$anchorLinks = $module.querySelectorAll('a[href^="#"]')
}


SmoothScroll.prototype.smoothScroll = function(destination, duration, easing, callback) {

    const easings = {
      easeInOutQuart : function(t) {
        return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
      }
    };
  
    const start = window.pageYOffset;
    const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();
  
    const documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
    const destinationOffset = (typeof destination === 'number' ? destination : destination.offsetTop) - 150;
    const destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);
  
    if ('requestAnimationFrame' in window === false) {
      window.scroll(0, destinationOffsetToScroll);
      if (callback) {
        callback();
      }
      return;
    }
  
    function scroll() {
      const now = 'now' in window.performance ? performance.now() : new Date().getTime();
      const time = Math.min(1, ((now - startTime) / duration));
      const timeFunction = easings[easing](time);
      window.scroll(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start));
  
      if (window.pageYOffset === destinationOffsetToScroll) {
        if (callback) {
          callback();
        }
        return;
      }
      requestAnimationFrame(scroll);
    }
    scroll();
  }


SmoothScroll.prototype.init = function (event, properties) {
  var that = this;
  this.$anchorLinks.forEach(function(element) {
    var anchor = document.querySelector(element.hash);

    if (anchor != null) {
      element.addEventListener('click', that.smoothScroll.bind(this, anchor, 500,'easeInOutQuart',null));
    }
  });
}


export default SmoothScroll