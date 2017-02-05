((function () {
    'use strict';

    Cobweb.prototype.modules.add('pane-types', function (instance) {
        var paneTypes = {
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

        instance.events.on('pane.split', function (oldPane, newPane) {
            var oldType = oldPane.attrData('pane-type');
            if (oldType) instance.pane.setType(newPane, oldType);
        });

        instance.pane.types = paneTypes;

        instance.pane.setType = function (pane, name) {
            if (this.types.has(name)) {
                var typeCallbacks = this.types.get(name);
                typeCallbacks.onPaneType(pane, instance);
                var paneHeader = pane.querySelector('.pane-header');
                typeCallbacks.onCreateHeader(paneHeader, instance);
                pane.attrData('pane-type', name);
            }
        };
    }, ['pane']);
})());
