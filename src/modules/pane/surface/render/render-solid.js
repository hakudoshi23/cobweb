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

        var grid = GL.Mesh.grid({lines:17,size:16});
        var colorsArray = [];
        grid.vertexBuffers.vertices.forEach(function (vertex, bufferIndex) {
            colorsArray.push(0.4, 0.4, 0.4, 1);
        });
        grid.createVertexBuffer('colors', 'a_color', 4, new Float32Array(colorsArray));
        var axisX = GL.Mesh.load({
            vertices: new Float32Array([-8, 0, 0, 8, 0, 0]),
            colors: new Float32Array([1, 0, 0, 1, 1, 0, 0, 1])
        });
        var axisZ = GL.Mesh.load({
            vertices: new Float32Array([0, 0, -8, 0, 0, 8]),
            colors: new Float32Array([0, 1, 0, 1, 0, 1, 0, 1])
        });

        instance.surface.renders.solid = function (surface) {
            var lightDirection = vec3.create();
            surface.camera.getPosition(lightDirection);
            vec3.add(lightDirection, lightDirection, [1, 2, 0]);
            vec3.normalize(lightDirection, lightDirection);
            uniforms.u_lightvector = lightDirection;

            var gl = instance.graphics.gl;
            renderObject(surface, grid, wireframeShader, gl.LINES);
            gl.disable(gl.DEPTH_TEST);
            renderObject(surface, axisX, wireframeShader, gl.LINES);
            renderObject(surface, axisZ, wireframeShader, gl.LINES);
            gl.enable(gl.DEPTH_TEST);
            instance.scene.getObjects().forEach(function (node) {
                var mesh = node.data.mesh.cache.get('render-solid');
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
})());
