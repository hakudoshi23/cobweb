((function () {
    'use strict';

    Modules.prototype.add('edit-interaction-selection', function (instance) {
        instance.surface.interactions.edit.selection = {
            objects: {},
            add: function (ray, object, position) {
                position = position || [0, 0, 0];
                var selection = this;

                var vertices = object.mesh.bounds.getCollidingItems(ray);
                vertices.forEach(function (vertex) {
                    if (Math.geo.rayPointDistance(ray.start, ray.direction, vertex) <= 0.2) {
                        toggleVertex(selection, object, vertex);
                    }
                });

                var uniqueEdges = getEdgesFromVertices(vertices);
                uniqueEdges.forEach(function (edge) {
                    //TODO: check edge distance to ray -> if close -> add
                });

                var uniqueFaces = getFacesFromVertices(vertices);
                uniqueFaces = uniqueFaces.filter(function (face) {
                    return Math.geo.rayFaceCollision(ray.start, ray.direction,
                        face.getVertices());
                });
                toggleFace(selection, object, Math.geo.findClosestFace(position, uniqueFaces));
            },
            clear: function () {
                this.objects = {};
            },
            isEmpty: function () {
                return true;
            }
        };

    }, ['edit-interaction']);

    function toggleVertex (selection, object, vertex) {
        if (vertex) {
            if (toggle(selection, object, vertex, 'vertices')) {
                vertex._selected = true;
            } else delete vertex._selected;
        }
    }

    function toggleEdge (selection, object, edge) {
        if (edge) {
            if (toggle(selection, object, edge, 'edges')) {
                edge._selected = true;
            } else delete edge._selected;
        }
    }

    function toggleFace (selection, object, face) {
        if (face) {
            if (toggle(selection, object, face, 'faces')) {
                face._selected = true;
            } else delete face._selected;
        }
    }

    function toggle (selection, object, item, arrayName) {
        initObjectIfNeeded(selection, object);
        var array = selection.objects[object.name][arrayName];
        var index = array.indexOf(item);
        if (index >= 0) {
            array.splice(index, 1);
            delObjectIfNeeded(selection, object);
            return false;
        } else {
            array.push(item);
            return true;
        }
    }

    function initObjectIfNeeded (selection, object) {
        var name = object.name;
        if (!selection.objects[name]) {
            selection.objects[name] = {
                faces: [],
                edges: [],
                vertices: []
            };
        }
    }

    function delObjectIfNeeded (selection, object) {
        var name = object.name;
        if (selection.objects[name]) {
            var objSelection = selection.objects[name];
            if (!objSelection.vertices.length &&
                !objSelection.vertices.length &&
                !objSelection.vertices.length)
                delete selection.objects[name];
        }
    }

    function getEdgesFromVertices (vertices) {
        var edges = [];
        vertices.forEach(function (vertex) {
            vertex._halfEdge.outEdges.forEach(function (edge) {
                if (edges.indexOf(edge) === -1)
                    edges.push(edge);
            });
        });
        return edges;
    }

    function getFacesFromVertices (vertices) {
        var faces = [];
        vertices.forEach(function (vertex) {
            vertex._halfEdge.getFaces().forEach(function (face) {
                if (faces.indexOf(face) === -1)
                    faces.push(face);
            });
        });
        return faces;
    }

    function saveOriginalVertexPosition (vertices) {
        vertices.forEach(function (vertex) {
            vertex.originalPosition = vertex.slice();
        });
    }
})());
