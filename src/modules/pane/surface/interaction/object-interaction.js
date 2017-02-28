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
                var canvas = event.target;
                var data = instance.surface.map[canvas.id];
                if (event.which === 1) {
                    var ray = data.camera.getRay(null, realCoords,
                        [canvas.width, canvas.height]);

                    var isHit = false, hitPoint = vec3.create();
                    instance.scene.getObjects().forEach(function (node) {
                        isHit = geo.testRayBBox(ray.start, ray.direction, node.data.mesh.bounding, node.data.model, hitPoint);
                        if (isHit) {
                            node.data.selected = true;
                        } else delete node.data.selected;
                    });
                    return false;
                }
                return true;
            },
            onMouseUp: function (event, realCoords) {
                return true;
            },
            onClick: function (event, realCoords) {
                return true;
            }
        };

    }, ['surface-interaction']);
})());
