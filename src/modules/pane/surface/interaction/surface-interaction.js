((function () {
    'use strict';

    Cobweb.prototype.modules.add('surface-interaction', function (instance) {
        instance.surface.setInteraction = function (surface, name) {
            var interactions = instance.surface.interaction;
            if (interactions.has(name))
                surface.attrData('surface-interaction', name);
        };

        instance.surface.getInteraction = function (surface) {
            var interactions = instance.surface.interaction;
            var name = surface.attrData('surface-interaction');
            return interactions.get(name);
        };

        instance.events.on('surface.create', function (surface) {
            surface.onmousemove = onSurfaceEvent;
            surface.onmousedown = onSurfaceEvent;
            surface.onmouseup = onSurfaceEvent;
            surface.onclick = onSurfaceEvent;
        });

        function onSurfaceEvent (event) {
            var common = instance.surface.interaction.get('common');
            var keepRunning = runCallback(common, event);
            if (keepRunning) {
                var callbacks = instance.surface.getInteraction(event.target);
                runCallback(callbacks, event);
            }
        }

        instance.events.on('pane.split', function (oldPane, newPane) {
            newPane.attrData('surface-interaction', oldPane.attrData('surface-interaction'));
        });
    }, ['interaction-mode', 'surface']);

    function runCallback (callbacks, event) {
        switch (event.type) {
            case 'mousemove': return callbacks.onMouseMove(event);
            case 'mousedown': return callbacks.onMouseDown(event);
            case 'mouseup': return callbacks.onMouseUp(event);
            case 'click': return callbacks.onClick(event);
        }
    }
})());
