((function () {
    'use strict';

    Modules.prototype.add('edit-interaction-action-rotate', function (instance) {
        var selectionCenter2d = vec2.create();
        var selectionCenter = vec3.create();
        var initialVector = vec2.create();

        var aux = vec2.create();

        instance.surface.interactions.edit.actions.rotate = {
            axis: vec3.create(),
            init: function (context, event) {
                if (context.selection.isEmpty()) {
                    context.action = null;
                    return;
                }
                var canvas = event.target;
                var data = instance.surface.map[canvas.id];

                var center = context.selection.getCenter();
                vec3.copy(selectionCenter, center);
                vec3.transformMat4(center, center, data.camera.getViewMatrix());
                vec3.transformMat4(center, center, data.camera.projection);
                center[0] = ((center[0] + 1) / 2) * canvas.width;
                center[1] = ((center[1] + 1) / 2) * canvas.height;
                vec2.copy(selectionCenter2d, center);

                data.camera.getDirection(this.axis);

                vec2.sub(initialVector, selectionCenter2d, context.lastCoords);
                vec2.normalize(initialVector, initialVector);
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
                    var fromSelectionToCursor = vec2.sub(vec2.create(), selectionCenter2d, context.lastCoords);
                    vec2.normalize(fromSelectionToCursor, fromSelectionToCursor);
                    var determinant = fromSelectionToCursor[0] * initialVector[1] -
                        initialVector[0] * fromSelectionToCursor[1];
                    var delta = Math.atan2(determinant, vec2.dot(fromSelectionToCursor, initialVector));
                    var negatedCenter = vec3.negate(vec3.create(), selectionCenter);

                    var tranform = mat4.create();
                    mat4.translate(tranform, tranform, selectionCenter);
                    mat4.rotate(tranform, tranform, delta, this.axis);
                    mat4.translate(tranform, tranform, negatedCenter);

                    for (var name in context.selection.objects) {
                        var selectedObj = context.selection.objects[name];
                        var sceneObj = instance.scene.getObjectByName(name);
                        for (var i = 0; i < selectedObj.vertices.length; i++) {
                            var vertex = selectedObj.vertices[i];
                            vec3.transformMat4(vertex, vertex.originalPosition, tranform);
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
                context.action = null;
            },
            onKeyDown: function (context, event) {
                if (event.key === 'x') this.axis = vec3.set(vec3.create(), 1, 0, 0);
                else if (event.key === 'y') this.axis = vec3.set(vec3.create(), 0, 1, 0);
                else if (event.key === 'z') this.axis = vec3.set(vec3.create(), 0, 0, 1);
            }
        };
    }, ['edit-interaction']);
})());
