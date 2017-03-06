((function () {
    'use strict';

    Modules.prototype.add('edit-interaction-selection', function (instance) {
        instance.surface.interactions.edit.selection = {
            objects: {},
            add: function (ray, object) {
                var selection = this;
                var vertices = object.mesh.bounds.getCollidingItems(ray);
                vertices.forEach(function (vertex) {
                    if (Math.geo.rayPointDistance(ray, vertex) <= 0.2) {
                        addVertex(selection, object, vertex);
                    }
                });
                //TODO: check vertex distance to ray -> if close -> add
                //TODO: build edge list from vertex outEdges
                //TODO: check edge distance to ray -> if close -> add
                //TODO: build face list from vertex neightboor faces
                //TODO: check face collision to ray -> if collide -> add
            },
            clear: function () {
                this.objects = {};
            },
            isEmpty: function () {
                return true;
            }
        };

    }, ['edit-interaction']);

    function addVertex (selection, object, vertex) {
        add(selection, object, vertex, 'vertices');
    }

    function addEdge (selection, object, edge) {
        add(selection, object, edge, 'edges');
    }

    function addFace (selection, object, face) {
        add(selection, object, face, 'faces');
    }

    function add (selection, object, item, arrayName) {
        initObjectIfNeeded(selection, object);
        var array = selection.objects[object.name][arrayName];
        var index = array.indexOf(item);
        if (index >= 0) array.splice(index, 1);
        else array.push(item);
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

    function saveOriginalVertexPosition (vertices) {
        vertices.forEach(function (vertex) {
            vertex.originalPosition = vertex.slice();
        });
    }
})());
