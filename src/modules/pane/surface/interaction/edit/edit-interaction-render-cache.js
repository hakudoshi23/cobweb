((function () {
    'use strict';

    var bytesPerFloat32Element = Float32Array.BYTES_PER_ELEMENT;

    Modules.prototype.add('edit-interaction-render-cache', function (instance) {
        Math.HalfEdgeMesh.prototype.addBuilder('edit-interaction-render-wireframe', wireframeBuilder);
        Math.HalfEdgeMesh.prototype.addBuilder('edit-interaction-render-vertices', verticesBuilder);
    }, ['edit-interaction', 'shader']);

    var wireframeBuilder = {
        onCreate: function (halfEdgeMesh) {
            var indices = [];
            halfEdgeMesh.faces.forEach(function (face) {
                face.getVertices().forEach(function (vertex, i, array) {
                    var index = i >= array.length - 1 ? 0 : i + 1;
                    indices.push(vertex._halfEdge.ownIndex);
                    indices.push(array[index]._halfEdge.ownIndex);
                });
            });

            var mesh = GL.Mesh.load({
                vertices: new Float32Array(halfEdgeMesh.vertices.length * 3),
                colors: new Float32Array(halfEdgeMesh.vertices.length * 4),
                lines: new Uint16Array(indices)
            });
            this.onVerticesChange(halfEdgeMesh.vertices, mesh);
            return mesh;
        },
        onVerticesChange: function (vertices, mesh) {
            var buffer = mesh.vertexBuffers;
            var vRange = [Number.MAX_VALUE, 0];
            var cRange = [Number.MAX_VALUE, 0];
            for (var i = 0; i < vertices.length; i++) {
                var vertex = vertices[i];
                var index = vertex._halfEdge.ownIndex;
                buffer.vertices.data.set(vertex, index * 3);
                vRange[0] = Math.min(vRange[0], index * 3);
                vRange[1] = Math.max(vRange[1], index * 3 + 3);
                var color = vertex._selected ? [1, 0.4, 0.1, 1] : [0, 0, 0, 1];
                buffer.colors.data.set(color, index * 4);
                cRange[0] = Math.min(cRange[0], index * 4);
                cRange[1] = Math.max(cRange[1], index * 4 + 4);
            }
            uploadRange(buffer.vertices, vRange);
            uploadRange(buffer.colors, cRange);
        }
    };

    var verticesBuilder = {
        onCreate: function (halfEdgeMesh) {
            var mesh = GL.Mesh.load({
                vertices: new Float32Array(halfEdgeMesh.vertices.length * 3),
                colors: new Float32Array(halfEdgeMesh.vertices.length * 4)
            });
            this.onVerticesChange(halfEdgeMesh.vertices, mesh);
            return mesh;
        },
        onVerticesChange: function (vertices, mesh) {
            var buffer = mesh.vertexBuffers;
            var vRange = [Number.MAX_VALUE, 0];
            var cRange = [Number.MAX_VALUE, 0];
            for (var i = 0; i < vertices.length; i++) {
                var vertex = vertices[i];
                var index = vertex._halfEdge.ownIndex;

                buffer.vertices.data.set(vertex, index * 3);
                vRange[0] = Math.min(vRange[0], index * 3);
                vRange[1] = Math.max(vRange[1], index * 3 + 3);

                var color = vertex._selected ? [1, 0.4, 0.1, 1] : [0, 0, 0, 1];
                buffer.colors.data.set(color, index * 4);
                cRange[0] = Math.min(cRange[0], index * 4);
                cRange[1] = Math.max(cRange[1], index * 4 + 4);
            }
            uploadRange(buffer.vertices, vRange);
            uploadRange(buffer.colors, cRange);
        }
    };

    function uploadRange (buffer, range) {
        buffer.uploadRange(range[0] * bytesPerFloat32Element,
            (range[1] - range[0]) * bytesPerFloat32Element);
    }
})());
