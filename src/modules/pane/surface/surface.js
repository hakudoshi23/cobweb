((function () {
    'use strict';

    var surfaceIndex = 0;

    Modules.prototype.add('surface', function (instance) {
        instance.pane.types.surface = {
            onPaneType: onSurfacePaneType,
            onCreateHeader: onCreateSurfaceHeader
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

    function onSurfacePaneType (pane, instance) {
        var canvas = document.createElement('canvas');
        canvas.id = 'surface' + (surfaceIndex++);
        canvas.className = 'surface';
        pane.appendChild(canvas);

        instance.surface.map = instance.surface.map || {};
        instance.surface.map[canvas.id] = {};
        instance.surface.map[canvas.id].surface = {
            proj: mat4.create(),
            center: [0, 0, 0],
            rotation: [-0.5, -0.5],
            distance: 12,
            getViewMatrix: function (view) {
                view = view || mat4.create();
                var eye = [0, 0, 0];
                this.getCameraPosition(eye);
                mat4.lookAt(view, eye, this.center, this.getUpDirection());
                return view;
            },
            getCameraPosition: function (eye) {
                eye = eye || vec3.create();
                vec3.set(eye, 0, 0, -this.distance);
                vec3.rotateX(eye, eye, this.rotation[1]);
                vec3.rotateY(eye, eye, -this.rotation[0]);
                return eye;
            },
            getCameraDirection: function (direction) {
                direction = direction || vec3.create();
                var eye = this.getCameraPosition();
                vec3.sub(direction, this.center, eye);
                vec3.normalize(direction, direction);
                return direction;
            },
            getRayFromCamera: function (ray, canvasCoords, canvasSize) {
                ray = ray || new Math.Ray();
                this.getCameraPosition(ray.start);
                vec3.set(ray.direction, canvasCoords[0] / (canvasSize[0] * 0.5) - 1.0,
                    canvasCoords[1] / (canvasSize[1] * 0.5) - 1.0, 1);
                var auxMat = mat4.create();
                mat4.multiply(auxMat, this.proj, this.getViewMatrix());
                mat4.invert(auxMat, auxMat);
                vec3.transformMat4(ray.direction, ray.direction, auxMat);
                vec3.normalize(ray.direction, ray.direction);
                return ray;
            },
            getUpDirection: function (up) {
                up = up || vec3.create();
                var vRotation = this.rotation[1];
                if (vRotation >= Math.PI / 2 &&
                    vRotation <= ((Math.PI * 3) / 2))
                    vec3.set(up, 0, -1, 0);
                else vec3.set(up, 0, 1, 0);
                return up;
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
        var data = instance.surface.map[canvas.id];

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
