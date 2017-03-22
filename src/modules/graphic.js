((function () {
    'use strict';

    var Graphics = function (instance) {
        this.gl = GL.create({
            height: screen.height,
            width: screen.width
        });
        this.gl.animate();
        this.gl.ondraw = function () {
            var renderTargets = document.querySelectorAll('canvas');
            for (var i = 0; i < renderTargets.length; i++)
                drawRenderTarget(instance, renderTargets[i]);
        };
        this.gl.clearColor(0.349, 0.349, 0.349, 1);
        this.gl.enable(this.gl.DEPTH_TEST);

        console.info(this.gl.getParameter(this.gl.VERSION));
        console.info(this.gl.getParameter(this.gl.SHADING_LANGUAGE_VERSION));
        console.info(this.gl.getParameter(this.gl.VENDOR));
    };

    Modules.prototype.add('graphics', function (instance) {
        instance.graphics = new Graphics(instance);
    });

    function drawRenderTarget (instance, canvas) {
        var width  = canvas.clientWidth, height = canvas.clientHeight;
        var data = instance.surface.map[canvas.id];
        var gl = instance.graphics.gl;

        var c = instance.graphics.gl.canvas;
        gl.viewport(0, c.height - height, width, height);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        var mainRender = instance.surface.getRender(canvas);
        var surfaceRender = instance.surface.onRender;
        if (mainRender) mainRender(data);
        if (surfaceRender) surfaceRender(canvas, data);

        var error = gl.getError();
        if (error) console.error('WebGL error! CODE: ', error);

        var context = canvas.getContext('2d');
        if (context) context.drawImage(c, 0, 0, width, height, 0, 0, width, height);
    }
})());
