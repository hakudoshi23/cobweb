((function () {
    'use strict';

    Modules.prototype.add('render-solid', function (instance) {
        var shader = new Shader(
            'precision highp float;' +
            'attribute vec3 a_vertex;' +
            'attribute vec3 a_normal;' +
            'varying vec3 v_normal;' +
            'uniform mat4 u_mvp;' +
            'uniform mat4 u_model;' +
            'void main() {' +
            '    v_normal = (u_model * vec4(a_normal,0.0)).xyz;' +
            '    gl_Position = u_mvp * vec4(a_vertex,1.0);' +
            '}',
            'precision highp float;' +
            'varying vec3 v_normal;' +
            'uniform vec3 u_lightvector;' +
            'uniform vec4 u_color;' +
            'void main() {' +
            '  vec3 N = normalize(v_normal);' +
            '  vec4 ambient = vec4(0.4, 0.4, 0.4, 1);' +
            '  gl_FragColor = ambient + u_color * max(0.0, dot(u_lightvector,N));' +
            '}'
        );

        var temp = mat4.create();
        var mvp = mat4.create();

        var uniforms = {
            u_color: [0.7, 0.7, 0.7, 1],
            u_lightvector: null,
            u_model: null,
            u_mvp: mvp
        };

        instance.surface.renders.solid = function (surface) {
            var objs = instance.scene.root.dfs();
            for (var i = 0; i < objs.length; i++) {
                var obj = objs[i].data;
                if (obj.type === 'object') {
                    var lightDirection = vec3.create();
                    surface.getCameraPosition(lightDirection);
                    vec3.add(lightDirection, lightDirection, [1, 2, 0]);
                    vec3.normalize(lightDirection, lightDirection);
                    uniforms.u_lightvector = lightDirection;

                    surface.getViewMatrix(temp);
        			mat4.multiply(temp, surface.proj, temp);
        			mat4.multiply(mvp, temp, obj.model);

        			uniforms.u_model = obj.model;
        			shader.uniforms(uniforms).draw(obj.mesh, obj.primitive);
                }
            }
        };

        instance.events.on('surface.create', function (surface) {
            instance.surface.setRender(surface, 'solid');
        });
    }, ['surface-render']);
})());
