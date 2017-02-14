((function () {
    'use strict';

    Modules.prototype.add('scene', function (instance) {
        instance.scene = {
            root: TreeNode.extend({})
        };

        var model = mat4.create();
        mat4.translate(model, model, [1, 1, 0]);

        instance.scene.root.add({
            type: 'object',
            primitive: instance.graphics.gl.TRIANGLES,
            mesh: GL.Mesh.cube(),
            model: model,
        });
        instance.scene.root.add({
            type: 'ligth',
            color: [1, 1, 1],
            intensity: 1
        });
    }, ['graphics']);
})());
