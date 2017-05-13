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
                    if (!e || e.rebuild) {
                        e = builder.onCreate(heMesh);
                        heMesh.rebuild = false;
                        this.meshes[key] = e;
                    }
                    if (builder.onClean) builder.onClean(e);
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

        var _addVertices = Math.HalfEdgeMesh.prototype.addVertices;
        Math.HalfEdgeMesh.prototype.addVertices = function (vertices) {
            _addVertices.call(this, vertices);
            this.invalidateCache();
        };

        var _addFace = Math.HalfEdgeMesh.prototype.addFace;
        Math.HalfEdgeMesh.prototype.addFace = function (vertices) {
            var newFace = _addFace.call(this, vertices);
            this.invalidateCache();
            return newFace;
        };

        Math.HalfEdgeMesh.prototype.invalidateCache = function () {
        for (var key in this.cache.meshes) {
            this.cache.meshes[key].rebuild = true;
        }
        };

        Math.HalfEdgeMesh.prototype.builders = {};
        Math.HalfEdgeMesh.prototype.addBuilder = function (key, builder) {
            this.builders[key] = builder;
        };

    }, ['halfedge']);
})());
