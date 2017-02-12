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
            surface.onmousewheel = onSurfaceEvent;
            surface.onmousemove = onSurfaceEvent;
            surface.onmousedown = onSurfaceEvent;
            surface.onmouseup = onSurfaceEvent;
            surface.onclick = onSurfaceEvent;
        });

        function onSurfaceEvent (event) {
            var callbacks = instance.surface.getInteraction(event.target);
            var keepRunning = runCallback(callbacks, event);
            if (keepRunning) {
                var common = instance.surface.interaction.get('common');
                runCallback(common, event);
            }
        }

        instance.events.on('pane.split', function (oldPane, newPane) {
            newPane.attrData('surface-interaction', oldPane.attrData('surface-interaction'));
        });
    }, ['interaction-mode', 'surface']);

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
        var coordinates;
        if (event.pageX || event.pageY) {
            coordinates = [event.pageX, event.pageY];
        } else {
            coordinates = [
                event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
                event.clientY + document.body.scrollTop + document.documentElement.scrollTop
            ];
        }
        coordinates[0] -= event.target.offsetLeft;
        coordinates[1] -= event.target.offsetTop;
        return coordinates;
    }
})());
