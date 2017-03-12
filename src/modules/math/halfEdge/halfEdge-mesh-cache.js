((function () {
    'use strict';

    Modules.prototype.add('math-halfEdge-cache', function (instance) {
        var superConstructor = Math.HalfEdgeMesh;
        var cachedHalfEdgeMesh = function () {
            superConstructor.call(this);
            var halfEdgeMesh = this;
            halfEdgeMesh.cache = {
                entry: {},
                get: function (key, builder) {
                    if (!this.entry[key]) {
                        this.entry[key] = {
                            mesh: builder.onCreate(halfEdgeMesh),
                            builder: builder
                        };
                    }
                    builder.onClean(this.entry[key].mesh);
                    return this.entry[key].mesh;
                },
                onVertexChange: function (vertex) {
                    for (var key in this.entry) {
                        var entry = this.entry[key];
                        if (entry.builder.onVertexChange)
                            entry.builder.onVertexChange(vertex, entry.mesh);
                    }
                }
            };
        };
        cachedHalfEdgeMesh.prototype = Object.create(Math.HalfEdgeMesh.prototype);
        cachedHalfEdgeMesh.prototype.constructor = cachedHalfEdgeMesh;

        Math.HalfEdgeMesh = cachedHalfEdgeMesh;
    }, ['math-halfEdge']);
})());
