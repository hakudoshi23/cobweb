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
    };

    Modules.prototype.add('graphics', function (instance) {
        instance.graphics = new Graphics(instance);
    });

    function drawRenderTarget (instance, canvas) {
        var data = instance.surface.map[canvas.id];
        var gl = instance.graphics.gl;

        var width  = canvas.clientWidth, height = canvas.clientHeight;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, width, height);

        var mainRender = instance.surface.getRender(canvas);
        if (mainRender) mainRender(data);
        instance.surface.onRender(canvas, data);

        var context = canvas.getContext('2d');
        if (context) {
            gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data.buffer);
            data.imgData.data.set(data.buffer);
            context.putImageData(data.imgData, 0, 0);
        }
    }
})());
