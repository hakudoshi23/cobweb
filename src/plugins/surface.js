'use strict';

((function () {
    var Surface = function(instance) {
        this.gl = GL.create({
            height: instance.container.height(),
            width: instance.container.width()
        });

        this.gl.animate();

        var objs = [];

        objs[0] = {};
        objs[0].primitive = this.gl.TRIANGLES;
        objs[0].model = mat4.create();
        objs[0].mesh = GL.Mesh.cube();
        mat4.translate(objs[0].model, objs[0].model, [-2, 0, 0]);

        objs[1] = {};
        objs[1].primitive = this.gl.TRIANGLES;
        objs[1].model = mat4.create();
        objs[1].mesh = GL.Mesh.sphere();
        mat4.translate(objs[1].model, objs[1].model, [2, 0, 0]);

        objs[2] = {};
        objs[2].primitive = this.gl.TRIANGLES;
        objs[2].model = mat4.create();
        objs[2].mesh = GL.Mesh.cylinder({radius:0.5});
        mat4.translate(objs[2].model, objs[2].model, [0, 0, -2]);

        var proj = mat4.create();
        var view = mat4.create();
        var model = mat4.create();
        var mvp = mat4.create();
        var temp = mat4.create();

        mat4.perspective(proj, 45 * DEG2RAD, this.gl.canvas.width / this.gl.canvas.height, 0.1, 1000);
        mat4.lookAt(view, [0,5,5],[0,0,0], [0,1,0]);

        var shader = new Shader(
            'precision highp float;\
            attribute vec3 a_vertex;\
            attribute vec3 a_normal;\
            varying vec3 v_normal;\
            uniform mat4 u_mvp;\
            uniform mat4 u_model;\
            void main() {\
                v_normal = (u_model * vec4(a_normal,0.0)).xyz;\
                gl_Position = u_mvp * vec4(a_vertex,1.0);\
            }',
            'precision highp float;\
            varying vec3 v_normal;\
            uniform vec3 u_lightvector;\
            uniform vec4 u_color;\
            void main() {\
              vec3 N = normalize(v_normal);\
              gl_FragColor = u_color * max(0.0, dot(u_lightvector,N));\
            }'
        );

        this.gl.clearColor(0.4, 0.4, 0.4, 1);
        this.gl.enable(this.gl.DEPTH_TEST);

        var uniforms = {
            u_color: [1, 1, 1, 1],
            u_lightvector: vec3.normalize(vec3.create(),[1, 1, 1]),
            u_model: model,
            u_mvp: mvp
        };

        var scope = this;
        this.gl.ondraw = function() {
            scope.gl.clear(scope.gl.COLOR_BUFFER_BIT | scope.gl.DEPTH_BUFFER_BIT);

            objs.forEach(function(item){
    			mat4.multiply(temp, view, item.model);
    			mat4.multiply(mvp, proj, temp);

    			uniforms.u_model = item.model;
    			shader.uniforms(uniforms).draw(item.mesh, item.primitive);
            });
        };

        this.gl.onupdate = function(dt) {
            objs.forEach(function(item){
                mat4.rotateY(item.model, item.model, dt * 0.2);
            });
        };

        instance.container.append(this.gl.canvas);
    };

    Cobweb.prototype.plugins.add('surface', Surface);
})());
