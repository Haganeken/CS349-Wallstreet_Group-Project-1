(function (window) {
    "use strict";
    var App = window.App || {};
    var $ = window.jQuery;

    /**
     * GMap constructor
     * @param {string} selector jQuery selector for the map element
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

    /**
     * Adds click event listener to the map, function needs to be specified
     * @param {function} fn Function to execute when map is clicked
     */
    GMap.prototype.addEventListener = function (fn) {
        google.maps.event.addListener(this.map, "click", fn);
    };

    /**
     * Initializes map with center on user
     */
    GMap.prototype.initMap = function () {
        this.map = new google.maps.Map(this.$map[0], {
            zoom: 10,
            center: user_location
        });
    };

    /**
     * Moves an existing marker to new coordinates or places a new one on the coordinates if no marker exists.
     * @param {object} coords Coordinates with fields: 'lat' and 'lng' and integer values
     */
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

    /**
     * Deletes marker
     */
    GMap.prototype.deleteMarker = function () {
        this.locationMarker.setMap(null);
        this.locationMarker = null;
    };

    App.GMap = GMap;
    window.App = App;
})(window);

/**
 * Gets formatted address from coordinates and calls callback on success
 * @param {object} coords Coordinates with fields: 'lat' and 'lng' and integer values
 * @param {function} cb Callback function with address {string} as parameter.
 */
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

/**
 * Opens new window with directions from user location to address on selected card
 */
let getDirections = function () {
    var url = "https://www.google.dk/maps/dir/";
    getAddressFromCoordinates(user_location, function (address) {
        url += encodeURI(address.formatted_address);
        url += "/" + encodeURI($(MODAL_LOCATION_SELECTOR).text());
        window.open(url);
    });
};

/**
 * Gets user location and assigns coordinates to global variable
 * @param {function} cb Callback function
 */
let getUserLocation = function (cb) {
    navigator.geolocation.getCurrentPosition(function (position) {
        user_location = {"lat": position.coords.latitude, "lng": position.coords.longitude};
        cb()
    }, function (error) {
        alert('Please accept location services in order to use dog-date');
        user_location = null;
    });
};

/**
 * Gets coordinates from a formatted address, calls callback with coordinates on success
 */
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