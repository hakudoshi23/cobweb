((function () {
    'use strict';

    Cobweb.prototype.modules.add('scene', function (instance) {
        instance.scene = {
            root: TreeNode.extend({})
        };

        var mat = mat4.create();
        mat4.rotateY(mat, mat, 0.8);

        instance.scene.root.add({
            type: 'object',
            primitive: instance.graphics.gl.TRIANGLES,
            mesh: GL.Mesh.cube(),
            model: mat,
        });
    }, ['graphics']);
})());
