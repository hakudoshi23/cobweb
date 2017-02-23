((function () {
    'use strict';

    var octreeOptions = {};

    Modules.prototype.add('scene', function (instance) {
        instance.scene = TreeNode.extend();

        var cubeMesh = Math.HalfEdgeCube();
        var cubeSceneNode = {
            type: 'object',
            primitive: instance.graphics.gl.TRIANGLES,
            mesh: cubeMesh,
            bounds: new Math.Octree(octreeOptions),
            model: mat4.create(),
        };
        cubeSceneNode.bounds.addItems(cubeMesh.vertices);
        instance.scene.add(cubeSceneNode);
        instance.scene.add({
            type: 'light',
            color: [1, 1, 1],
            intensity: 1
        });

        instance.scene.getObjects = function () {
            return this.dfs(function (node) {
                return node.data.type === 'object';
            });
        };

        instance.scene.getLights = function () {
            return this.dfs(function (node) {
                return node.data.type === 'light';
            });
        };
    }, ['graphics', 'math-halfEdge-cube']);
})());
