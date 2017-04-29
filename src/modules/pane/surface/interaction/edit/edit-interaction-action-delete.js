((function () {
    'use strict';

    Modules.prototype.add('edit-interaction-action-delete', function (instance) {
        instance.surface.interactions.edit.actions.delete = {
            init: function (context, event) {
                if (!context.selection.isEmpty()) {
                    for (var objKey in context.selection.objects) {
                        var obj = context.selection.objects[objKey];
                        var mesh = instance.scene.getObjects()[0].data.mesh;

                        if (obj.faces && obj.faces.length > 0) {
                            for (var i = 0; i < obj.faces.length; i++)
                                removeFace(mesh, obj.faces[i]);
                        } else if (obj.vertices && obj.vertices.length > 0) {
                            for (var j = 0; j < obj.vertices.length; j++)
                                removeVertex(mesh, obj.vertices[j]);
                        }

                        context.selection.clear();
                        mesh.invalidateCache();
                    }
                } else console.warn('Cannot delete an empty selection!');
                context.action = null;
            }
        };

        function removeVertex (mesh, vertex) {
            vertex._halfEdge.getFaces().forEach(function (face) {
                removeFace(mesh, face);
            });
            var vIndex = vertex._halfEdge.ownIndex;
            mesh.vertices.splice(vIndex, 1);
            for (var i = vIndex; i < mesh.vertices.length; i++) {
                mesh.vertices[i]._halfEdge.ownIndex--;
            }
        }

        function removeFace (mesh, face) {
            var current = face.halfEdge;
            removeHalfEdge(mesh, current);
            while (current.next !== face.halfEdge) {
                current = current.next;
                removeHalfEdge(mesh, current);
            }
            var fIndex = mesh.faces.indexOf(face);
            mesh.faces.splice(fIndex, 1);
        }

        function removeHalfEdge (mesh, halfEdge) {
            var heIndex = mesh.halfEdges.indexOf(halfEdge);
            mesh.halfEdges.splice(heIndex, 1);
            if (halfEdge.opposite) {
                var oppositeVertex = halfEdge.opposite.vertex;
                var outEdges = oppositeVertex._halfEdge.outEdges;
                heIndex = outEdges.indexOf(halfEdge);
                outEdges.splice(heIndex, 1);
                if (outEdges.length === 0)
                    removeVertex(mesh, oppositeVertex);
            }
        }
    }, ['edit-interaction']);
})());
