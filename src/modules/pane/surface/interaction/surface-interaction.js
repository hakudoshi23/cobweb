((function () {
    'use strict';

    Cobweb.prototype.modules.add('surface-interaction', function (instance) {
        instance.surface.setInteraction = function (surface, name) {
            var interactions = instance.interaction;
            if (interactions.has(name))
                surface.attrData('surface-interaction', name);
        };

        instance.surface.getInteraction = function (surface) {
            var interactions = instance.interaction;
            var name = surface.attrData('surface-interaction');
            return interactions.get(name);
        };

        instance.events.on('pane.split', function (oldPane, newPane) {
            newPane.attrData('surface-interaction', oldPane.attrData('surface-interaction'));
        });
    }, ['interaction-mode', 'surface']);
})());
