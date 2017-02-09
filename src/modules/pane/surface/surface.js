((function () {
    'use strict';

    var surfaceIndex = 0;

    Cobweb.prototype.modules.add('surface', function (instance) {
        instance.pane.types.add('surface', {
            onPaneType: onSurfacePaneType,
            onCreateHeader: onCreateSurfaceHeader
        });

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

        instance.events.on('pane.create', function (pane) {
            instance.pane.setType(pane, 'surface');
        });

        instance.surface = {};
    }, ['pane-types']);

    function onSurfacePaneType (pane, instance) {
        var canvas = document.createElement('canvas');
        canvas.id = 'surface' + (surfaceIndex++);
        canvas.className = 'surface';
        pane.append(canvas);

        instance.surface.data = instance.surface.data || {};
        instance.surface.data[canvas.id] = {};
        instance.surface.data[canvas.id].surface = {
            proj: mat4.create(),
            center: [0, 0, 0],
            rotation: [0, -0.4],
            distance: 5,
            getView: function (view) {
                var up = [0, 1, 0];
                var eye = [0, 0, -this.distance];
                vec3.rotateX(eye, eye, this.rotation[1]);
                vec3.rotateY(eye, eye, -this.rotation[0]);
                vec3.add(eye, eye, this.center);
                mat4.lookAt(view, eye, this.center, up);
            }
        };

        updateCanvasSize(instance, pane);

        instance.events.trigger('surface.create', canvas);
    }

    function onCreateSurfaceHeader (header, instance) {
        var label = document.createElement('label');
        label.innerHTML = 'Surface Pane';
        header.appendChild(label);
    }

    function updateCanvasSize (instance, pane) {
        var canvas = pane.querySelector('canvas');
        var context = canvas.getContext('2d');
        var data = instance.surface.data[canvas.id];

        var header = pane.querySelector('.pane-header');
        var headerHeight = header ? header.height() : 0;

        var width = pane.width(), height = pane.height() - headerHeight;
        data.imgData = context.createImageData(width, height);
        data.buffer = new Uint8Array(width * height * 4);

        canvas.height = height;
        canvas.width = width;

        mat4.perspective(data.surface.proj, 45 * DEG2RAD, width / height, 0.1, 1000);
    }
})());
