((function () {
    'use strict';

    Cobweb.prototype.modules.add('render-modes', function (instance) {
        instance.surface.renders = {
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
    }, ['surface']);
})());
