((function () {
    'use strict';

    Cobweb.prototype.modules.add('surface-render', function (instance) {
        instance.surface.setRender = function (surface, name) {
            var renders = instance.surface.renders;
            if (renders.has(name))
                surface.attrData('render', name);
        };

        instance.surface.getRender = function (surface) {
            var renders = instance.surface.renders;
            var name = surface.attrData('render');
            return renders.get(name);
        };

        var panes = document.querySelectorAll('.pane');
        for (var i = 0; i < panes.length; i++) {
            if (panes[i].dataset.paneType == 'surface') {
                var canvas = panes[i].querySelector('canvas');
                canvas.dataset.render = 'solid';
            }
        }

        instance.events.on('pane.split', function (oldPane, newPane) {
            newPane.attrData('surface-render', oldPane.attrData('surface-render'));
        });
    }, ['render-modes']);
})());
