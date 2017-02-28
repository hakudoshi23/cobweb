((function () {
    'use strict';

    Modules.prototype.add('edit-interaction-selection', function (instance) {
        instance.surface.interactions.edit.selection = {
            objects: [],
            faces: [],
            edges: [],
            vertices: [],
            last: null,
            vertex: function (vertex) {
                vertex.originalPosition = vertex.slice();
                this.vertices.push(vertex);
                this.last = 'vertices';
            },
            edge: function (edge) {
                this.edges.push(edge);
                this.last = 'edges';
            },
            face: function (face) {
                this.faces.push(face);
                this.last = 'faces';
            },
            object: function (object) {
                this.objects.push(object);
                this.last = 'objects';
            },
            clear: function () {
                for (var i = 0; i < this.vertices.length; i++)
                    delete this.vertices[i].originalPosition;
                this.objects = [];
                this.vertices = [];
                this.edges = [];
                this.faces = [];
                this.last = null;
            },
            isEmpty: function () {
                return (this.vertices.length === 0) && (this.edges.length === 0) &&
                    (this.faces.length === 0) && (this.objects.length === 0);
            }
        };

    }, ['edit-interaction']);
})());
