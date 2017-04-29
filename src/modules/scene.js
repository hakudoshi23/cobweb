((function () {
    'use strict';

    var objectCount = 0;

    Modules.prototype.add('scene', function (instance) {
        instance.scene = TreeNode.extend();

        instance.scene.addObject = function (info) {
            if (!info.primitive) info.primitive = instance.graphics.gl.TRIANGLES;
            if (!info.model) info.model = mat4.create();
            if (!info.type) info.type = 'object';
            if (!info.name) info.name = 'object_' + (objectCount++);
            this.add(info);
        };

        instance.scene.getObjectByName = function (name) {
            return getObjectByName(this, name);
        };

        instance.scene.getObjects = function () {
            return this.dfs(function (node) {
                return node.data.type === 'object';
            });
        };

        instance.asset.mesh.get('sphere', function (mesh) {
            instance.scene.addObject({mesh: mesh});
        });
    }, ['graphics']);

    function getObjectByName (rootNode, name) {
        for (var i = 0; i < rootNode.children.length; i++) {
            var child = rootNode.children[i];
            if (child.data.name === name) {
                return child.data;
            } else {
                var node = getObjectByName(child, name);
                if (node) return node.data;
            }
        }
        return null;
    }
})());
