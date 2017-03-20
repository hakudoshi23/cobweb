((function () {
    'use strict';

    Modules.prototype.add('halfedge-cache', function (instance) {
        var superConstructor = Math.HalfEdgeMesh;
        var cachedHalfEdgeMesh = function () {
            superConstructor.call(this);
            var heMesh = this;
            this.cache = {
                meshes: {},
                get: function (key) {
                    var e = this.meshes[key];
                    var builder = Math.HalfEdgeMesh.prototype.builders[key];
                    if (!e) {
                        e = builder.onCreate(heMesh);
                        this.meshes[key] = e;
                    }
                    builder.onClean(e);
                    return e;
                },
                onVerticesChange: function (vertices) {
                    for (var key in this.meshes) {
                        var e = this.meshes[key];
                        var builder = Math.HalfEdgeMesh.prototype.builders[key];
                        if (builder.onVerticesChange)
                            builder.onVerticesChange(vertices, e);
                    }
                }
            };
        };
        cachedHalfEdgeMesh.prototype = Object.create(Math.HalfEdgeMesh.prototype);
        cachedHalfEdgeMesh.prototype.constructor = cachedHalfEdgeMesh;

        Math.HalfEdgeMesh = cachedHalfEdgeMesh;

        Math.HalfEdgeMesh.prototype.builders = {};
        Math.HalfEdgeMesh.prototype.addBuilder = function (key, builder) {
            this.builders[key] = builder;
        };

    }, ['halfedge']);
})());
