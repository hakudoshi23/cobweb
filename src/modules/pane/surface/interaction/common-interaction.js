((function () {
    'use strict';

    var originalRotation = null;
    var mouseDownCoords = null;

    Modules.prototype.add('common-interaction', function (instance) {
        instance.surface.interactions.common = {
            onMouseWheel: function (event, realCoords) {
                var canvas = event.target;
                var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
                delta /= 2;

                var data = instance.surface.map[canvas.id];
                data.camera.distance -= delta;
                data.camera.distance = Math.max(data.camera.distance, 0);

                return true;
            },
            onMouseMove: function (event, realCoords) {
                if (event.target.dataset.moving) {
                    var canvas = event.target;
                    var data = instance.surface.map[canvas.id];
                    if (data) {
                        var delta = getCoordsDelta(mouseDownCoords, realCoords);
                        combine(data.camera, originalRotation, delta);
                    }
                }
                return false;
            },
            onMouseDown: function (event, realCoords) {
                var canvas = event.target;
                var data = instance.surface.map[canvas.id];
                if (event.which === 3) {
                    event.target.dataset.moving = 'true';
                    upNormalMouseDown = vec3.equals(data.camera.getUpDirection(), [0, 1, 0]);
                    originalRotation = data.camera.rotation.slice();
                    mouseDownCoords = realCoords;
                    return false;
                }
                return true;
            },
            onMouseUp: function (event, realCoords) {
                if (event.which === 3) {
                    delete event.target.dataset.moving;
                    var data = instance.surface.map[event.target.id];
                    mouseDownCoords = null;
                }
                return true;
            },
            onClick: function (event, realCoords) {
                return true;
            },
            onRender: function (surface) {}
        };
    }, ['surface-interaction']);

    var upNormalMouseDown = true;
    function combine (surface, originalRotation, delta) {
        if (!originalRotation) return;
        if (!upNormalMouseDown) delta[0] = -delta[0];

        var rotation = surface.rotation;
        rotation[0] = originalRotation[0] + delta[0] * 0.005;
        rotation[1] = originalRotation[1] + delta[1] * 0.005;
        clampRotations(rotation);
    }

    function getCoordsDelta (initial, current) {
        if (!initial) return [0, 0];
        return [
            initial[0] - current[0],
            current[1] - initial[1]
        ];
    }

    function clampRotations (rotations) {
        var pi2 = Math.PI * 2;
        if (rotations[0] < 0) rotations[0] = pi2 + rotations[0];
        if (rotations[0] >= pi2) rotations[0] = rotations[0] - pi2;
        if (rotations[1] < 0) rotations[1] = pi2 + rotations[1];
        if (rotations[1] >= pi2) rotations[1] = rotations[1] - pi2;
    }
})());
