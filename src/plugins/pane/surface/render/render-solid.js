((function () {
    'use strict';

    Cobweb.prototype.plugins.add('render-solid', function (instance) {
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
            '  gl_FragColor = u_color * max(0.0, dot(u_lightvector,N));' +
            '}'
        );

        var temp = mat4.create();
        var mvp = mat4.create();

        var uniforms = {
            u_color: [1, 1, 1, 1],
            u_lightvector: vec3.normalize(vec3.create(), [1, 2, 3]),
            u_model: null,
            u_mvp: mvp
        };

        instance.graphics.renders.add('solid', function (surface) {
            for (var name in instance.scene) {
                var obj = instance.scene[name];
                if (obj) {
        			mat4.multiply(temp, surface.view, obj.model);
        			mat4.multiply(mvp, surface.proj, temp);

        			uniforms.u_model = obj.model;
        			shader.uniforms(uniforms).draw(obj.mesh, obj.primitive);
                    mat4.rotateY(surface.view, surface.view, 0.01);
                }
            }
        });


    }, ['graphics-render']);
})());
