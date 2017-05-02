((function () {
    'use strict';

    Modules.prototype.add('surface', function (instance) {
        instance.pane.types.surface = {
            onPaneType: onSurfacePaneType
        };

        instance.events.on('pane.resize', function (pane) {
            if (pane.attrData('pane-type') === 'surface')
                updateCanvasSize(instance, pane);
        });

        window.addEventListener('resize', function (event) {
            var surfaces = instance.pane.internal.container
                .querySelectorAll('.pane canvas');
            for (var i = 0; i < surfaces.length; i++) {
                updateCanvasSize(instance, surfaces[i].parentNode);
            }
        });

        instance.surface = {};
    }, ['pane-types']);

    var surfaceIndex = 0;
    function onSurfacePaneType (pane, instance) {
        var canvas = document.createElement('canvas');
        canvas.id = 'surface' + (surfaceIndex++);
        canvas.addEventListener('mouseover', function (event) {
            event.target.focus();
        });
        canvas.className = 'surface';
        pane.appendChild(canvas);

        instance.surface.map = instance.surface.map || {};
        instance.surface.map[canvas.id] = {
            camera: new Math.Camera()
        };

        updateCanvasSize(instance, pane);

        instance.events.trigger('surface.create', canvas);
    }

    function updateCanvasSize (instance, pane) {
        var canvas = pane.querySelector('canvas');
        var context = canvas.getContext('2d');
        var data = instance.surface.map[canvas.id];

        var header = pane.querySelector('.pane-header');
        var headerHeight = header ? header.height() : 0;

        var gui = pane.querySelector('.surface-toolbar');
        var guiWidth = gui ? gui.width() : 0;

        var width = pane.width() - guiWidth;
        var height = pane.height() - headerHeight;
        canvas.height = height;
        canvas.width = width;

        context.setTransform(1, 0, 0, 1, 0, 0);
        context.translate(0, height);
        context.scale(1, -1);

        data.camera.width = width;
        data.camera.height = height;
        mat4.perspective(data.camera.projection, 45 * DEG2RAD, width / height, 0.1, 1000);
        mat4.ortho(data.camera.ortho, 0, width, 0, height, -1, 1);
    }
})());
