((function () {
    'use strict';

    Cobweb.prototype.modules.add('pane-types', function (instance) {
        var paneTypes = {
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

        paneTypes.add('default', function (pane, instance) {
            instance.logger.debug('Default pane type (this does nothing)');
        });

        instance.events.on('pane.split', function (oldPane, newPane) {
            var oldType = oldPane.attrData('pane-type');
            if (oldType) instance.pane.setType(newPane, oldType);
        });

        instance.pane.types = paneTypes;

        instance.pane.setType = function (pane, name) {
            if (this.types.has(name)) {
                this.types.get(name)(pane, instance);
                pane.attrData('pane-type', name);
            }
        };
    }, ['pane']);
})());
