((function () {
    'use strict';

    Cobweb.prototype.modules.add('scene', function (instance) {
        instance.scene = {
            root: TreeNode.extend({})
        };

        instance.scene.root.add({
            type: 'object',
            primitive: instance.graphics.gl.TRIANGLES,
            mesh: GL.Mesh.cube(),
            model: mat4.create(),
        });
        instance.scene.root.add({
            type: 'object',
            primitive: instance.graphics.gl.LINES,
            mesh: GL.Mesh.grid({
                lines: 17,
                size: 8
            }),
            model: mat4.create(),
        });
        instance.scene.root.add({
            type: 'ligth',
            color: [1, 1, 1],
            intensity: 1
        });
    }, ['graphics']);
})());
