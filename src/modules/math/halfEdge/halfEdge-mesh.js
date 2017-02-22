((function () {
    'use strict';

    Modules.prototype.add('math-halfEdgeMesh', function (instance) {
        var HalfEdgeMesh = function () {
            this.halfEdges = [];
            this.vertices = [];
            this.faces = [];

            this.mesh = null;
        };

        HalfEdgeMesh.prototype.addVertices = function (vertices) {
            if (arguments.length > 1) this.addVertices.apply(this, arguments);
            if (!Array.isArray(vertices)) return;
            for (var i = 0; i < vertices.length; i++) {
                var vertex = vertices[i];
                var index = this.vertices.indexOf(vertex);
                if (index < 0) {
                    vertex.computeNormal = VertexComputeNormal;
                    vertex.ownIndex = this.vertices.length;
                    vertex.getFaces = VertexGetFaces;
                    vertex.outEdges = [];
                    this.vertices.push(vertex);
                } else {
                    console.error('addVertices: Adding vertex twice!', vertex);
                }
            }
        };

        HalfEdgeMesh.prototype.addFace = function (vertices) {
            if (arguments.length > 1) this.addFace.apply(this, arguments);
            if (!Array.isArray(vertices)) return;
            if (vertices.length >= 3) {
                var he1 = new Math.HalfEdge(vertices[0], vertices[1]);
                var he2 = new Math.HalfEdge(vertices[1], vertices[2], he1.face);
                he1.next = he2;
                this.halfEdges.push(he1, he2);
                if (vertices.length > 3) {
                    var last, prev = he2;
                    for (var i = 2; i < vertices.length - 1; i++) {
                        last = new Math.HalfEdge(vertices[i], vertices[i + 1], he1.face);
                        if (!he2.next) he2.next = last;
                        last.next = prev;
                        this.halfEdges.push(last);
                        prev = last;
                    }
                    last = new Math.HalfEdge(vertices[i], vertices[0], he1.face);
                    last.next = he1;
                    this.halfEdges.push(last);
                    prev.next = last;
                }
                this.faces.push(he1.face);
            } else {
                console.error('addFace: 3 or more vertices needed to form a face!');
            }
        };

        HalfEdgeMesh.prototype.onVertexChange = function (vertices) {
            if (arguments.length > 1) this.onVertexChange.apply(this, arguments);
            if (this.mesh !== null) {
                for (var i = 0; i < vertices.length; i++) {
                    var vertex = vertices[i];
                    var buffer = this.mesh.vertexBuffers.vertices.data;
                    buffer[vertex.ownIndex * 3 + 0] = vertex[0];
                    buffer[vertex.ownIndex * 3 + 1] = vertex[1];
                    buffer[vertex.ownIndex * 3 + 2] = vertex[2];
                }
            }
        };

        HalfEdgeMesh.prototype.onVertexChangeIndex = function (indices) {
            if (arguments.length > 1) this.onVertexChangeIndex.apply(this, arguments);
            var vertices = this.vertices;
            this.onVertexChange(indices.map(function (index) {
                return vertices[index];
            }));
        };

        HalfEdgeMesh.prototype.clear = function () {
            this.halfEdges = [];
            this.vertices = [];
            this.faces = [];
        };

        var defaultMeshOptions = {
            normals: 'vertex',
            wireframe: false
        };

        HalfEdgeMesh.prototype.getMesh = function (options) {
            options = Object.assign({}, defaultMeshOptions, options);
            if (this.mesh === null) {
                var buffers = {};

                buffers.vertices = new Float32Array(this.vertices.length * 3);
                for (var i = 0; i < this.vertices.length; i++) {
                    buffers.vertices[i * 3 + 0] = this.vertices[i][0];
                    buffers.vertices[i * 3 + 1] = this.vertices[i][1];
                    buffers.vertices[i * 3 + 2] = this.vertices[i][2];
                }

                var triangles = [];
                for (i = 0; i < this.faces.length; i++) {
                    var ts = this.faces[i].getVerticesTriangulated();
                    for (var j = 0; j < ts.length; j++) {
                        triangles.push(ts[j][0].ownIndex,
                            ts[j][1].ownIndex, ts[j][2].ownIndex);
                    }
                }
                buffers.triangles = new Uint16Array(triangles);
                this.mesh = GL.Mesh.load(buffers);
            }
            return this.mesh;
        };

        Math.HalfEdgeMesh = HalfEdgeMesh;
    }, ['math-halfEdge']);

    function VertexGetFaces () {
        return this.outEdges.map(function (edge) {
            return edge.face;
        });
    }

    function VertexComputeNormal () {
        var normal = [0, 0, 0];
        this.getFaces().forEach(function (face) {
            vec3.add(normal, normal, face.computeRawNormal());
        });
        vec3.normalize(normal, normal);
        return normal;
    }
})());
