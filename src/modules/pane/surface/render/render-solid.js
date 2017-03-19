((function () {
    'use strict';

    var solidShader = null;
    var wireframeShader = null;

    Modules.prototype.add('render-solid', function (instance) {
        instance.asset.shader.get('solid', function (s) {
            solidShader = s;
        });
        instance.asset.shader.get('wireframe', function (s) {
            wireframeShader = s;
        });

        var bounds = GL.Mesh.load({
            vertices: new Float32Array([
                0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5,
                0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5,
            ]),
            colors: new Float32Array([
                0.6, 0.6, 0.6, 1, 0.6, 0.6, 0.6, 1, 0.6, 0.6, 0.6, 1, 0.6, 0.6, 0.6, 1,
                0.6, 0.6, 0.6, 1, 0.6, 0.6, 0.6, 1, 0.6, 0.6, 0.6, 1, 0.6, 0.6, 0.6, 1
            ]),
            wireframe: new Uint16Array([
                0, 1, 1, 3, 3, 2, 2, 0,
                4, 5, 5, 7, 7, 6, 6, 4,
                0, 4, 1, 5, 2, 6, 3, 7
            ])
        });
        var grid = GL.Mesh.grid({lines:17,size:16});
        var colorsArray = [];
        grid.vertexBuffers.vertices.forEach(function (vertex, bufferIndex) {
            colorsArray.push(0.4, 0.4, 0.4, 1);
        });
        grid.createVertexBuffer('colors', 'a_color', 4, new Float32Array(colorsArray));
        var axisX = GL.Mesh.load({
            vertices: new Float32Array([-8, 0.001, 0, 8, 0.001, 0]),
            colors: new Float32Array([1, 0, 0, 1, 1, 0, 0, 1])
        });
        var axisZ = GL.Mesh.load({
            vertices: new Float32Array([0, 0.001, -8, 0, 0.001, 8]),
            colors: new Float32Array([0, 1, 0, 1, 0, 1, 0, 1])
        });

        instance.surface.renders.solid = function (surface) {
            var lightDirection = vec3.create();
            surface.camera.getPosition(lightDirection);
            vec3.add(lightDirection, lightDirection, [1, 2, 0]);
            vec3.normalize(lightDirection, lightDirection);
            uniforms.u_lightvector = lightDirection;

            renderObject(surface, grid, wireframeShader, instance.graphics.gl.LINES);
            renderObject(surface, axisX, wireframeShader, instance.graphics.gl.LINES);
            renderObject(surface, axisZ, wireframeShader, instance.graphics.gl.LINES);
            instance.scene.getObjects().forEach(function (node) {
                var mesh = node.data.mesh.cache.get('render-solid');
                renderBounds(surface, wireframeShader, bounds, node.data.mesh.bounds, instance.graphics.gl.LINES);
                renderObject(surface, mesh, solidShader, node.data.primitive, node.data.model);
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
    function renderObject (surface, mesh, shader, primitive, model, indexBufferName) {
        model = model || mat4.create();

        surface.camera.getViewMatrix(temp);
        mat4.multiply(temp, surface.camera.projection, temp);
        mat4.multiply(uniforms.u_mvp, temp, model);

        uniforms.u_model = model;

        if (shader) {
            shader.uniforms(uniforms);
            if (mesh instanceof Math.HalfEdgeMesh) {
                if (mesh) shader.draw(mesh, primitive, indexBufferName);
            } else {
                shader.draw(mesh, primitive, indexBufferName);
            }
        }
    }

    var boundsModel = mat4.create();
    function renderBounds (surface, shader, bounds, octree, primitive) {
        updateBoundsModel(boundsModel, octree);
        renderObject(surface, bounds, shader, primitive, boundsModel, 'wireframe');
        if (octree.children)
            for (var i = 0; i < octree.children.length; i++)
                renderBounds(surface, shader, bounds, octree.children[i], primitive);
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
