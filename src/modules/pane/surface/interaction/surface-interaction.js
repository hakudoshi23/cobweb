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

        instance.surface.onRender = function (canvas, surface) {
            var keepRunning = true;
            var callbacks = instance.surface.getInteractionCallbacks(canvas);
            if (callbacks.onRender) keepRunning = callbacks.onRender(surface);
            if (keepRunning) {
                var common = instance.surface.interactions.common;
                common.onRender(surface);
            }
        };

        instance.events.on('surface.create', function (surface) {
            surface.tabIndex = 1000;

            surface.oncontextmenu = onContextMenu;

            surface.onkeydown = onSurfaceEvent;
            surface.onkeyup = onSurfaceEvent;

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
            case 'keydown': if (callbacks.onKeyDown) return callbacks.onKeyDown(event, realCoords); break;
            case 'keyup': if (callbacks.onKeyUp) return callbacks.onKeyUp(event, realCoords); break;

            case 'mousewheel': if (callbacks.onMouseWheel) return callbacks.onMouseWheel(event, realCoords); break;
            case 'mousemove': if (callbacks.onMouseMove) return callbacks.onMouseMove(event, realCoords); break;
            case 'mousedown': if (callbacks.onMouseDown) return callbacks.onMouseDown(event, realCoords); break;
            case 'mouseup': if (callbacks.onMouseUp) return callbacks.onMouseUp(event, realCoords); break;
            case 'click': if (callbacks.onClick) return callbacks.onClick(event, realCoords); break;
        }
        return true;
    }

    function getLocalCoordinates (event) {
        return [event.layerX, event.layerY];
    }

    function onContextMenu (event) {
        event.preventDefault();
        return false;
    }
})());
