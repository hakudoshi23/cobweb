((function () {
    'use strict';

    Modules.prototype.add('edit-interaction', function (instance) {
        var mouseDownCoords = vec2.create();

        instance.surface.interactions.edit = {
            actions: {},
            action: null,
            isMouseDown: false,
            isShiftDown: false,
            isControlDown: false,
            lastCoords: [0, 0],
            onMouseMove: function (event, realCoords) {
                vec2.copy(this.lastCoords, realCoords);
                if (this.isMouseDown && !this.action) {
                    var delta2d = vec2.sub(vec2.create(), mouseDownCoords, realCoords);
                    if (vec2.length(delta2d) > 10) this.setAction('move', event);
                }
                this.runAction('onMouseMove', event, realCoords);
            },
            onMouseUp: function (event, realCoords) {
                if (event.which === 1) this.isMouseDown = false;
                this.runAction('onMouseUp', event, realCoords);
            },
            onMouseDown: function (event, realCoords) {
                if (!this.action) {
                    var canvas = event.target;
                    var data = instance.surface.map[canvas.id];

                    if (event.which === 1) {
                        this.isMouseDown = true;

                        var ray = data.camera.getRay(null, realCoords,
                            [canvas.width, canvas.height]);

                        var selection = this.selection;
                        var shiftDown = this.isShiftDown;
                        instance.scene.getObjects().forEach(function (node) {
                            if (!shiftDown) selection.clear();
                            var result = selection.add(ray, node.data, data.camera);
                            if (result.vertex)
                                node.data.mesh.cache.onVerticesChange([result.vertex]);
                            if (result.face)
                                node.data.mesh.cache.onVerticesChange(result.face.getVertices());
                        });
                        return false;
                    }
                }
                this.runAction('onMouseDown', event, realCoords);
                return true;
            },
            onKeyDown: function (event, realCoords) {
                this.isShiftDown = event.shiftKey;
                this.isShiftDown = event.ctrlKey;
                if (!this.action) {
                    if (event.key === 'a') this.setAction('all', event);
                    else if (event.key === 'g') this.setAction('move', event);
                    else if (event.key === 's') this.setAction('scale', event);
                    else if (event.key === 'b') {
                        if (this.drawBounds === null) this.drawBounds = false;
                        else if (this.drawBounds === false) this.drawBounds = true;
                        else if (this.drawBounds === true) this.drawBounds = null;
                    }
                } else {
                    if (event.keyCode === 13) this.action = null;
                    else this.runAction('onKeyDown', event, realCoords);
                }
            },
            onKeyUp: function (event, realCoords) {
                this.isShiftDown = event.shiftKey;
                this.isShiftDown = event.ctrlKey;
                this.runAction('onKeyUp', event, realCoords);
            },
            setAction: function (name, event) {
                if (name && this.actions[name]) {
                    this.action = name;
                    this.runAction('init', event);
                }
            },
            runAction : function (callbackName, event) {
                if (this.action && this.actions[this.action]) {
                    var action = this.actions[this.action];
                    var callback = action[callbackName];
                    if (callback) callback.call(action, this, event);
                }
            }
        };

        instance.events.on('surface.create', function (surface) {
            instance.surface.setInteraction(surface, 'edit');
        });

    }, ['surface-interaction']);
})());
