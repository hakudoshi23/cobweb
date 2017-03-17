((function () {
    'use strict';

    Modules.prototype.add('render-solid', function (instance) {
        var shader = null;
        instance.asset.shader.get('solid', function (s) {
            shader = s;
        });

        var grid = {
            type: 'object',
            primitive: instance.graphics.gl.LINES,
            mesh: GL.Mesh.grid({lines:11,size:10}),
            model: mat4.create(),
        };

        var bounds = {
            type: 'object',
            primitive: instance.graphics.gl.LINES,
            mesh: GL.Mesh.box({wireframe:true}),
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
                updateBoundsModel(bounds.model, node.data.mesh.bounds);
                renderObject(surface, bounds, shader, 'wireframe');
                renderObject(surface, node.data, shader);
            });
        };

        instance.events.on('surface.create', function (surface) {
            instance.surface.setRender(surface, 'solid');
        });
    }, ['surface-render', 'shader', 'render-solid-cache']);

    var uniforms = {
        u_color: [0.5, 0.5, 0.5, 1],
        u_lightvector: null,
        u_model: null,
        u_mvp: mat4.create()
    };

    var temp = mat4.create();
    function renderObject (surface, obj, shader, indexBufferName) {
        surface.camera.getViewMatrix(temp);
        mat4.multiply(temp, surface.camera.projection, temp);
        mat4.multiply(uniforms.u_mvp, temp, obj.model);

        uniforms.u_model = obj.model;

        if (shader) {
            shader.uniforms(uniforms);
            if (obj.mesh instanceof Math.HalfEdgeMesh) {
                var mesh = obj.mesh.cache.get('render-solid');
                if (mesh) shader.draw(mesh, obj.primitive, indexBufferName);
            } else {
                shader.draw(obj.mesh, obj.primitive, indexBufferName);
            }
        }
    }

    function updateBoundsModel (model, octree) {
        mat4.identity(model);
        var scale = [0, 0, 0], position = [0, 0, 0];
        vec3.lerp(position, octree.aabb.min, octree.aabb.max, 0.5);
        mat4.translate(model, model, position);
        vec3.sub(scale, octree.aabb.max, octree.aabb.min);
        mat4.scale(model, model, scale);
    }
})());
