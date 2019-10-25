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


let getAddressFromCoordinates = function (coords, cb) {
    let latlng = "latlng=" + coords['lat'] + "," + coords['lng'];
    let API_KEY = "key=AIzaSyCTLJXDOMiF29v6kSlOxCZZZ2I3cXZJtco";
    let url = "https://maps.googleapis.com/maps/api/geocode/json?" + latlng + "&" + API_KEY;

    $.ajax({
        url: url,
        success: function (data) {
            let address = data.results[0]; // Choose first address in results list
            cb(address);
        }
    });
};

let getDirections = function () {
    var url = "https://www.google.dk/maps/dir/";
    getAddressFromCoordinates(user_location, function (address) {
        url += encodeURI(address.formatted_address);
        url += "/" + encodeURI($(MODAL_LOCATION_SELECTOR).text());
        window.open(url);
    });
};

let getUserLocation = function (cb) {
    navigator.geolocation.getCurrentPosition(function (position) {
        user_location = {"lat": position.coords.latitude, "lng": position.coords.longitude};
        cb()
    }, function (error) {
        alert('Please accept location services in order to use dog-date');
        user_location = null;
    });
};

let getAddressCoordinates = function (address, cb) {
    let API_KEY = "key=AIzaSyCTLJXDOMiF29v6kSlOxCZZZ2I3cXZJtco";
    let url = "https://maps.googleapis.com/maps/api/geocode/json?" + address + "&" + API_KEY;
    $.ajax({
        url: url,
        success: function (data) {
            // Choose first matching address
            cb(data.results[0].geometry.location);
        }
    });
};