((function () {
    'use strict';

    Modules.prototype.add('render-solid-cache', function (instance) {
        Math.HalfEdgeMesh.prototype.addBuilder('render-solid', solidBuilder);
    }, ['halfedge-cache']);

    var solidBuilder = {
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
