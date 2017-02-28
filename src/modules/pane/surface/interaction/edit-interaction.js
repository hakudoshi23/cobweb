((function () {
    'use strict';

    Modules.prototype.add('edit-interaction', function (instance) {
        instance.surface.interactions.edit = {
            onMouseWheel: function (event, realCoords) {
                return true;
            },
            onMouseMove: function (event, realCoords) {
                if (!this.selection.isEmpty()) {
                    var canvas = event.target;
                    var data = instance.surface.map[canvas.id];

                    var ray = data.camera.getRay(null, realCoords,
                        [canvas.width, canvas.height]);
                    var cameraDirection = data.camera.getDirection();
                    var face = this.selection.faces[0];
                    var faceCenter = face.computeCenter();

                    var hitPoint = [0, 0, 0];
                    if (Math.geo.rayPlaneCollision(ray.start, ray.direction, faceCenter, cameraDirection, hitPoint)) {
                        var diff = [0, 0, 0];
                        vec3.sub(diff, hitPoint, faceCenter);
                        face.getVertices().forEach(function (vertex) {
                            vec3.add(vertex, vertex, diff);
                        });
                    }
                }
                return true;
            },
            onMouseDown: function (event, realCoords) {
                var canvas = event.target;
                var data = instance.surface.map[canvas.id];
                if (event.which === 1) {
                    var ray = data.camera.getRay(null, realCoords,
                        [canvas.width, canvas.height]);

                    var hitPoint = vec3.create();
                    var selection = this.selection;
                    instance.scene.getObjects().forEach(function (node) {
                        selection.clear();
                        var face = node.data.mesh.getFace(ray);
                        if (face) {
                            selection.face(face);
                            node.data.mesh.bounds.updateDimensions();
                        }
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
