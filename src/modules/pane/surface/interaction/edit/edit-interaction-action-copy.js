((function () {
    'use strict';

    Modules.prototype.add('edit-interaction-action-copy', function (instance) {
        instance.surface.interactions.edit.actions.copy = {
            init: function (context, event) {
                if (!context.selection.isEmpty()) {
                    for (var objKey in context.selection.objects) {
                        var obj = context.selection.objects[objKey];
                        var oldVertices = obj.vertices;
                        var oldFaces = obj.faces;

                        var data = instance.scene.getObjects()[0].data;
                        var mesh = data.mesh;

                        var newVertices = duplicateVertices(mesh, oldVertices);
                        var newFaces = duplicateFaces(mesh, oldVertices,
                                newVertices, oldFaces);

                        context.selection.clear();
                        for (var i = 0; i < newFaces.length; i++) {
                            context.selection.addFace(data, newFaces[i]);
                        }
                        mesh.invalidateCache();
                    }
                } else console.warn('Cannot copy an empty selection!');
                context.action = null;
            }
        };

        function duplicateVertices (mesh, vertices) {
            var newVertices = [];
            for (var i = 0; i < vertices.length; i++) {
                var newVertex = Object.assign([], vertices[i]);
                delete newVertex._halfEdge;
                delete newVertex._selected;
                mesh.addVertices([newVertex]);
                newVertices.push(newVertex);
            }
            return newVertices;
        }

        function duplicateFaces (mesh, oldVertices, newVertices, faces) {
            var newFaces = [];
            for (var i = 0; i < faces.length; i++) {
                var faceVertices = faces[i].getVertices();
                faceVertices = faceVertices.map(function (item) {
                    return newVertices[oldVertices.indexOf(item)];
                });
                var newFace = mesh.addFace(faceVertices);
                newFaces.push(newFace);
            }
            return newFaces;
        }
    }, ['edit-interaction']);
})());
