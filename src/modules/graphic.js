((function () {
    'use strict';

    var Graphics = function (instance) {
        this.instance = instance;
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
        this.gl.clearColor(0.4, 0.4, 0.4, 1);
        this.gl.enable(this.gl.DEPTH_TEST);
    };

    Cobweb.prototype.modules.add('graphics', function (instance) {
        instance.graphics = new Graphics(instance);
    });

    function drawRenderTarget (instance, canvas) {
        var data = instance.surface.data[canvas.id];
        var gl = instance.graphics.gl;

        var width  = canvas.clientWidth, height = canvas.clientHeight;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, width, height);

        var render = instance.surface.getRender(canvas);
        if (render) render(data.surface);

        var context = canvas.getContext('2d');
        if (context) {
            gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data.buffer);
            data.imgData.data.set(data.buffer);
            context.putImageData(data.imgData, 0, 0);
        }
    }
})());
