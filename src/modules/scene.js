((function () {
    'use strict';

    Modules.prototype.add('scene', function (instance) {
        instance.scene = TreeNode.extend({});

        instance.scene.add({
            type: 'object',
            primitive: instance.graphics.gl.TRIANGLES,
            mesh: Math.HalfEdgeCube(),
            model: mat4.create(),
        });
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
