((function () {
    'use strict';

    Modules.prototype.add('render-solid', function (instance) {
        var shader = null;
        var firstSource = null;
        var vertSource = Ajax.get('shader/solid.vert', function (response) {
            if (firstSource) {
                shader = new Shader(response, firstSource);
            } firstSource = response;
        });
        var fragSource = Ajax.get('shader/solid.frag', function (response) {
            if (firstSource) {
                shader = new Shader(firstSource, response);
            } firstSource = response;
        });

        var grid = {
            type: 'object',
            primitive: instance.graphics.gl.LINES,
            mesh: GL.Mesh.grid({
                lines: 11,
                size: 10
            }),
            model: mat4.create(),
        };

        instance.surface.renders.solid = function (surface) {
            var lightDirection = vec3.create();
            surface.camera.getPosition(lightDirection);
            vec3.add(lightDirection, lightDirection, [1, 2, 0]);
            vec3.normalize(lightDirection, lightDirection);
            uniforms.u_lightvector = lightDirection;

            renderObject(surface, grid, shader);
            instance.scene.getObjects().forEach(function (node) {
                renderObject(surface, node.data, shader);
            });
        };

        instance.events.on('surface.create', function (surface) {
            instance.surface.setRender(surface, 'solid');
        });
    }, ['surface-render']);

    var uniforms = {
        u_color: [0.7, 0.7, 0.7, 1],
        u_lightvector: null,
        u_model: null,
        u_mvp: mat4.create()
    };

    var temp = mat4.create();
    function renderObject (surface, obj, shader) {
        surface.camera.getViewMatrix(temp);
        mat4.multiply(temp, surface.camera.projection, temp);
        mat4.multiply(uniforms.u_mvp, temp, obj.model);

        uniforms.u_color = obj.selected ? [1,0,0,1] : [0.7, 0.7, 0.7, 1];

        uniforms.u_model = obj.model;

        if (shader) {
            shader.uniforms(uniforms);
            if (obj.mesh instanceof Math.HalfEdgeMesh) {
                var mesh = obj.mesh.getMesh();
                shader.draw(mesh, obj.primitive);
            } else {
                shader.draw(obj.mesh, obj.primitive);
            }
        }
    }
})());
