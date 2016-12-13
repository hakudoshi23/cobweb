((function () {
    'use strict';

    Cobweb.prototype.plugins.add('graphics-render', function (instance) {
        instance.graphics.renders = {
            all: {},
            add: function (name, callback) {
                this.all[name] = callback;
            },
            get: function (name) {
                return this.all[name];
            },
            remove: function (name) {
                delete this.all[name];
            },
            has: function (name) {
                return !!this.all[name];
            }
        };
    }, ['graphics']);
})());
