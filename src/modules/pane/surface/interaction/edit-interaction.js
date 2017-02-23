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

                    var hitPoint = vec3.create();
                    instance.scene.getObjects().forEach(function (node) {
                        var face = node.data.mesh.getFace(ray);
                        if (face) {
                            var normal = face.computeNormal();
                            face.getVertices().forEach(function (vertex) {
                                vec3.add(vertex, vertex, normal);
                            });
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
