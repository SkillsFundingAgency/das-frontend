(function(){

  var $exampleComm = document.getElementById('example');
  if ($exampleComm != null) {
    exampleComm($exampleComm);
  };

  var $oneOfTheseThings = document.querySelectorAll('[data-module="oneOfTheseThings"]');
  for (let i = 0; i < $oneOfTheseThings.length; i++) {
      oneOfTheseThings($oneOfTheseThings.item(i));
  }

})();


