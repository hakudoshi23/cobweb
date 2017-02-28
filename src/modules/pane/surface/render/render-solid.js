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
                var mesh = getCachedVBOMesh(obj.mesh);
                shader.draw(mesh, obj.primitive);
            } else {
                shader.draw(obj.mesh, obj.primitive);
            }
        }
    }

    function getCachedVBOMesh (halfEdgeMesh) {
        if (halfEdgeMesh._cache) {
            if (halfEdgeMesh._cache.time <= halfEdgeMesh.lastBump) {
                halfEdgeMesh._cache = buildMeshFromHalfEdges(halfEdgeMesh);
                halfEdgeMesh._cache.time = Date.now();
            }
        } else {
            halfEdgeMesh._cache = buildMeshFromHalfEdges(halfEdgeMesh);
            halfEdgeMesh._cache.time = Date.now();
        }
        return halfEdgeMesh._cache;
    }

    function buildMeshFromHalfEdges (halfEdgeMesh) {
        var buffers = {};

        buffers.vertices = new Float32Array(halfEdgeMesh.vertices.length * 3);
        for (var i = 0; i < halfEdgeMesh.vertices.length; i++) {
            buffers.vertices[i * 3 + 0] = halfEdgeMesh.vertices[i][0];
            buffers.vertices[i * 3 + 1] = halfEdgeMesh.vertices[i][1];
            buffers.vertices[i * 3 + 2] = halfEdgeMesh.vertices[i][2];
        }

        buffers.normals = new Float32Array(halfEdgeMesh.vertices.length * 3);
        for (i = 0; i < halfEdgeMesh.vertices.length; i++) {
            var normal = halfEdgeMesh.vertices[i]._halfEdge.computeNormal();
            buffers.normals[i * 3 + 0] = normal[0];
            buffers.normals[i * 3 + 1] = normal[1];
            buffers.normals[i * 3 + 2] = normal[2];
        }

        var triangles = [];
        for (i = 0; i < halfEdgeMesh.faces.length; i++) {
            var ts = halfEdgeMesh.faces[i].getVerticesTriangulated();
            for (var j = 0; j < ts.length; j++) {
                triangles.push(ts[j][0]._halfEdge.ownIndex,
                    ts[j][1]._halfEdge.ownIndex, ts[j][2]._halfEdge.ownIndex);
            }
        }
        buffers.triangles = new Uint16Array(triangles);
        return GL.Mesh.load(buffers);
    }
})());
