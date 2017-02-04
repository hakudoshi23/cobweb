((function () {
    'use strict';

    Cobweb.prototype.modules.add('surface-interaction', function (instance) {
        instance.pane.setInteraction = function (pane, name) {
            var interactions = instance.interaction;
            if (interactions.has(name))
                pane.attrData('surface-interaction', name);
        };

        instance.pane.getInteraction = function (pane) {
            var interactions = instance.interaction;
            var name = pane.attrData('surface-interaction');
            return interactions.get(name);
        };

        instance.events.on('pane.split', function (oldPane, newPane) {
            newPane.attrData('surface-interaction', oldPane.attrData('surface-interaction'));
        });
    }, ['interaction-mode']);
})());
