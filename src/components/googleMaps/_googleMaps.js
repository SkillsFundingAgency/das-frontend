//import GoogleMapsApi from './_googleMapsApi';
import Template from '../template/_template'


function GoogleMaps($module, $apiKey) {
    this.$module = $module;
    this.$gmapApi = null;
    this.$gmapApiKey = $apiKey;
    this.$map = null;

    if(this.$module.dataset.lat != null && this.$module.dataset.lon != null){
        this.$center = {lat: parseFloat(this.$module.dataset.lat),lon: parseFloat(this.$module.dataset.lon)}
    }

this.$distance = 5;

    this.$markers = new Array();
    this.$markersData = null;
    this.$MarkerDataUrl = this.$module.dataset.markerdataurl;
    this.$markerClusterer = null;

    this.$infoboxTemplate = this.$module.querySelector("[data-google-map-infobox-template]").innerHTML;
}

GoogleMaps.prototype.init = function (markers) {
    // this.$gmapApi = new GoogleMapsApi(this.$gmapApiKey);
    // this.$gmapApi.load().then(() => {


    // });

    this.$markersData = markers;

    

    if (this.$center != null){
        this.$center = new google.maps.LatLng(this.$center.lat, this.$center.lon);
    } else{
        this.$center =  new google.maps.LatLng(52.4387, 1.6478);
    }
    // safe to start using the API now
    this.$map = new google.maps.Map(this.$module, {
        center: this.$center,
        scrollwheel: false,
        zoom: 10,
        maxZoom: 14,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        },
        mapTypeControl: false,
        streetViewControl: false
    });

    if (this.$MarkerDataUrl != null) {
        this.GetResults();
    }

    if (this.$distance != null){
        this.addRadius(this.$distance);
    }


}

GoogleMaps.prototype.initMarkers = function (data) {

    let markerData = this.$markersData;
    this.setMarkersOnMap(markerData);

}
GoogleMaps.prototype.addRadius = function (distance) {

    var circ = new google.maps.Circle({
        strokeColor: "#111111",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#111111",
        fillOpacity: 0.35,
        map: this.$map,
        center: this.$center,
        radius: distance * 1609.0
    });
    this.$map.fitBounds(circ.getBounds());
};
GoogleMaps.prototype.addMarker = function (title, lat, lon, enableInfobox) {
    if (enableInfobox === void 0) { enableInfobox = true; }
    var markerData = {
        Title: title,
        Latitude: lat,
        Longitude: lon,
        Location: { Latitude: lat, Longitude: lon }
    };
    this.setMarkerOnMap(markerData, enableInfobox);
};
/**
 * Transforms the current MarkerData to google maps markers
 * and saves them in the markes array.
 */
GoogleMaps.prototype.setMarkersOnMap = function (markerData, enableInfobox) {
    if (enableInfobox === void 0) { enableInfobox = true; }
    var icon = {
        //url: '/images/icon.png?v=' + config.project.version,
        // This marker is 45 pixels wide by 40 pixels high.
        size: new google.maps.Size(45, 40),
        scaledSize: new google.maps.Size(45, 40),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 0).
        anchor: new google.maps.Point(0, 0)
    };
    // iterate over marker data and create a marker
    // also we will append the current marker data to the
    // google marker itself - maybe we will need it later
    for (var i = 0, max = markerData.length; i < max; i++) {
        this.setMarkerOnMap(markerData[i], enableInfobox);
    }
    // initialize MarkerClusterer        
    this.initMarkerClusterer();
    // Resize Event will be triggered once after markers are set.
    google.maps.event.trigger(this.$map, 'resize');
};
GoogleMaps.prototype.setMarkerOnMap = function (currentMarkerData, enableInfobox) {
    var _this = this;
    if (enableInfobox === void 0) { enableInfobox = true; }
    var markerObject = {
        position: new google.maps.LatLng(currentMarkerData.Location.Latitude, currentMarkerData.Location.Longitude),
        //  icon: icon,
        map: this.$map
    };
    if (window.InfoBox) {
        markerObject['infobox'] = this.getInfoBox(currentMarkerData);
    }
    var marker = new google.maps.Marker(markerObject);
    if (window.InfoBox) {
        // add on click handler to the marker itself
        // so it will open our infobox.
        var self = this;
        marker.addListener('click', function () {
            if (this.openInfoBox) {
                this.openInfoBox.close();
                if (this.openInfoBox === marker.infobox) {
                    this.openInfoBox = null;
                    return;
                }
            }
            marker.infobox.open(self.$map, marker);
            this.openInfoBox = marker.infobox;
        });
    }
    // add to controllers markers array.
    this.$markers.push(marker);
};
GoogleMaps.prototype.getLatLngByPostcode = function (postcode) {
    var geocoder = new google.maps.Geocoder();
};
//**
// * Generates an InfoBox Element using the InfoBox.JS Library
// * replacing the placeholder from the <script> tag and retrieves it.
// * 
// * @param {IMarkerData} markerData current markerData
// * @returns Instance of an InfoBox
// */
GoogleMaps.prototype.getInfoBox = function (markerData) {
    var infoBoxTemplate = this.$infoboxTemplate;
    var infoBoxTemplateData = {
        Title: markerData.Title,
        ShortDescription: markerData.ShortDescription,
        Url: markerData.VacancyUrl
    };
    var currentInfoBox = new InfoBox({
        content: Template(infoBoxTemplate, infoBoxTemplateData),
        disableAutoPan: false,
        maxWidth: 'auto',
        pixelOffset: new google.maps.Size(-132, -120),
        infoBoxClearance: new google.maps.Size(1, 1),
        closeBoxMargin: "5px 5px 2px 2px",
        closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif"
    });
    return currentInfoBox;
};
///**
// * Initialize MarkerClusterer with current Map & Markers
// * 
// * 
// * @memberOf MapController
// */
GoogleMaps.prototype.initMarkerClusterer = function () {
    
        this.$markerClusterer = new MarkerClusterer(this.$map, this.$markers, { imagePath: 'https://googlemaps.github.io/js-marker-clusterer/images/m' });
    
};


GoogleMaps.prototype.GetResults = function () {
    var map = this;
    var request = new XMLHttpRequest();
    request.open('GET', this.$MarkerDataUrl, true);

    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            // Success! 
            map.$markersData = JSON.parse(this.response).Results;
            map.initMarkers(map.$markersData);
        } else {
            // We reached our target server, but it returned an error

        }
    };

    request.onerror = function () {
        // There was a connection error of some sort
    };

    request.send();
}

GoogleMaps.prototype.LoadMarkers = function (markers) {

}
export default GoogleMaps