  (function() {
    var didInit = false;
    function initMunchkin() {
      var marketingConsent = window.GOVUK.cookie('MarketingConsent')
      if(didInit === false) {
        didInit = true;
        if (marketingConsent === 'true') {
          Munchkin.init('868-OTP-740', {"wsInfo": "j0hRc9jO"});
        }
      }
    }
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = '//munchkin.marketo.net/munchkin.js';
    s.onreadystatechange = function() {
      if (this.readyState == 'complete' || this.readyState == 'loaded') {
        initMunchkin();
      }
    };
    s.onload = initMunchkin;
    document.getElementsByTagName('head')[0].appendChild(s);
  })();
