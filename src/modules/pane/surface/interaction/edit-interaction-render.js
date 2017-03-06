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
                        //instance.graphics.gl.lineWidth(5);
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

        var vertices = [], colors = [];
        halfEdgeMesh.faces.forEach(function (face) {
            var verts = face.getVertices();
            for (var i = 0; i < verts.length; i++) {
                var vTo = verts[ i + 1 >= verts.length ? 0 : i + 1];
                var vFrom = verts[i];
                vertices.push(vFrom[0], vFrom[1], vFrom[2]);
                colors.push(0, 0, 0, 1);
                vertices.push(vTo[0], vTo[1], vTo[2]);
                colors.push(0, 0, 0, 1);
            }
        });

        buffers.vertices = new Float32Array(vertices);
        buffers.colors = new Float32Array(colors);
        return GL.Mesh.load(buffers);
    }
})());
