((function () {
    'use strict';

    Cobweb.prototype.modules.add('interaction-mode', function (instance) {
        var interactionModes = {
            all: {},
            add: function (name, callbacks) {
                this.all[name] = callbacks;
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

        instance.interaction = interactionModes;
    });
})());
