(function (window) {
    "use strict";
    var App = window.App || {};
    var $ = window.jQuery;

    /*
    * Autocomplete constructor
    */
    function Autocomplete(selector) {
        if (!selector) {
            throw new Error("No selector provided");
        }

        this.$input = $(selector);

        if (this.$input.length === 0) {
            throw new Error("Could not find element with selector: " + selector);
        }

        let input = this.$input[0];
        this.autocomplete = new google.maps.places.Autocomplete(input);
    }

    Autocomplete.prototype.addEventListener = function (fn) {
        google.maps.event.addListener(this.autocomplete, 'place_changed', fn);
    };

    Autocomplete.prototype.setAddress = function (coords) {
        let latlng = "latlng=" + coords['lat'] + "," + coords['lng'];
        let API_KEY = "key=AIzaSyCTLJXDOMiF29v6kSlOxCZZZ2I3cXZJtco";
        let url = "https://maps.googleapis.com/maps/api/geocode/json?" + latlng + "&" + API_KEY;

        $.ajax({
            url: url,
            success: function (data) {
                let address = data.results[0]; // Choose first address in results list
                $(LOCATION_INPUT_SELECTOR).val(address.formatted_address);
            }
        });
    };

    App.Autocomplete = Autocomplete;
    window.App = App;
})(window);
