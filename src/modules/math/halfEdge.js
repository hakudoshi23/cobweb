((function () {
    'use strict';

    var HalfEdgeMesh = function () {
        this.vertices = [];
        this.edges = [];
        this.faces = [];

        this.edgeMap = {};
    };

    HalfEdgeMesh.prototype.addFace = function (vertices) {
        //TODO: check if vertices are already in this.vertices, it not --> push
        //TODO: loop vertices from 0 to length
        //TODO: add a halfEdge from i to i+1 (i === length --> i to 0)

        //TODO: [for each halfedge] check if it exists --> warn
        //TODO: [for each halfedge] add halfEdge key -> val to map
        //TODO: [for each halfedge] check if there's an opposite --> add

        //TODO: add opposite halfEdges if there's any
    };

    HalfEdgeMesh.prototype.clear = function () {
        //TODO: clear all 3 arrays of data
    };

    HalfEdgeMesh.prototype.getMesh = function () {
        //TODO: loop all faces and add each one to the buffer
        //TODO: we'll keep a reference to update data when needed
    };

    HalfEdgeMesh.prototype.getWireframeMesh = function () {
        //TODO: loop all edges and add GL_LINE to buffer
        //TODO: we'll keep a reference to update data when needed
    };

    var HalfEdge = function () {
        this.opposite = null;
        this.vertex = null;
        this.face = null;
        this.next = null;
    };

    window.Math.HalfEdgeMesh = HalfEdgeMesh;

    HalfEdgeMesh.prototype.getEdgeKey = function (start, end) {
        var startIndex = this.vertices.indexOf(start);
        var endIndex = this.vertices.indexOf(end);
        if (startIndex > 0 && endIndex > 0)
            return startIndex + '' + endIndex;
        return null;
    };

    HalfEdgeMesh.prototype.getEdgeKeys = function (start, end) {
        return [this.getEdgeKey(start, end), this.getEdgeKey(end, start)];
    };
})());
