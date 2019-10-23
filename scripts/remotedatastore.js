(function (window) {
    "use strict";
    var App = window.App || {};
    var $ = window.jQuery;

    function RemoteDataStore(url) {
        if (!url) {
            throw new Error("No remote URL supplied.");
        }

        this.serverUrl = url;
        this.emailMap = {};
        this.idMap = {};
    }

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

    RemoteDataStore.prototype.getAll = function (cb) {
        $.get(this.serverUrl, function (serverResponse) {
            console.log(serverResponse);
            cb(serverResponse);
        });
    };

    RemoteDataStore.prototype.get = function (key, cb) {
        $.get(this.serverUrl + "/" + this.emailMap[key], function (serverResponse) {
            console.log(serverResponse);
            cb(serverResponse);
        });
    };

    RemoteDataStore.prototype.remove = function (key) {
        $.ajax(this.serverUrl + "/" + this.emailMap[key], {
            type: "DELETE"
        });
    };

    App.RemoteDataStore = RemoteDataStore;
    window.App = App;

})(window);
