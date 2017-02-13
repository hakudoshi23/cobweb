((function () {
    'use strict';

    Cobweb.prototype.modules.add('pane-types', function (instance) {

        instance.events.on('pane.split', function (oldPane, newPane) {
            var oldType = oldPane.attrData('pane-type');
            if (oldType) instance.pane.setType(newPane, oldType);
        });

        instance.pane.types = {};

        instance.pane.setType = function (pane, name) {
            if (this.types[name]) {
                var typeCallbacks = this.types[name];
                typeCallbacks.onPaneType(pane, instance);
                var paneHeader = pane.querySelector('.pane-header');
                typeCallbacks.onCreateHeader(paneHeader, instance);
                pane.dataset.paneType = name;
            }
        };
    }, ['pane']);
})());
