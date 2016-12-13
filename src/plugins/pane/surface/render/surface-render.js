((function () {
    'use strict';

    Cobweb.prototype.plugins.add('surface-render', function (instance) {
        instance.pane.setRender = function (pane, name) {
            var renders = instance.graphics.renders;
            if (renders.has(name))
                pane.attrData('surface-render', name);
        };

        instance.pane.getRender = function (pane) {
            var renders = instance.graphics.renders;
            var name = pane.attrData('surface-render');
            return renders.get(name);
        };

        instance.events.on('pane.split', function (oldPane, newPane) {
            newPane.attrData('surface-render', oldPane.attrData('surface-render'));
        });
    }, ['graphics-render']);
})());
