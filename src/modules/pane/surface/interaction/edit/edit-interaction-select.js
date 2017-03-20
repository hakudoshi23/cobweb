((function () {
    'use strict';

    Modules.prototype.add('edit-interaction-selection', function (instance) {
        instance.surface.interactions.edit.selection = {
            objects: {},
            addAll: function (object) {
                var result = [];
                var selection = this;
                object.mesh.vertices.forEach(function (vertex) {
                    toggleVertex(selection, object, vertex);
                    result.push(vertex);
                });
                return result;
            },
            add: function (ray, object, camera) {
                var position = camera.getPosition();
                var selection = this;

                var result = {
                    vertex: null,
                    face: null
                };

                var vertexSelectionMargin = camera.distance / 200;
                var vertices = object.mesh.bounds.getCollidingItems(ray);
                var rayVertices = vertices.filter(function (vertex) {
                    return Math.geo.rayPointDistance(ray.start, ray.direction, vertex) <= vertexSelectionMargin;
                });
                var vertex = Math.geo.findClosestPoint(position, rayVertices);
                if (vertex) result.vertex = vertex;

                var uniqueFaces = getFacesFromVertices(vertices);
                uniqueFaces = uniqueFaces.filter(function (face) {
                    return Math.geo.rayFaceCollision(ray.start, ray.direction,
                        face.getVertices());
                });
                var closestFace = Math.geo.findClosestFace(position, uniqueFaces);
                if (closestFace) result.face = closestFace;

                var vertexDistance = result.vertex ? Math.geo.pointPointDistance(position, result.vertex) : Number.MAX_VALUE;
                var faceDistance = result.face ? Math.geo.pointPointDistance(position, result.face.computeCenter()) : Number.MAX_VALUE;

                if (faceDistance > vertexDistance) {
                    result.face = null;
                    toggleVertex(selection, object, result.vertex);
                } else {
                    result.vertex = null;
                    toggleFace(selection, object, result.face);
                }

                return result;
            },
            getCenter: function () {
                var name = Object.keys(this.objects)[0];
                return Math.geo.computePointsCenter(this.objects[name].vertices);
            },
            clear: function () {
                for (var name in this.objects) {
                    var selectedObj = this.objects[name];
                    var sceneObj = instance.scene.getObjectByName(name);
                    for (var i = 0; i < selectedObj.vertices.length; i++) {
                        var vertex = selectedObj.vertices[i];
                        if (vertex._selected)
                            delete vertex._selected;
                    }
                    sceneObj.mesh.onVerticesChange(selectedObj.vertices);
                }
                this.objects = {};
            },
            isEmpty: function () {
                return !Object.keys(this.objects).length;
            }
        };

    }, ['edit-interaction']);

    function toggleVertex (selection, object, vertex) {
        if (vertex) {
            if (toggle(selection, object, vertex, 'vertices')) {
                vertex._selected = true;
                vertex._halfEdge.getFaces().forEach(function (face) {
                    var selectedVertices = selection.objects[object.name].vertices;
                    var faceVertices = face.getVertices();
                    var allSelected = true;
                    faceVertices.forEach(function (vertex) {
                        allSelected &= selectedVertices.includes(vertex);
                    });
                    if (allSelected && !face._selected)
                        toggleFace(selection, object, face);
                });
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
                face.getVertices().forEach(function (vertex) {
                    if (!vertex._selected)
                        toggleVertex(selection, object, vertex);
                });
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
})());
