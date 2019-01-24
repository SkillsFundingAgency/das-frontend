import GoogleMaps from '../googleMaps/_googleMaps';


function SearchResults($module, $apiKey) {
    this.$module = $module;
    this.$gmapApi = null;
    this.$gmapApiKey = $apiKey;
    this.$map = null;

    this.$searchResultsUrl = this.$module.dataset.searchresultsurl;
    this.$mapElementId = this.$module.dataset.mapId;

    this.mainContentElement = $module;
    this.searchResultsElement = document.getElementById("vacancy-search-results");
    this.lat = parseFloat(document.getElementById("Latitude").value);
    this.lon = parseFloat(document.getElementById("Longitude").value);
    this.distance = parseFloat(document.getElementById("Distance").value);
    this.center = { latitude: this.lat, longitude: this.lon };
    this.markersData = null;
}

SearchResults.prototype.init = function () {

    this.$map = new GoogleMaps(this.$mapElementId, this.center);

     this.$map.init();
   // map.addRadius(this.distance);

   // this.GetResults();
    // searchResults.forEach(function (element) {
    //     var center = { latitude: element.dataset.lat, longitude: element.dataset.lon };
    //     var resultMap = new MapController(element, center, null);
    //     resultMap.addMarker(element.dataset.id, parseFloat(element.dataset.lat), parseFloat(element.dataset.lon), false);
    // });
}



export default SearchResults