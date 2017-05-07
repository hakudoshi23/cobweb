((function () {
    'use strict';

    Modules.prototype.add('edit-interaction-action-face', function (instance) {
        instance.surface.interactions.edit.actions.face = {
            init: function (context, event) {
                if (!context.selection.isEmpty()) {
                    for (var objKey in context.selection.objects) {
                        var obj = context.selection.objects[objKey];
                        var mesh = instance.scene.getObjects()[0].data.mesh;

                        if (obj.vertices && obj.vertices.length > 0) {
                            mesh.addFace(obj.vertices);
                        }

                        context.selection.clear();
                        mesh.invalidateCache();
                    }
                } else console.warn('Cannot create a face with an empty selection!');
                context.action = null;
            }
        };
    }, ['edit-interaction']);
})());
