(function (window) {
    "use strict";
    var App = window.App || {};
    var $ = window.jQuery;

    /*
    * GMap constructor
    */
    function GMap(selector) {
        if (!selector) {
            throw new Error("No selector provided");
        }

        this.$map = $(selector);
        this.locationMarker = null;

        if (this.$map.length === 0) {
            throw new Error("Could not find element with selector: " + selector);
        }
    }

    GMap.prototype.addEventListener = function (fn) {
        google.maps.event.addListener(this.map, "click", fn);
    };

    GMap.prototype.initMap = function () {
        this.map = new google.maps.Map(this.$map[0], {
            zoom: 10,
            center: user_location
        });

        var self = this;
    };

    GMap.prototype.moveMarker = function (coords) {
        if (this.locationMarker) {
            this.locationMarker.setPosition(coords);
        } else {
            this.locationMarker = new google.maps.Marker({
                map: this.map,
                position: coords
            });
        }

        // Center of map
        this.map.panTo(new google.maps.LatLng(coords));
    };

    GMap.prototype.deleteMarker = function () {
        this.locationMarker.setMap(null);
        this.locationMarker = null;
    };

    App.GMap = GMap;
    window.App = App;
})(window);