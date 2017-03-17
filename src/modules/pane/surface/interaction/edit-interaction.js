((function () {
    'use strict';

    var isMouseDown = false;
    var initialCoords = [0, 0];

    Modules.prototype.add('edit-interaction', function (instance) {
        instance.surface.interactions.edit = {
            onMouseMove: function (event, realCoords) {
                if (isMouseDown && !this.selection.isEmpty()) {
                    var canvas = event.target;
                    var data = instance.surface.map[canvas.id];

                    var currentRay = data.camera.getRay(null, realCoords,
                        [canvas.width, canvas.height]);
                    var initialRay = data.camera.getRay(null, initialCoords,
                        [canvas.width, canvas.height]);
                    var cameraDirection = data.camera.getDirection();

                    var hitPointInitial = [0, 0, 0];
                    var hitPointCurrent = [0, 0, 0];

                    var diff = [0, 0], delta = [0, 0, 0], aux = [0, 0, 0];
                    var selectionCenter = this.selection.getCenter();
                    Math.geo.rayPlaneCollision(currentRay.start, currentRay.direction,
                        selectionCenter, cameraDirection, hitPointCurrent);
                    Math.geo.rayPlaneCollision(initialRay.start, initialRay.direction,
                        selectionCenter, cameraDirection, hitPointInitial);
                    vec3.sub(delta, hitPointCurrent, hitPointInitial);

                    for (var name in this.selection.objects) {
                        var hitPoint = [0, 0, 0];
                        var selectedObj = this.selection.objects[name];
                        var sceneObj = instance.scene.getObjectByName(name);

                        for (var i = 0; i < selectedObj.vertices.length; i++) {
                            var vertex = selectedObj.vertices[i];
                            vec3.add(vertex, vertex.originalPosition, delta);
                            sceneObj.mesh.bounds.updateDimensions();
                            sceneObj.mesh.onVertexChange(vertex);
                        }
                    }
                }
                return true;
            },
            onMouseUp: function (event, realCoords) {
                isMouseDown = false;
                for (var name in this.selection.objects) {
                    var selectedObj = this.selection.objects[name];
                    for (var i = 0; i < selectedObj.vertices.length; i++) {
                        var vertex = selectedObj.vertices[i];
                        if (vertex.originalPosition) {
                            delete vertex.originalPosition;
                        }
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
                        selection.clear();
                        var result = selection.add(ray, node.data, data.camera.getPosition());
                        result.vertices.forEach(function (vertex) {
                            node.data.mesh.cache.onVertexChange(vertex);
                            initialCoords = realCoords;
                        });
                        result.faces.forEach(function (face) {
                            face.getVertices().forEach(function (vertex) {
                                node.data.mesh.cache.onVertexChange(vertex);
                            });
                            initialCoords = realCoords;
                        });
                    });
                    return false;
                }
                return true;
            },
            onKeyDown: function (event, realCoords) {
                console.debug(event);
            },
            onKeyUp: function (event, realCoords) {
                console.debug(event);
            }
        };

        instance.events.on('surface.create', function (surface) {
            instance.surface.setInteraction(surface, 'edit');
        });

    }, ['surface-interaction']);
})());
