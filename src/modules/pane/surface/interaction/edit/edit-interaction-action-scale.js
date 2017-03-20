((function () {
    'use strict';

    Modules.prototype.add('edit-interaction-action-scale', function (instance) {
        var selectionCenter2d = vec2.create();
        var selectionCenter = vec3.create();
        var initialDistance = 0;

        var aux = vec2.create();

        instance.surface.interactions.edit.actions.scale = {
            axis: null,
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

                vec2.sub(aux, context.lastCoords, selectionCenter2d);
                initialDistance = vec2.length(aux);
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

                    vec2.sub(aux, context.lastCoords, selectionCenter2d);
                    var delta = (vec2.length(aux) / initialDistance);

                    var scaleVector = vec3.create();
                    for (var name in context.selection.objects) {
                        var selectedObj = context.selection.objects[name];
                        var sceneObj = instance.scene.getObjectByName(name);

                        for (var i = 0; i < selectedObj.vertices.length; i++) {
                            var vertex = selectedObj.vertices[i];
                            vec3.sub(scaleVector, vertex, selectionCenter);
                            vec3.normalize(scaleVector, scaleVector);
                            vec3.scale(scaleVector, scaleVector, delta - 1);
                            if (this.axis)
                                vec3.mul(scaleVector, scaleVector, this.axis);
                            if (vertex.originalPosition)
                                vec3.add(vertex, vertex.originalPosition, scaleVector);
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
                this.axis = null;
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
