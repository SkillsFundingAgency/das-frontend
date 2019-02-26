import GoogleTagManager from '../googleTagManager/_googleTagManager'

function NetworkInformation($gtmDataLayer) {
    this.$connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    this.$trackingEnabled = $gtmDataLayer != null;
    this.$gtmDataLayer = $gtmDataLayer;
    this.$gtm = null;
}


NetworkInformation.prototype.init = function () {
    if (this.$connection) {
        if (this.$trackingEnabled) {
            this.$gtm = new GoogleTagManager(this.$gtmDataLayer);
            this.$gtm.sendEvent("NetworkInformation.onLoad",this.$connection);
        }
    }

}
export default NetworkInformation;