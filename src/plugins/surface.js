((function () {
    'use strict';

    Cobweb.prototype.plugins.add('surface', function (instance) {
        instance.pane.types.add('surface', function (pane, instance) {
            var canvas = document.createElement('canvas');
            canvas.style.height = '100%';
            canvas.style.width = '100%';
            canvas.height = 1024;
            canvas.width = 1024;

            var surfaceData = {
                proj: mat4.create(),
                view: mat4.create()
            };
            mat4.perspective(surfaceData.proj, -45 * DEG2RAD, canvas.width / canvas.height, 0.1, 1000);
            mat4.lookAt(surfaceData.view, [0,1,5],[0,0,0], [0,1,0]);
            pane.data('surface', surfaceData);

            pane.append(canvas);

            instance.graphics.addTarget(canvas);
        });

        var root = document.querySelector('.pane');
        instance.pane.types.setType(root, 'surface');
    }, ['pane-types', 'graphics']);
})());
