((function () {
    'use strict';

    Modules.prototype.add('math-halfEdge', function (instance) {
        var HalfEdge = function (start, end, face) {
            this.vertex = end;
            start.outEdges.push(this);
            this.opposite = this.findOpposite(start);
            if (this.opposite) this.opposite.opposite = this;
            this.face = face ? face : new Math.HalfEdgeFace(this);
            this.next = null;
        };

        HalfEdge.prototype.findOpposite = function (start) {
            var opposites = this.vertex.outEdges.filter(function (he) {
                return he.vertex === start;
            });
            return (opposites && opposites[0]) ? opposites[0] : null;
        };

        Math.HalfEdge = HalfEdge;
    }, ['math-halfEdge-face']);
})());
