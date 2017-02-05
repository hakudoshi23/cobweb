((function () {
    'use strict';

    Cobweb.prototype.modules.add('surface', function (instance) {
        instance.pane.types.add('surface', {
            onPaneType: onSurfacePaneType,
            onCreateHeader: onCreateSurfaceHeader
        });

        instance.events.on('pane.resize', function (pane) {
            if (pane.attrData('pane-type') === 'surface') {
                updateCanvasSize(pane);
            }
        });

        var root = document.querySelector('.pane');
        instance.pane.setType(root, 'surface');
        instance.pane.setRender(root, 'solid');
    }, ['pane-types', 'surface-render']);

    function onSurfacePaneType (pane, instance) {
        var canvas = document.createElement('canvas');
        pane.append(canvas);

        var data = {
            proj: mat4.create(),
            view: mat4.create()
        };
        mat4.perspective(data.proj, -45 * DEG2RAD,
            canvas.width / canvas.height, 0.1, 1000);
        mat4.lookAt(data.view, [0,2,4], [0,0,0], [0,1,0]);
        mat4.scale(data.view, data.view, [1,1.2,1]);
        pane.data('surface', data);
        updateCanvasSize(pane);
    }

    function onCreateSurfaceHeader (header, instance) {
        var label = document.createElement('label');
        label.innerHTML = 'Surface Pane';
        header.appendChild(label);
    }

    function updateCanvasSize (pane) {
        var canvas = pane.querySelector('canvas');
        var context = canvas.getContext('2d');

        var header = pane.querySelector('.pane-header');
        var headerHeight = header ? header.height() : 0;

        var width = pane.width(), height = pane.height() - headerHeight;
        pane.data('buffer', new Uint8Array(width * height * 4));
        pane.data('imgData', context.createImageData(width, height));

        canvas.height = height;
        canvas.width = width;

        var data = pane.data('surface');
        mat4.perspective(data.proj, -45 * DEG2RAD, width / height, 0.1, 1000);
    }
})());
