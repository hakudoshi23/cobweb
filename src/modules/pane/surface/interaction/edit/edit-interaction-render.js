((function () {
    'use strict';

    var shader = null;

    Modules.prototype.add('edit-interaction-render', function (instance) {
        instance.asset.shader.get('wireframe', function (s) {
            shader = s;
        });

        var uniforms = {
            u_mvp: mat4.create()
        };

        var temp = mat4.create();
        instance.surface.interactions.edit.onRender = function (surface) {
            instance.scene.getObjects().forEach(function (node) {
                var obj = node.data;

                surface.camera.getViewMatrix(temp);
                mat4.multiply(temp, surface.camera.projection, temp);
                mat4.multiply(uniforms.u_mvp, temp, obj.model);

                if (shader) {
                    shader.uniforms(uniforms);
                    if (obj.mesh instanceof Math.HalfEdgeMesh) {
                        var wireframe = obj.mesh.cache.get('edit-interaction-render-wireframe');
                        var vertices = obj.mesh.cache.get('edit-interaction-render-vertices');
                        shader.draw(wireframe, instance.graphics.gl.LINES);
                        shader.draw(vertices, instance.graphics.gl.POINTS);
                    }
                }
            });
        };
    }, ['edit-interaction', 'shader', 'edit-interaction-render-cache']);
})());
