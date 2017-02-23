((function () {
    'use strict';

    Modules.prototype.add('edit-interaction', function (instance) {
        instance.surface.interactions.edit = {
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
                    var ray = data.camera.getRayFromCamera(null, realCoords,
                        [canvas.width, canvas.height]);

                    var isHit = false, hitPoint = vec3.create();
                    instance.scene.getObjects().forEach(function (node) {
                        var items = node.data.bounds.getCollidingItems(ray);
                        items.forEach(function (item) {
                            console.debug(item._halfEdge.getFaces());
                        });
                        /*isHit = geo.testRayBBox(ray.start, ray.direction, node.data.mesh.bounding, node.data.model, hitPoint);
                        if (isHit) {
                            node.data.selected = true;
                        } else delete node.data.selected;*/
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

        instance.events.on('surface.create', function (surface) {
            instance.surface.setInteraction(surface, 'edit');
        });

    }, ['surface-interaction']);
})());
