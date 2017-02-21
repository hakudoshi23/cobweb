((function () {
    'use strict';

    Modules.prototype.add('math-halfEdge-face', function (instance) {
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

        Math.HalfEdgeFace = HalfEdgeFace;
    });

    function computeNormal (v1, v2, v3) {
        var tmp1 = vec3.create();
        var tmp2 = vec3.create();
        vec3.sub(tmp1, v2, v1);
        vec3.sub(tmp2, v3, v1);
        vec3.cross(tmp1, tmp1, tmp2);
        return tmp1;
    }
})());
