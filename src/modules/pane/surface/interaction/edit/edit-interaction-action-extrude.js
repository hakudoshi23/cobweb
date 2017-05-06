((function () {
    'use strict';

    Modules.prototype.add('edit-interaction-action-extrude', function (instance) {
        instance.surface.interactions.edit.actions.extrude = {
            init: function (context, event) {
                if (!context.selection.isEmpty()) {
                    for (var objKey in context.selection.objects) {
                        var obj = context.selection.objects[objKey];
                        var selectedFaces = obj.faces;

                        var mesh = instance.scene.getObjects()[0].data.mesh;

                        var outerEdges = getOuterEdgeLoop(selectedFaces);
                        var newOuterEdges = duplicateOuterRing(outerEdges,
                                selectedFaces, mesh);

                        context.selection.clear();
                        for (var i = 0; i < selectedFaces.length; i++) {
                            context.selection.addFace(instance.scene.getObjects()[0].data,
                                selectedFaces[i]);
                        }
                        mesh.invalidateCache();
                    }
                } else console.warn('Cannot extrude an empty selection!');
                context.action = null;
            }
        };

        function getOuterEdgeLoop (faces) {
            var outerEdges = [], startEdge = null;
            for (var i = 0; i < faces.length; i++) {
                var faceEdges = faces[i].getEdges();
                for (var j = 0; j < faceEdges.length; j++) {
                    var he = faceEdges[j];
                    var oppositeFace = he.opposite.face;
                    if (!oppositeFace._selected) {
                        startEdge = he;
                    }
                }
            }

            function filterNextOutEdge (he) {
                if (!he.opposite) return null;
                return he.face._selected && !he.opposite.face._selected;
            }
            outerEdges.push(startEdge);
            var nextEdge = startEdge.vertex
                ._halfEdge.outEdges.find(filterNextOutEdge);
            while (nextEdge && nextEdge != startEdge) {
                outerEdges.push(nextEdge);
                nextEdge = nextEdge.vertex._halfEdge
                    .outEdges.find(filterNextOutEdge);
            }

            return outerEdges;
        }

        function duplicateOuterRing (outerEdges, faces, mesh) {
            var newVertices = [], oldVertices = [];
            for (var i = 0; i < outerEdges.length; i++) {
                var newVertex = Object.assign([], outerEdges[i].vertex);
                newVertex._halfEdge = Object.assign({}, outerEdges[i].vertex._halfEdge);
                delete newVertex._selected;

                var newOutEdges = [];
                var oldOutEdges = outerEdges[i].vertex._halfEdge.outEdges;
                for (var j = 0; j < oldOutEdges.length; j++) {
                    var outEdge = oldOutEdges[j];
                    if (outEdge.face._selected) {
                        oldOutEdges.splice(j, 1);
                        newOutEdges.push(outEdge);
                        j -= 1;
                    }
                }
                newVertex._halfEdge.outEdges = newOutEdges;
                oldVertices.push(outerEdges[i].vertex);
                newVertices.push(newVertex);
            }
            mesh.addVertices(newVertices);
            for (i = 0; i < faces.length; i++) {
                var faceEdges = faces[i].getEdges();
                for (var w = 0; w < faceEdges.length; w++) {
                    var he = faceEdges[w];
                    if (!he.opposite) console.debug(he);
                    else {
                        var vertexIndex = oldVertices.indexOf(he.vertex);
                        if (vertexIndex >= 0)
                            he.vertex = newVertices[vertexIndex];
                    }
                }
            }
            for (i = 0; i < newVertices.length; i++) {
                var nextIndex = i + 1 >= newVertices.length ? 0 : i + 1;
                mesh.addFace([oldVertices[i], oldVertices[nextIndex],
                        newVertices[nextIndex], newVertices[i]]);
            }
        }
    }, ['edit-interaction']);
})());
