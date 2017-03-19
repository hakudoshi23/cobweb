((function () {
    'use strict';

    Modules.prototype.add('mesh', function (instance) {
        instance.asset = instance.asset || {};
        instance.asset.mesh = {
            get: function (name, callback) {
                Ajax.get('asset/mesh/' + name + '.obj', function (response) {
                    callback(buildHalfEdge(response));
                });
            }
        };
    });

    function buildHalfEdge (objSource) {
        var mesh = null;
        var vertices = [];
        var lines = objSource.split(/\r?\n/);
        lines.forEach(function (line) {
            if (line.startsWith('v')) {
                var vertex = line.substring(2).split(' ').map(function (number) {
                    return parseFloat(number);
                });
                vertices.push(vertex);
            } else if (line.startsWith('f')) {
                if (mesh === null) {
                    mesh = new Math.HalfEdgeMesh();
                    mesh.addVertices(vertices);
                }
                var faceVertices = line.substring(2).split(' ').map(function (index) {
                    return vertices[parseInt(index) - 1];
                });
                mesh.addFace(faceVertices);
            }
        });
        return mesh;
    }
})());
