import Accordion from '/dist/campaign/components/accordion/accordion'

     var $accordion = document.querySelectorAll('[data-module="accordion"]');
  if($accordion) {
    new Accordion($accordion).init();
  };