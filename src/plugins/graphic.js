((function () {
    'use strict';

    var Graphics = function (instance) {
        this.instance = instance;
        this.gl = GL.create({
            height: 1024,
            width: 1024
        });
        this.gl.animate();
        this.gl.ondraw = function () {
            var renderTargets = document.querySelectorAll('canvas');
            renderTargets.forEach(function (target) {
                drawRenderTarget(instance, target);
            });
        };
    };

    Graphics.prototype.addTarget = function (canvas) {
        var gl = this.gl;

        var renderbuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, 1024, 1024);

        var framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, renderbuffer);

        var framebufferStatus = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if (framebufferStatus !== gl.FRAMEBUFFER_COMPLETE) {
            switch (framebufferStatus) {
                case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
                    console.log('Framebuffer status error: FRAMEBUFFER_INCOMPLETE_ATTACHMENT');
                    break;
                case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
                    console.log('Framebuffer status error: FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT');
                    break;
                case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
                    console.log('Framebuffer status error: FRAMEBUFFER_INCOMPLETE_DIMENSIONS');
                    break;
                case gl.FRAMEBUFFER_UNSUPPORTED:
                    console.log('Framebuffer status error: FRAMEBUFFER_UNSUPPORTED');
                    break;
            }
            console.log();
        } else {
            canvas.data('graphics-framebuffer', framebuffer);
        }
    };

    Cobweb.prototype.plugins.add('graphics', function (instance) {
        instance.graphics = new Graphics(instance);
        instance.scene.cube = {
            primitive: instance.graphics.gl.TRIANGLES,
            model: mat4.create(),
            mesh: GL.Mesh.cube(),
        };
    }, ['scene']);

    function drawRenderTarget (instance, canvas) {
        var framebuffer = canvas.data('graphics-framebuffer');
        var surface = canvas.parent('.pane').data('surface');
        var gl = instance.graphics.gl;

        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

        gl.clearColor(0.4, 0.4, 0.4, 1);
        gl.enable(gl.DEPTH_TEST);

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

        var proj = surface.proj;
        var view = surface.view;
        var temp = mat4.create();
        var mvp = mat4.create();
        var uniforms = {
            u_color: [1, 1, 1, 1],
            u_lightvector: vec3.normalize(vec3.create(), [1, 1, 1]),
            u_model: null,
            u_mvp: mvp
        };

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        for (var name in instance.scene) {
            var obj = instance.scene[name];
            if (obj) {
    			mat4.multiply(temp, view, obj.model);
    			mat4.multiply(mvp, proj, temp);

    			uniforms.u_model = obj.model;
    			shader.uniforms(uniforms).draw(obj.mesh, obj.primitive);
                mat4.rotateY(view, view, 0.01);
            }
        }

        var width = 1024, height = 1024;
        var pixels = new Uint8Array(width * height * 4);
        gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

        var context = canvas.getContext('2d');
        if (context) {
            var imageData = context.createImageData(width, height);
            imageData.data.set(pixels);
            context.putImageData(imageData, 0, 0);
            context.translate(100, 100);
        }
    }
})());
