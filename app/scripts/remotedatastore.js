(function (window) {
    "use strict";
    var App = window.App || {};
    var $ = window.jQuery;

    /**
     * RemoteDataStore constructor
     * @param {string} url Remote url to mongoDB
     */
    function RemoteDataStore(url) {
        if (!url) {
            throw new Error("No remote URL supplied.");
        }

        this.serverUrl = url;
        this.emailMap = {};
        this.idMap = {};
    }

    /**
     * Adds data to database
     * @param {string} key Email to add to mapping variables
     * @param {object} val Data to add to the database. Fields vary depending on database structure
     * @param {function} cb Callback function. Called on server response
     */
    RemoteDataStore.prototype.add = function (key, val, cb) {
        var self = this;
        $.post(this.serverUrl, val, function (serverResponse) {
            self.emailMap[key] = serverResponse.id;
            self.idMap[serverResponse.id] = key;
            if (cb) {
                cb();
            }
        });
    };

    /**
     * Gets all entries in the database and calls callback with response
     * @param {function} cb Callback function. Called on server response
     */
    RemoteDataStore.prototype.getAll = function (cb) {
        $.get(this.serverUrl, function (serverResponse) {
            cb(serverResponse);
        });
    };

    /**
     * Gets a specific entry in the database. Accepts id and email as key input. Calls callback with response.
     * @param {string} key id or email. Gets most recently added card if email is given
     * @param {function} cb Callback function with response parameter. Called on server response
     */
    RemoteDataStore.prototype.get = function (key, cb) {
        var str;
        if (key.includes("@")) {
            str = this.emailMap[key]
        } else {
            str = key.toString();
        }
        $.get(this.serverUrl + "/" + str, function (serverResponse) {
            if (cb) {
                cb(serverResponse);
            }
        });
    };

    /**
     * Updates an entry in the database.
     * @param {string} key id or email. Gets most recently added card if email is given
     * @param {object} data Data with update values. Fields vary depending on database structure
     * @param {function} cb Callback function. Called on server response
     */
    RemoteDataStore.prototype.update = function (key, data, cb) {
        var str;
        if (key.includes("@")) {
            str = this.emailMap[key]
        } else {
            str = key.toString();
        }

        $.ajax({
            url: this.serverUrl + "/" + str,
            type: 'PUT',
            data: data,
            success: function (serverResponse) {
                if (cb) {
                    cb(serverResponse);
                }
            }
        });
    };

    /**
     * Removes an entry from the database
     * @param {string} key id or email. Gets most recently added card if email is given
     */
    RemoteDataStore.prototype.remove = function (key) {
        var str;
        if (key.includes("@")) {
            str = this.emailMap[key]
        } else {
            str = key.toString();
        }
        $.ajax(this.serverUrl + "/" + str, {
            type: "DELETE"
        });
    };

    App.RemoteDataStore = RemoteDataStore;
    window.App = App;

})(window);
