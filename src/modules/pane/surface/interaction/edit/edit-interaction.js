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
                    if (vec2.length(delta2d) > 5) this.setAction('move', event);
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
                            result.vertices.forEach(function (vertex) {
                                node.data.mesh.cache.onVertexChange(vertex);
                                vec2.copy(mouseDownCoords, realCoords);
                            });
                            result.faces.forEach(function (face) {
                                face.getVertices().forEach(function (vertex) {
                                    node.data.mesh.cache.onVertexChange(vertex);
                                });
                                vec2.copy(mouseDownCoords, realCoords);
                            });
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

                if (event.key === 'a') {
                    if (!this.selection.isEmpty()) this.selection.clear();
                    else {
                        var selection = this.selection;
                        instance.scene.getObjects().forEach(function (object) {
                            var result = selection.addAll(object.data);
                            result.forEach(function (vertex) {
                                object.data.mesh.cache.onVertexChange(vertex);
                            });
                        });
                    }
                } else if (event.key === 'g') this.setAction('move', event);
            },
            onKeyUp: function (event, realCoords) {
                this.isShiftDown = event.shiftKey;
                this.isShiftDown = event.ctrlKey;
            },
            setAction: function (name, event) {
                if (name && this.actions[name]) {
                    this.action = name;
                    this.runAction('init', event);
                }
            },
            runAction : function (callbackName, event) {
                if (this.action && this.actions[this.action]) {
                    var callback = this.actions[this.action][callbackName];
                    if (callback) callback(this, event);
                }
            }
        };

        instance.events.on('surface.create', function (surface) {
            instance.surface.setInteraction(surface, 'edit');
        });

    }, ['surface-interaction']);
})());
