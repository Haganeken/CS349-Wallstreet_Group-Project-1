(function (window) {
    "use strict";
    var App = window.App || {};
    var $ = window.jQuery;

    /**
     * FormHandler constructor
     * @param {string} selector jQuery selector for the form element
     */
    function FormHandler(selector) {
        if (!selector) {
            throw new Error("No selector provided");
        }

        this.$formElement = $(selector);

        if (this.$formElement.length === 0) {
            throw new Error("Could not find element with selector: " + selector);
        }
    }

    /**
     * Adds a callback with form data when a form is submitted
     * @param {function} fn Function to execute when form is submitted
     */
    FormHandler.prototype.addSubmitHandler = function (fn) {
        this.$formElement.on("submit", function (event) {
            event.preventDefault();

            var data = {};
            $(this).serializeArray().forEach(function (item) {
                data[item.name] = item.value;
            });
            fn(data);
            this.reset();
            this.elements[0].focus();
        });
    };

    App.FormHandler = FormHandler;
    window.App = App;
})(window);
