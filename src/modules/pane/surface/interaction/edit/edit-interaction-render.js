((function () {
    'use strict';

    var shader = null;

    Modules.prototype.add('edit-interaction-render', function (instance) {
        instance.asset.shader.get('wireframe', function (s) {
            shader = s;
        });

        var vertices = [], colors = [], count = 0;
        for (var rads = 0; rads < (Math.PI * 2); rads += 0.1) {
            vertices[count * 3 + 0] = Math.sin(rads) * 5;
            vertices[count * 3 + 1] = Math.cos(rads) * 5;
            vertices[count * 3 + 2] = 0;
            colors[count * 4 + 0] = 1;
            colors[count * 4 + 1] = 1;
            colors[count * 4 + 2] = 1;
            colors[count * 4 + 3] = 1;
            count++;
        }
        var circle = GL.Mesh.load({
            vertices: new Float32Array(vertices),
            colors: new Float32Array(colors)
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

        var uniforms = {
            u_mvp: mat4.create()
        };

        instance.surface.interactions.edit.drawBounds = null;
        instance.surface.interactions.edit.onRender = function (surface) {
            var selection = this.selection;
            instance.scene.getObjects().forEach(function (node) {
                var obj = node.data;

                var wireframe = obj.mesh.cache.get('edit-interaction-render-wireframe');
                var vertices = obj.mesh.cache.get('edit-interaction-render-vertices');
                var drawBounds = instance.surface.interactions.edit.drawBounds;

                renderObject(surface, wireframe, shader, instance.graphics.gl.LINES);
                renderObject(surface, vertices, shader, instance.graphics.gl.POINTS);
                if (drawBounds !== null)
                    renderBounds(surface, shader, bounds, obj.mesh.bounds, drawBounds);

                if (!selection.isEmpty()) {
                    var c = selection.getCenter();
                    vec3.transformMat4(c, c, surface.camera.getViewMatrix());
                    vec3.transformMat4(c, c, surface.camera.projection);
                    c[0] = ((c[0] + 1) / 2) * surface.camera.width;
                    c[1] = ((c[1] + 1) / 2) * surface.camera.height;

                    mat4.identity(uniforms.u_mvp);
                    mat4.translate(uniforms.u_mvp, uniforms.u_mvp, [c[0], c[1], 0]);
                    mat4.multiply(uniforms.u_mvp, surface.camera.ortho, uniforms.u_mvp);

                    shader.uniforms(uniforms);
                    shader.draw(circle, instance.graphics.gl.LINE_LOOP);
                }
            });
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
        function renderBounds (surface, shader, bounds, octree, recursive) {
            updateBoundsModel(boundsModel, octree);
            renderObject(surface, bounds, shader, instance.graphics.gl.LINES, boundsModel, 'wireframe');
            if (recursive && octree.children)
                for (var i = 0; i < octree.children.length; i++)
                    renderBounds(surface, shader, bounds, octree.children[i], instance.graphics.gl.LINES);
        }

        function updateBoundsModel (model, octree) {
            mat4.identity(model);
            var scale = [0, 0, 0], position = [0, 0, 0];
            vec3.lerp(position, octree.aabb.min, octree.aabb.max, 0.5);
            mat4.translate(model, model, position);
            vec3.sub(scale, octree.aabb.max, octree.aabb.min);
            mat4.scale(model, model, scale);
        }
    }, ['edit-interaction', 'shader', 'edit-interaction-render-cache']);
})());
