((function () {
    'use strict';

    Modules.prototype.add('math-halfEdge', function (instance) {
        Math.HalfEdgeMesh = HalfEdgeMesh;
    });

    var HalfEdgeMesh = function () {
        this.halfEdges = [];
        this.vertices = [];
        this.faces = [];
    };

    HalfEdgeMesh.prototype.addVertices = function (vertices) {
        if (arguments.length > 1) this.addVertices.apply(this, arguments);
        if (!Array.isArray(vertices)) return;
        for (var i = 0; i < vertices.length; i++) {
            var vertex = vertices[i];
            var index = this.vertices.indexOf(vertex);
            if (index < 0) {
                var _halfEdge = {};
                _halfEdge.computeNormal = VertexComputeNormal;
                _halfEdge.ownIndex = this.vertices.length;
                _halfEdge.getFaces = VertexGetFaces;
                _halfEdge.outEdges = [];
                vertex._halfEdge = _halfEdge;
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
            var he1 = buildEdge(vertices[0], vertices[1]);
            var he2 = buildEdge(vertices[1], vertices[2], he1.face);
            he1.next = he2;
            this.halfEdges.push(he1, he2);
            if (vertices.length > 3) {
                var last, prev = he2;
                for (var i = 2; i < vertices.length - 1; i++) {
                    last = buildEdge(vertices[i], vertices[i + 1], he1.face);
                    if (!he2.next) he2.next = last;
                    last.next = prev;
                    this.halfEdges.push(last);
                    prev = last;
                }
                last = buildEdge(vertices[i], vertices[0], he1.face);
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
                buffer[vertex._halfEdge.ownIndex * 3 + 0] = vertex[0];
                buffer[vertex._halfEdge.ownIndex * 3 + 1] = vertex[1];
                buffer[vertex._halfEdge.ownIndex * 3 + 2] = vertex[2];
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

    HalfEdgeMesh.prototype.getMesh = GetMesh;

    function buildEdge (start, end, face) {
        var edge = {};
        edge.vertex = end;
        edge.face = face ? face : new HalfEdgeFace(edge);
        edge.opposite = findOppositeEdge(start, end) || edge;
        edge.next = null;
        start._halfEdge.outEdges.push(edge);
        return edge;
    }

    function findOppositeEdge(start, end) {
        var opposites = end._halfEdge.outEdges.filter(function (he) {
            return he.vertex === start;
        });
        return (opposites && opposites[0]) ? opposites[0] : null;
    }

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

    var HalfEdgeFace = function (halfEdge) {
        this.halfEdge = halfEdge;
    };

    HalfEdgeFace.prototype.getEdges = function () {
        var output = [];
        var he = this.halfEdge;
        while (he.next !== this.halfEdge) {
            output.push(he);
            he = he.next;
        }
        output.push(he);
        return output;
    };

    HalfEdgeFace.prototype.getVertices = function () {
        return this.getEdges().map(function (edge) {
            return edge.vertex;
        });
    };

    HalfEdgeFace.prototype.getVerticesTriangulated = function () {
        var triangulated = [];
        var vertices = this.getVertices();
        for (var i = 0; i < vertices.length - 2; i++) {
            triangulated.push([vertices[0], vertices[i + 1], vertices[i + 2]]);
        }
        return triangulated;
    };

    HalfEdgeFace.prototype.computeRawNormal = function () {
        var normal = [0, 0, 0];
        this.getVerticesTriangulated().forEach(function (triplet) {
            var triangleNormal = computeNormal(triplet[0], triplet[1], triplet[2]);
            vec3.add(normal, normal, triangleNormal);
        });
        return normal;
    };

    HalfEdgeFace.prototype.computeNormal = function () {
        var normal = this.computeRawNormal();
        vec3.normalize(normal, normal);
        return normal;
    };

    function computeNormal (v1, v2, v3) {
        var tmp1 = vec3.create();
        var tmp2 = vec3.create();
        vec3.sub(tmp1, v2, v1);
        vec3.sub(tmp2, v3, v1);
        vec3.cross(tmp1, tmp1, tmp2);
        return tmp1;
    }

    function GetMesh (options) {
        options = Object.assign({}, {
            normals: 'vertex',
            wireframe: false
        }, options);
        var buffers = {};

        buffers.vertices = new Float32Array(this.vertices.length * 3);
        for (var i = 0; i < this.vertices.length; i++) {
            buffers.vertices[i * 3 + 0] = this.vertices[i][0];
            buffers.vertices[i * 3 + 1] = this.vertices[i][1];
            buffers.vertices[i * 3 + 2] = this.vertices[i][2];
        }

        buffers.normals = new Float32Array(this.vertices.length * 3);
        for (i = 0; i < this.vertices.length; i++) {
            var normal = this.vertices[i]._halfEdge.computeNormal();
            buffers.normals[i * 3 + 0] = normal[0];
            buffers.normals[i * 3 + 1] = normal[1];
            buffers.normals[i * 3 + 2] = normal[2];
        }

        var triangles = [];
        for (i = 0; i < this.faces.length; i++) {
            var ts = this.faces[i].getVerticesTriangulated();
            for (var j = 0; j < ts.length; j++) {
                triangles.push(ts[j][0]._halfEdge.ownIndex,
                    ts[j][1]._halfEdge.ownIndex, ts[j][2]._halfEdge.ownIndex);
            }
        }
        buffers.triangles = new Uint16Array(triangles);
        return GL.Mesh.load(buffers);
    }
})());
