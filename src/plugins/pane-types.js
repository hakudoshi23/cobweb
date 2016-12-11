((function () {
    'use strict';

    Cobweb.prototype.plugins.add('pane-types', function (instance) {
        var paneTypes = {
            availables: {},
            defaultType: null,
            add: function (name, callback) {
                this.availables[name] = callback;
                if (!this.defaultType)
                    this.defaultType = name;
            },
            remove: function (name) {
                delete this.availables[name];
                if (this.defaultType === name)
                    this.defaultType = Object.keys(this.availables)[0];
            },
            setType: function (pane, name) {
                var callback = this.availables[name];
                callback(pane, instance);
                pane.attrData('pane-type', name);
            }
        };

        paneTypes.add('default', function (pane, instance) {
            instance.logger.debug('Default pane type (this does nothing)');
        });

        var root = document.querySelector('.cb-container .pane');
        var type = paneTypes.defaultType;
        if (type) paneTypes.setType(root, type);

        instance.events.on('pane.split', function (oldPane, newPane) {
            var oldType = oldPane.attrData('pane-type');
            if (oldType) paneTypes.setType(newPane, oldType);
        });

        instance.pane.types = paneTypes;
    }, ['pane']);
})());
