function GoogleTagManager($DataLayer) {
    this.$trackingEnabled = $DataLayer != null;
    this.$DataLayer = $DataLayer;

}


GoogleTagManager.prototype.sendEvent = function (event, properties) {

properties.event = event;

var propertiesJson = JSON.stringify(properties);
this.$DataLayer.push(properties);
  

}

export default GoogleTagManager