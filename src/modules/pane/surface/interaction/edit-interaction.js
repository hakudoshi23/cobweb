((function () {
    'use strict';

    var isMouseDown = false;
    var initialHitPoint = [0, 0, 0];

    Modules.prototype.add('edit-interaction', function (instance) {
        instance.surface.interactions.edit = {
            onMouseWheel: function (event, realCoords) {
                return true;
            },
            onMouseMove: function (event, realCoords) {
                if (isMouseDown && !this.selection.isEmpty()) {
                    var canvas = event.target;
                    var data = instance.surface.map[canvas.id];
                    var object = this.selection.objects[0];

                    var ray = data.camera.getRay(null, realCoords,
                        [canvas.width, canvas.height]);
                    var cameraDirection = data.camera.getDirection();
                    var face = this.selection.faces[0];

                    var hitPoint = [0, 0, 0];
                    if (Math.geo.rayPlaneCollision(ray.start, ray.direction, initialHitPoint, cameraDirection, hitPoint)) {
                        var diff = [0, 0, 0];
                        vec3.sub(diff, hitPoint, initialHitPoint);
                        face.getVertices().forEach(function (vertex) {
                            vec3.add(vertex, vertex.originalPosition, diff);
                            object.bounds.updateDimensions();
                            object.bump();
                        });
                    }
                }
                return true;
            },
            onMouseDown: function (event, realCoords) {
                var canvas = event.target;
                var data = instance.surface.map[canvas.id];
                if (event.which === 1) {
                    isMouseDown = true;

                    var ray = data.camera.getRay(null, realCoords,
                        [canvas.width, canvas.height]);

                    var selection = this.selection;
                    instance.scene.getObjects().forEach(function (node) {
                        //selection.clear();
                        selection.add(ray, node.data, data.camera.position);
                        node.data.mesh.bump();
                    });
                    return false;
                }
                return true;
            },
            onMouseUp: function (event, realCoords) {
                isMouseDown = false;
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
