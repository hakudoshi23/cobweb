((function () {
    'use strict';

    Modules.prototype.add('edit-interaction-action-face', function (instance) {
        instance.surface.interactions.edit.actions.face = {
            init: function (context, event) {
                if (!context.selection.isEmpty()) {
                    var center = context.selection.getCenter();
                    var normal = context.selection.getNormal();
                    console.debug('sorting...', center, normal);
                    var vertexCounterClockwise = function (a, b) {
                        var ac = vec3.sub(vec3.create(), a, center);
                        var bc = vec3.sub(vec3.create(), b, center);
                        return -vec3.dot(normal, vec3.cross(vec3.create(), ac, bc));
                    };

                    for (var objKey in context.selection.objects) {
                        var obj = context.selection.objects[objKey];
                        var mesh = instance.scene.getObjects()[0].data.mesh;

                        if (obj.vertices && obj.vertices.length > 0) {
                            var sortedVertices = obj.vertices.sort(vertexCounterClockwise);
                            mesh.addFace(sortedVertices);
                        }

                        context.selection.clear();
                        mesh.invalidateCache();
                    }
                } else console.warn('Cannot create a face with an empty selection!');
                context.action = null;
            }
        };
    }, ['edit-interaction']);
})());
