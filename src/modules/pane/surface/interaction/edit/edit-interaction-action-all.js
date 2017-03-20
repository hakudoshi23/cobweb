((function () {
    'use strict';

    Modules.prototype.add('edit-interaction-action-all', function (instance) {
        instance.surface.interactions.edit.actions.all = {
            init: function (context, event) {
                if (!context.selection.isEmpty()) context.selection.clear();
                else {
                    var selection = context.selection;
                    instance.scene.getObjects().forEach(function (object) {
                        var result = selection.addAll(object.data);
                        object.data.mesh.cache.onVerticesChange(result);
                    });
                }
                context.action = null;
            }
        };
    }, ['edit-interaction']);
})());
