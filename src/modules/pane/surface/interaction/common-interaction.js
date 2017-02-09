((function () {
    'use strict';

    var originalRotation = null;
    var mouseDownCoords = null;

    Cobweb.prototype.modules.add('common-interaction', function (instance) {
        instance.surface.interaction.add('common', {
            onMouseMove: function (event, realCoords) {
                if (event.target.dataset.moving) {
                    var canvas = event.target;
                    var data = instance.surface.data[canvas.id];
                    if (data) {
                        var delta = getCoordsDelta(mouseDownCoords, realCoords);
                        console.debug('delta: ', delta, originalRotation);
                        combine(data.surface.rotation, originalRotation, delta);
                    }
                }
                return false;
            },
            onMouseDown: function (event, realCoords) {
                event.target.dataset.moving = 'true';

                var canvas = event.target;
                var data = instance.surface.data[canvas.id];
                originalRotation = data.surface.rotation.slice();
                mouseDownCoords = realCoords;

                return true;
            },
            onMouseUp: function (event, realCoords) {
                delete event.target.dataset.moving;

                var canvas = event.target;
                var data = instance.surface.data[canvas.id];
                var delta = getCoordsDelta(mouseDownCoords, realCoords);
                combine(data.surface.rotation, originalRotation, delta);
                mouseDownCoords = null;

                return true;
            },
            onClick: function (event, realCoords) {
                return true;
            }
        });
    }, ['surface-interaction']);

    function combine (target, originalRotation, delta) {
        if (!originalRotation) return;
        target[0] = originalRotation[0] + delta[0] * 0.005;
        target[1] = originalRotation[1] + delta[1] * 0.005;
    }

    function getCoordsDelta (initial, current) {
        if (!initial) return [0, 0];
        return [
            initial[0] - current[0],
            initial[1] - current[1]
        ];
    }
})());
