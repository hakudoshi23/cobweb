((function () {
    'use strict';

    Modules.prototype.add('edit-interaction-action-subdivide', function (instance) {
        instance.surface.interactions.edit.actions.subdivide = {
            init: function (context, event) {
                if (!context.selection.isEmpty()) {
                    for (var objKey in context.selection.objects) {
                        var obj = context.selection.objects[objKey];
                        var mesh = instance.scene.getObjects()[0].data.mesh;

                        if (obj.faces && obj.faces.length > 0) {
                            for (var i = 0; i < obj.faces.length; i++) {
                                var vs = subdivideFace(obj.faces[i], mesh);
                                if (vs !== null) {
                                    removeFace(mesh, obj.faces[i]);
                                    if (vs.length === 6) {
                                        mesh.addFace([vs[0], vs[1], vs[5]]);
                                        mesh.addFace([vs[1], vs[2], vs[3]]);
                                        mesh.addFace([vs[5], vs[3], vs[4]]);
                                        mesh.addFace([vs[5], vs[1], vs[3]]);
                                    } else if (vs.length === 9) {
                                        mesh.addFace([vs[0], vs[1], vs[8], vs[7]]);
                                        mesh.addFace([vs[1], vs[2], vs[3], vs[8]]);
                                        mesh.addFace([vs[8], vs[3], vs[4], vs[5]]);
                                        mesh.addFace([vs[7], vs[8], vs[5], vs[6]]);
                                    }
                                }
                            }
                        }

                        context.selection.clear();
                        mesh.invalidateCache();
                    }
                } else console.warn('Cannot subdivide an empty selection!');
                context.action = null;
            }
        };

        function subdivideFace (face, mesh) {
            var faceEdges = face.getEdges();
            var faceVertices = face.getVertices();
            var i, loopIndex = 0, medianPoint = [0, 0, 0];
            var next, edgeIndex, oVert, currentVertIndex;
            if (faceVertices.length === 3) {
                for (i = 0; i < faceVertices.length; i++) {
                    next = i + 1;
                    next = next === faceVertices.length ? 0 : next;

                    medianPoint = [0, 0, 0];
                    vec3.add(medianPoint, faceVertices[i], faceVertices[next]);
                    vec3.scale(medianPoint, medianPoint, 0.5);
                    mesh.addVertices([medianPoint]);

                    edgeIndex = loopIndex + 1;
                    edgeIndex = edgeIndex === faceEdges.length ? 0 : edgeIndex;
                    if (faceEdges[edgeIndex].opposite) {
                        oVert = faceEdges[edgeIndex].opposite.face.getVertices();
                        currentVertIndex = oVert.indexOf(faceVertices[i]);
                        oVert.splice(currentVertIndex, 0, medianPoint);
                        removeFace(mesh, faceEdges[edgeIndex].opposite.face);
                        mesh.addFace(oVert);
                    }

                    faceVertices.splice(i + 1, 0, medianPoint);
                    loopIndex += 1;
                    i += 1;
                }
                return faceVertices;
            } else if (faceVertices.length === 4) {
                for (i = 0; i < faceVertices.length; i++) {
                    next = i + 1;
                    next = next === faceVertices.length ? 0 : next;

                    medianPoint = [0, 0, 0];
                    vec3.add(medianPoint, faceVertices[i], faceVertices[next]);
                    vec3.scale(medianPoint, medianPoint, 0.5);
                    mesh.addVertices([medianPoint]);

                    edgeIndex = loopIndex + 1;
                    edgeIndex = edgeIndex === faceEdges.length ? 0 : edgeIndex;
                    if (faceEdges[edgeIndex].opposite) {
                        oVert = faceEdges[edgeIndex].opposite.face.getVertices();
                        currentVertIndex = oVert.indexOf(faceVertices[i]);
                        oVert.splice(currentVertIndex, 0, medianPoint);
                        removeFace(mesh, faceEdges[edgeIndex].opposite.face);
                        mesh.addFace(oVert);
                    }

                    faceVertices.splice(i + 1, 0, medianPoint);
                    loopIndex += 1;
                    i += 1;
                }
                medianPoint = [0, 0, 0];
                vec3.add(medianPoint, medianPoint, faceVertices[0]);
                vec3.add(medianPoint, medianPoint, faceVertices[2]);
                vec3.add(medianPoint, medianPoint, faceVertices[4]);
                vec3.add(medianPoint, medianPoint, faceVertices[6]);
                vec3.scale(medianPoint, medianPoint, 0.25);
                mesh.addVertices([medianPoint]);
                faceVertices.push(medianPoint);
                return faceVertices;
            } else console.debug('Can only subdivide 3 or 4 sides polygons!');
            return null;
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
            }
        }
    }, ['edit-interaction']);
})());
