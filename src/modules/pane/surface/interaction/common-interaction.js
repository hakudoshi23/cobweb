((function () {
    'use strict';

    var originalRotation = null;
    var mouseDownCoords = null;

    Modules.prototype.add('common-interaction', function (instance) {
        instance.surface.interactions.common = {
            onMouseWheel: function (event, realCoords) {
                var canvas = event.target;
                var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));

                var data = instance.surface.map[canvas.id];
                data.surface.distance -= delta;

                return true;
            },
            onMouseMove: function (event, realCoords) {
                if (event.target.dataset.moving) {
                    var canvas = event.target;
                    var data = instance.surface.map[canvas.id];
                    if (data) {
                        var delta = getCoordsDelta(mouseDownCoords, realCoords);
                        combine(data.surface.rotation, originalRotation, delta);
                    }
                }
                return false;
            },
            onMouseDown: function (event, realCoords) {
                var canvas = event.target;
                var data = instance.surface.map[canvas.id];
                if (event.which === 2) {
                    event.target.dataset.moving = 'true';
                    originalRotation = data.surface.rotation.slice();
                    mouseDownCoords = realCoords;
                } else if (event.which === 1) {
                    var surface = data.surface;

                    var ray = surface.getRayFromCamera(null, realCoords,
                        [canvas.width, canvas.height]);

                    /* @Refactor this is testing code, this shouldn't be here */
                    var hitPoint = vec3.create();
                    var cube = instance.scene.children[0];
                    var hit = geo.testRayBBox(ray.start, ray.direction, cube.data.mesh.bounding, cube.data.model, hitPoint);
                    console.debug(hit, hitPoint);
                }
                return true;
            },
            onMouseUp: function (event, realCoords) {
                if (event.which === 2) {
                    delete event.target.dataset.moving;
                    var canvas = event.target;
                    var data = instance.surface.map[canvas.id];
                    var delta = getCoordsDelta(mouseDownCoords, realCoords);
                    combine(data.surface.rotation, originalRotation, delta);
                    mouseDownCoords = null;
                }
                return true;
            },
            onClick: function (event, realCoords) {
                return true;
            }
        };
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
