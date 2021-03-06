((function() {
    'use strict';

    var EventHandler = function (isDebug) {
        this.isDebug = !!isDebug;
        this.listeners = {};
    };

    EventHandler.prototype.trigger = function() {
        var name = arguments[0];
        var listeners = this.listeners[name] || [];
        Array.prototype.splice.call(arguments, 0, 1);
        if (this.isDebug) console.debug(name, arguments);
        for (var i = 0; i < listeners.length; i++)
            listeners[i].apply(null, arguments);
    };

    EventHandler.prototype.on = function(name, callback) {
        if (!this.listeners[name]) this.listeners[name] = [];
        this.listeners[name].push(callback);
    };

    EventHandler.prototype.off = function(name) {
        delete this.listeners[name];
    };

    EventHandler.prototype.off = function(name, callback) {
        if (this.listeners[name]) {
            var array = this.listeners[name];
            if (array.indexOf(callback) > -1) array.splice(index, 1);
        }
    };

    EventHandler.prototype.reset = function() {
        var own = this;
        Object.keys(this.listeners).forEach(function(key) {
            delete own.listeners[key];
        });
    };

    window.EventHandler = EventHandler;
})());
