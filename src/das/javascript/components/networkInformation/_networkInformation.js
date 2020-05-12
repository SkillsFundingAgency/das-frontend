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

            var networkInformation = {}

            if (this.$connection.downlink != null) {
                networkInformation.downlink = this.$connection.downlink;
            }

            if (this.$connection.effectiveType != null) {
                networkInformation.effectiveType = this.$connection.effectiveType;
            }

            if (this.$connection.rtt != null) {
                networkInformation.rtt = this.$connection.rtt;
            }

            if (this.$connection.saveData != null) {
                networkInformation.saveData = this.$connection.saveData;
            }

            if (this.$connection.type != null) {
                networkInformation.type = this.$connection.type;
            }

            if (this.$connection.downlinkMax != null) {
                networkInformation.downlinkMax = this.$connection.downlinkMax;
            }

            this.$gtm.sendEvent("NetworkInformation.onLoad", networkInformation);

        }
    }

}
export default NetworkInformation;