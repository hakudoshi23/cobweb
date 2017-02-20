((function () {
    'use strict';

    var HalfEdgeMesh = function () {
        this.clear();
    };

    HalfEdgeMesh.prototype.addVertices = function (vertices) {
        if (arguments.length > 1) this.addVertices.apply(this, arguments);
        if (!Array.isArray(vertices)) return;
        for (var i = 0; i < vertices.length; i++) {
            var vertex = vertices[i];
            var index = this.vertices.indexOf(vertex);
            if (index < 0) {
                vertex.ownIndex = this.vertices.length;
                this.vertices.push(vertex);
                vertex.outEdges = [];
            } else {
                console.error('addVertices: Adding vertex twice!', vertex);
            }
        }
    };

    HalfEdgeMesh.prototype.addFace = function (vertices) {
        if (arguments.length > 1) this.addFace.apply(this, arguments);
        if (!Array.isArray(vertices)) return;
        if (vertices.length >= 3) {
            var he1 = new HalfEdge(vertices[0], vertices[1]);
            var he2 = new HalfEdge(vertices[1], vertices[2], he1);
            he1.next = he2;
            this.halfEdges.push(he1, he2);
            if (vertices.length > 3) {
                var last, prev = he2;
                for (var i = 2; i < vertices.length - 1; i++) {
                    last = new HalfEdge(vertices[i], vertices[i + 1], he1);
                    if (!he2.next) he2.next = last;
                    last.next = prev;
                    this.halfEdges.push(last);
                    prev = last;
                }
                last = new HalfEdge(vertices[i], vertices[0], he1);
                last.next = he1;
                this.halfEdges.push(last);
                prev.next = last;
            }
            this.faces.push(he1);
        } else {
            console.error('addFace: 3 or more vertices needed to form a face!');
        }
    };

    HalfEdgeMesh.prototype.updateVertices = function (vertices) {
        console.debug('updateVertices', vertices);
    };

    HalfEdgeMesh.prototype.clear = function () {
        this.halfEdges = [];
        this.vertices = [];
        this.faces = [];
    };

    HalfEdgeMesh.prototype.getMesh = function () {
        return null;
    };

    HalfEdgeMesh.prototype.getWireframeMesh = function () {
        return null;
    };

    var HalfEdge = function (start, end, face) {
        this.vertex = end;
        start.outEdges.push(this);
        this.opposite = this.findOpposite(start);
        if (this.opposite) this.opposite.opposite = this;
        this.face = face ? face : this;
        this.next = null;
    };

    HalfEdge.prototype.getFaceEdges = function () {
        var output = [];
        var he = this;
        while (he.next !== this) {
            output.push(he);
            he = he.next;
        }
        output.push(he);
        return output;
    };

    HalfEdge.prototype.findOpposite = function (start) {
        var opposites = this.vertex.outEdges.filter(function (he) {
            return he.vertex === start;
        });
        return (opposites && opposites[0]) ? opposites[0] : null;
    };

    window.Math.HalfEdgeMesh = HalfEdgeMesh;
})());
