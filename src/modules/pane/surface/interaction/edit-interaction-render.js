((function () {
    'use strict';

    Modules.prototype.add('edit-interaction-render', function (instance) {
        var shader = null;
        instance.asset.shader.get('wireframe', function (s) {
            shader = s;
        });

        var uniforms = {
            u_mvp: mat4.create()
        };

        var temp = mat4.create();
        instance.surface.interactions.edit.onRender = function (surface) {
            instance.scene.getObjects().forEach(function (node) {
                var obj = node.data;

                surface.camera.getViewMatrix(temp);
                mat4.multiply(temp, surface.camera.projection, temp);
                mat4.multiply(uniforms.u_mvp, temp, obj.model);

                if (shader) {
                    shader.uniforms(uniforms);
                    if (obj.mesh instanceof Math.HalfEdgeMesh) {
                        instance.graphics.gl.lineWidth(5);
                        var mesh = getCachedVBOMesh(obj.mesh);
                        shader.draw(mesh, instance.graphics.gl.LINES);
                    }
                }
            });
        };
    }, ['edit-interaction', 'shader']);

    var cacheKey = 'edit-interaction-render';
    function getCachedVBOMesh (halfEdgeMesh) {
        halfEdgeMesh._cache = halfEdgeMesh._cache || {};
        if (halfEdgeMesh._cache[cacheKey]) {
            if (halfEdgeMesh._cache[cacheKey].time <= halfEdgeMesh.lastBump) {
                halfEdgeMesh._cache[cacheKey] = buildMeshFromHalfEdges(halfEdgeMesh);
                halfEdgeMesh._cache[cacheKey].time = Date.now();
            }
        } else {
            halfEdgeMesh._cache[cacheKey] = buildMeshFromHalfEdges(halfEdgeMesh);
            halfEdgeMesh._cache[cacheKey].time = Date.now();
        }
        return halfEdgeMesh._cache[cacheKey];
    }

    function buildMeshFromHalfEdges (halfEdgeMesh) {
        var buffers = {};

        buffers.vertices = new Float32Array(halfEdgeMesh.vertices.length * 3);
        halfEdgeMesh.vertices.forEach(function (vertex, i) {
            buffers.vertices[i * 3 + 0] = vertex[0];
            buffers.vertices[i * 3 + 1] = vertex[1];
            buffers.vertices[i * 3 + 2] = vertex[2];
        });
        buffers.colors = new Float32Array(halfEdgeMesh.vertices.length * 4);
        halfEdgeMesh.vertices.forEach(function (vertex, i) {
            var color = vertex._selected ? [1, 0.4, 0.1, 1] : [0, 0, 0, 1];
            for (var j = 0; j < 4; j++)
                buffers.colors[i * 4 + j] = color[j];
        });

        var indices = [];
        halfEdgeMesh.faces.forEach(function (face) {
            face.getVertices().forEach(function (vertex, i, array) {
                var index = i >= array.length - 1 ? 0 : i + 1;
                indices.push(vertex._halfEdge.ownIndex);
                indices.push(array[index]._halfEdge.ownIndex);
            });
        });
        buffers.lines = new Uint16Array(indices);

        return GL.Mesh.load(buffers);
    }
})());
