((function () {
    'use strict';

    var meshKey = 'edit-interaction-render';

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
                        var mesh = obj.mesh.cache.get(meshKey, wireframeBuilder);
                        shader.draw(mesh, instance.graphics.gl.LINES);
                    }
                }
            });
        };
    }, ['edit-interaction', 'shader']);

    var wireframeBuilder = {
        onCreate: function (halfEdgeMesh) {
            var buffers = {
                vertices: new Float32Array(halfEdgeMesh.vertices.length * 3),
                colors: new Float32Array(halfEdgeMesh.vertices.length * 4)
            };

            var indices = [];
            halfEdgeMesh.faces.forEach(function (face) {
                face.getVertices().forEach(function (vertex, i, array) {
                    var index = i >= array.length - 1 ? 0 : i + 1;
                    indices.push(vertex._halfEdge.ownIndex);
                    indices.push(array[index]._halfEdge.ownIndex);
                });
            });
            buffers.lines = new Uint16Array(indices);
            var mesh = GL.Mesh.load(buffers);
            for (var i = 0; i < halfEdgeMesh.vertices.length; i++)
                this.onVertexChange(halfEdgeMesh.vertices[i], mesh);

            return mesh;
        },
        onVertexChange: function (vertex, mesh) {
            var buffer = mesh.vertexBuffers;
            var index = vertex._halfEdge.ownIndex;
            for (var j = 0; j < 3; j++)
                buffer.vertices.data[index * 3 + j] = vertex[j];
            buffer.vertices.dirty = true;
            var color = vertex._selected ? [1, 0.4, 0.1, 1] : [0, 0, 0, 1];
            for (j = 0; j < 4; j++)
                buffer.colors.data[index * 4 + j] = color[j];
            buffer.colors.dirty = true;
        },
        onClean: function (mesh) {
            if (mesh.vertexBuffers.vertices.dirty) {
                mesh.vertexBuffers.vertices.upload();
                delete mesh.vertexBuffers.vertices.dirty;
            }
            if (mesh.vertexBuffers.colors.dirty) {
                mesh.vertexBuffers.colors.upload();
                delete mesh.vertexBuffers.colors.dirty;
            }
        }
    };
})());
