(function (window) {
    "use strict";
    var App = window.App || {};
    var $ = window.jQuery;

    /**
    * Autocomplete constructor
     * @param {string} selector jQuery selector for the input element
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

    /**
     * Adds change event listener to the autocomplete field
     * @param {function} fn Function to execute when input is changed
     */
    Autocomplete.prototype.addEventListener = function (fn) {
        google.maps.event.addListener(this.autocomplete, 'place_changed', fn);
    };

    /**
     * Sets address of input field from coordinates
     * @param {object} coords Object with fields: 'lat' and 'lng' and integer values
     */
    Autocomplete.prototype.setAddress = function (coords) {
        getAddressFromCoordinates(coords, function (address) {
            $(LOCATION_INPUT_SELECTOR).val(address.formatted_address);
        });
    };

    App.Autocomplete = Autocomplete;
    window.App = App;
})(window);
