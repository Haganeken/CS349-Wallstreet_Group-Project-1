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
            cb(serverResponse);
        });
    };

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
