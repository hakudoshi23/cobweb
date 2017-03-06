((function () {
    'use strict';

    var objectCount = 0;
    var lightCount = 0;

    Modules.prototype.add('scene', function (instance) {
        instance.scene = TreeNode.extend();

        instance.scene.addObject = function (info) {
            if (!info.primitive) info.primitive = instance.graphics.gl.TRIANGLES;
            if (!info.model) info.model = mat4.create();
            if (!info.type) info.type = 'object';
            if (!info.name) info.name = 'object_' + (objectCount++);
            this.add(info);
        };

        instance.scene.addLight = function (info) {
            if (!info.model) info.position = [0, 0, 0];
            if (!info.color) info.color = [1, 1, 1];
            if (!info.intensity) info.intensity = 1;
            if (!info.type) info.type = 'light';
            if (!info.name) info.name = 'light_' + (lightCount++);
            this.add(info);
        };

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

        instance.scene.addObject({mesh: Math.HalfEdgeCube()});
        instance.scene.addLight({position: [0, 10, 5]});
    }, ['graphics', 'math-halfEdge-cube']);
})());
