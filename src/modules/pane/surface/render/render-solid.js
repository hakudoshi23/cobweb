((function () {
    'use strict';

    var meshKey = 'render-solid';

    Modules.prototype.add('render-solid', function (instance) {
        var shader = null;
        instance.asset.shader.get('solid', function (s) {
            shader = s;
        });

        var grid = {
            type: 'object',
            primitive: instance.graphics.gl.LINES,
            mesh: GL.Mesh.grid({
                lines: 11,
                size: 10
            }),
            model: mat4.create(),
        };

        instance.surface.renders.solid = function (surface) {
            var lightDirection = vec3.create();
            surface.camera.getPosition(lightDirection);
            vec3.add(lightDirection, lightDirection, [1, 2, 0]);
            vec3.normalize(lightDirection, lightDirection);
            uniforms.u_lightvector = lightDirection;

            renderObject(surface, grid, shader);
            instance.scene.getObjects().forEach(function (node) {
                renderObject(surface, node.data, shader);
            });
        };

        instance.events.on('surface.create', function (surface) {
            instance.surface.setRender(surface, 'solid');
        });
    }, ['surface-render', 'shader']);

    var uniforms = {
        u_color: [0.5, 0.5, 0.5, 1],
        u_lightvector: null,
        u_model: null,
        u_mvp: mat4.create()
    };

    var temp = mat4.create();
    function renderObject (surface, obj, shader) {
        surface.camera.getViewMatrix(temp);
        mat4.multiply(temp, surface.camera.projection, temp);
        mat4.multiply(uniforms.u_mvp, temp, obj.model);

        uniforms.u_model = obj.model;

        if (shader) {
            shader.uniforms(uniforms);
            if (obj.mesh instanceof Math.HalfEdgeMesh) {
                var mesh = obj.mesh.cache.get(meshKey, meshBuilder);
                if (mesh) shader.draw(mesh, obj.primitive);
            } else {
                shader.draw(obj.mesh, obj.primitive);
            }
        }
    }

    var meshBuilder = {
        onCreate: function (halfEdgeMesh) {
            var buffers = {
                vertices: new Float32Array(halfEdgeMesh.vertices.length * 3),
                normals: new Float32Array(halfEdgeMesh.vertices.length * 3)
            };

            var indices = [];
            halfEdgeMesh.faces.forEach(function (face) {
                var faceNormal = face.computeNormal();
                face.getVerticesTriangulated().forEach(function (t) {
                    indices.push(t[0]._halfEdge.ownIndex,
                        t[1]._halfEdge.ownIndex, t[2]._halfEdge.ownIndex);
                });
            });
            buffers.triangles = new Uint16Array(indices);
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
            var normal = vertex._halfEdge.computeNormal();
            for (j = 0; j < 3; j++)
                buffer.normals.data[index * 3 + j] = normal[j];
            buffer.normals.dirty = true;
        },
        onClean: function (mesh) {
            if (mesh.vertexBuffers.vertices.dirty) {
                mesh.vertexBuffers.vertices.upload();
                delete mesh.vertexBuffers.vertices.dirty;
            }
            if (mesh.vertexBuffers.normals.dirty) {
                mesh.vertexBuffers.normals.upload();
                delete mesh.vertexBuffers.normals.dirty;
            }
        }
    };
})());
