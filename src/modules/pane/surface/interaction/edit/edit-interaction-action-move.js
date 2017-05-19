((function () {
    'use strict';

    var infoText = '[L-Click] Save position; [R-Click] Reset position; [X or Y or Z] Lock to axis;';

    Modules.prototype.add('edit-interaction-action-move', function (instance) {
        var initialCoords = vec2.create();
        var selectionNormal = null;
        var axisOrigin = null;
        var isY = false;

        instance.surface.interactions.edit.actions.move = {
            axis: null,
            init: function (context, event) {
                instance.footer.add(infoText);
                vec2.copy(initialCoords, context.lastCoords);
                selectionNormal = context.selection.getNormal();
                for (var name in context.selection.objects) {
                    var selectedObj = context.selection.objects[name];
                    for (var i = 0; i < selectedObj.vertices.length; i++) {
                        var vertex = selectedObj.vertices[i];
                        vertex.originalPosition = vertex.slice();
                    }
                }
            },
            onMouseMove: function (context, event) {
                if (!context.selection.isEmpty()) {
                    var canvas = event.target;
                    var data = instance.surface.map[canvas.id];

                    var currentRay = data.camera.getRay(null, context.lastCoords,
                        [canvas.width, canvas.height]);
                    var initialRay = data.camera.getRay(null, initialCoords,
                        [canvas.width, canvas.height]);
                    var cameraDirection = data.camera.getDirection();

                    var hitPointInitial = [0, 0, 0], hitPointCurrent = [0, 0, 0];

                    var selectionCenter = context.selection.getCenter();
                    Math.geo.rayPlaneCollision(initialRay.start, initialRay.direction,
                        selectionCenter, cameraDirection, hitPointInitial);

                    var delta = vec3.create();

                    if (this.axis) {
                        var currentRayEnd = vec3.scaleAndAdd(vec3.create(), currentRay.start, currentRay.direction, 100);
                        var axisStart = vec3.scale(vec3.create(), this.axis, -50);
                        var axisEnd = vec3.scale(vec3.create(), this.axis, 50);
                        Math.geo.closestPointsBetweenSegments(axisStart, axisEnd, currentRay.start, currentRayEnd, hitPointCurrent);

                        if (!axisOrigin) {
                            axisOrigin = vec3.copy(vec3.create(), hitPointCurrent);
                        } else vec3.sub(delta, hitPointCurrent, axisOrigin);
                    } else {
                        Math.geo.rayPlaneCollision(currentRay.start, currentRay.direction,
                            selectionCenter, cameraDirection, hitPointCurrent);
                        vec3.sub(delta, hitPointCurrent, hitPointInitial);
                    }

                    if (context.isControlDown)
                        for (var j = 0; j < 3; j++)
                            delta[j] = Math.round(delta[j]);

                    for (var name in context.selection.objects) {
                        var hitPoint = [0, 0, 0];
                        var selectedObj = context.selection.objects[name];
                        var sceneObj = instance.scene.getObjectByName(name);

                        for (var i = 0; i < selectedObj.vertices.length; i++) {
                            var vertex = selectedObj.vertices[i];
                            if (vertex.originalPosition)
                                vec3.add(vertex, vertex.originalPosition, delta);
                        }
                        sceneObj.mesh.onVerticesChange(selectedObj.vertices);
                    }
                }
            },
            onMouseDown: function (context, event) {
                if (event.which === 1 || event.which === 3) {
                    var restore = event.which === 3;
                    for (var name in context.selection.objects) {
                        var selectedObj = context.selection.objects[name];
                        var sceneObj = instance.scene.getObjectByName(name);
                        for (var i = 0; i < selectedObj.vertices.length; i++) {
                            var vertex = selectedObj.vertices[i];
                            if (vertex.originalPosition) {
                                if (restore)
                                    vec3.copy(vertex, vertex.originalPosition);
                                delete vertex.originalPosition;
                            }
                        }
                        sceneObj.mesh.bounds.updateDimensions();
                        sceneObj.mesh.onVerticesChange(sceneObj.mesh.vertices);
                    }
                }
                isY = false;
                this.axis = null;
                context.action = null;
                instance.footer.reset();
            },
            onKeyDown: function (context, event) {
                if (event.key === 'x') this.axis = vec3.set(vec3.create(), 1, 0, 0);
                else if (event.key === 'y') {
                    if (isY) {
                        this.axis = selectionNormal;
                        isY = false;
                    } else {
                        this.axis = vec3.set(vec3.create(), 0, 1, 0);
                        isY = true;
                    }
                } else if (event.key === 'z') this.axis = vec3.set(vec3.create(), 0, 0, 1);
                axisOrigin = null;
            }
        };
    }, ['edit-interaction']);
})());
