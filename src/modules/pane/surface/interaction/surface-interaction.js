((function () {
    'use strict';

    Modules.prototype.add('surface-interaction', function (instance) {
        instance.surface.interactions = {};

        instance.surface.setInteraction = function (surface, name) {
            surface.dataset.interaction = name;
        };

        instance.surface.getInteractionCallbacks = function (surface) {
            var interactionName = surface.dataset.interaction;
            return instance.surface.interactions[interactionName];
        };

        instance.events.on('surface.create', function (surface) {
            surface.onmousewheel = onSurfaceEvent;
            surface.onmousemove = onSurfaceEvent;
            surface.onmousedown = onSurfaceEvent;
            surface.onmouseup = onSurfaceEvent;
            surface.onclick = onSurfaceEvent;
        });

        function onSurfaceEvent (event) {
            var callbacks = instance.surface.getInteractionCallbacks(event.target);
            var keepRunning = runCallback(callbacks, event);
            if (keepRunning) {
                var common = instance.surface.interactions.common;
                runCallback(common, event);
            }
        }

        instance.events.on('pane.split', function (oldPane, newPane) {
            var initialValue = oldPane.dataset.interaction;
            newPane.dataset.interaction = initialValue;
        });
    }, ['surface']);

    function runCallback (callbacks, event) {
        var realCoords = getLocalCoordinates(event);
        switch (event.type) {
            case 'mousewheel': return callbacks.onMouseWheel(event, realCoords);
            case 'mousemove': return callbacks.onMouseMove(event, realCoords);
            case 'mousedown': return callbacks.onMouseDown(event, realCoords);
            case 'mouseup': return callbacks.onMouseUp(event, realCoords);
            case 'click': return callbacks.onClick(event, realCoords);
        }
    }

    function getLocalCoordinates (event) {
        return [event.layerX, event.layerY];
    }
})());
