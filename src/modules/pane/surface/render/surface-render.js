((function () {
    'use strict';

    Modules.prototype.add('surface-render', function (instance) {
        instance.surface.renders = {};

        instance.surface.setRender = function (surface, name) {
            surface.dataset.render = name;
        };

        instance.surface.getRender = function (surface) {
            var renderName = surface.dataset.render;
            return instance.surface.renders[renderName];
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
    }, ['surface']);
})());
