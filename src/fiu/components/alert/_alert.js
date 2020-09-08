function Alert(alert) {
  this.hidelink = alert.querySelector('[data-fiu-alert-hide-link]')
  this.setupEvents()
}

Alert.prototype.setupEvents = function () {
  this.hidelink.addEventListener('click', (event) => {
    console.log(event)
    event.preventDefault();
  });
}

Alert.prototype.createCookie = function () {

}