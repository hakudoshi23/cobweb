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
                        shader.draw(mesh, GL.LINES);
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

        var vertices = [], colors = [];
        halfEdgeMesh.faces.forEach(function (face) {
            var faceNormal = face.computeNormal();
            face.getVerticesTriangulated().forEach(function (triangles) {
                triangles.forEach(function (triangle) {
                    vertices.push(triangle[0], triangle[1], triangle[2]);
                    colors.push(faceNormal[0], faceNormal[1], faceNormal[2]);
                });
            });
        });

        buffers.vertices = new Float32Array(vertices);
        buffers.colors = new Float32Array(colors);
        return GL.Mesh.load(buffers);
    }
})());
