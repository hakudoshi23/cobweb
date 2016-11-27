'use strict';

((function () {
    Cobweb.prototype.plugins = new function() {
        this.available = {};

        this.add = function() {
            var name, dep, func;

            if (arguments.length == 2) {
                name = arguments[0];
                func = arguments[1];
                dep = [];

                if (typeof name !== 'string') throw new Error('Parameter 1: expected string, found ' + typeof name);
                if (typeof func !== 'function') throw new Error('Parameter 1: expected function, found ' + typeof func);
            } else if (arguments.length == 3) {
                name = arguments[0];
                dep = arguments[1];
                func = arguments[2];

                if (typeof name !== 'string') throw new Error('Parameter 1: expected string, found ' + typeof name);
                if (typeof dep !== 'array') throw new Error('Parameter 2: expected array, found ' + typeof dep);
                if (typeof func !== 'function') throw new Error('Parameter 3: expected function, found ' + typeof func);
            } else {
                throw new Error('Invalid parameters: must be 2 or 3, found ' + arguments.length);
            }

            this.available[name] = {
                dependencies: dep,
                callback: func
            };
        };

        this.load = function(instance) {
            instance.plugins = {};
            for (var name in this.available) {
                try {
                    var plugin = new this.available[name].callback(instance);
                    instance.events.trigger('plugins.loaded', name);
                    instance.plugins[name] = plugin;
                } catch (ex) {
                    instance.events.trigger('plugins.error', name, ex);
                }
            }
            instance.events.trigger('plugins.loaded.all', Object.keys(instance.plugins));
        };
    };
})());
