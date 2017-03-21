((function () {
    'use strict';

    var bytesPerFloat32Element = Float32Array.BYTES_PER_ELEMENT;

    Modules.prototype.add('render-solid-cache', function (instance) {
        Math.HalfEdgeMesh.prototype.addBuilder('render-solid', solidBuilder);
    }, ['halfedge-cache']);

    var solidBuilder = {
        onCreate: function (halfEdgeMesh) {
            var indices = [];
            halfEdgeMesh.faces.forEach(function (face) {
                var faceNormal = face.computeNormal();
                face.getVerticesTriangulated().forEach(function (t) {
                    indices.push(t[0]._halfEdge.ownIndex,
                        t[1]._halfEdge.ownIndex, t[2]._halfEdge.ownIndex);
                });
            });

            var mesh = GL.Mesh.load({
                vertices: new Float32Array(halfEdgeMesh.vertices.length * 3),
                normals: new Float32Array(halfEdgeMesh.vertices.length * 3),
                triangles: new Uint16Array(indices)
            });
            this.onVerticesChange(halfEdgeMesh.vertices, mesh);
            return mesh;
        },
        onVerticesChange: function (vertices, mesh) {
            var buffer = mesh.vertexBuffers;
            var vRange = [Number.MAX_VALUE, 0];
            var nRange = [Number.MAX_VALUE, 0];

            for (var i = 0; i < vertices.length; i++) {
                var vertex = vertices[i];
                var index = vertex._halfEdge.ownIndex;

                buffer.vertices.data.set(vertex, index * 3);
                vRange[0] = Math.min(vRange[0], index * 3);
                vRange[1] = Math.max(vRange[1], index * 3 + 3);

                var normal = vertex._halfEdge.computeNormal();
                buffer.normals.data.set(normal, index * 3);
                nRange[0] = Math.min(nRange[0], index * 3);
                nRange[1] = Math.max(nRange[1], index * 3 + 3);
            }
            uploadRange(buffer.vertices, vRange);
            uploadRange(buffer.normals, nRange);
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

    function uploadRange (buffer, range) {
        buffer.uploadRange(range[0] * bytesPerFloat32Element,
            (range[1] - range[0]) * bytesPerFloat32Element);
    }
})());
