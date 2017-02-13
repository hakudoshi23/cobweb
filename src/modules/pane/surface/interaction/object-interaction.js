((function () {
    'use strict';

    Modules.prototype.add('object-interaction', function (instance) {
        instance.surface.interactions.object = {
            onMouseWheel: function (event, realCoords) {
                return true;
            },
            onMouseMove: function (event, realCoords) {
                return true;
            },
            onMouseDown: function (event, realCoords) {
                return true;
            },
            onMouseUp: function (event, realCoords) {
                return true;
            },
            onClick: function (event, realCoords) {
                return true;
            }
        };

        instance.events.on('surface.create', function (surface) {
            instance.surface.setInteraction(surface, 'object');
        });

    }, ['surface-interaction']);
})());
