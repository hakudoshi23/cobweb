((function () {
    'use strict';

    Cobweb.prototype.modules.add('object-interaction', function (instance) {
        instance.surface.interaction.add('object', {
            onMouseMove: function (event) {
            },
            onMouseDown: function (event) {
                instance.logger.debug('onMouseDown', event);
            },
            onMouseUp: function (event) {
                instance.logger.debug('onMouseUp', event);
            },
            onClick: function (event) {
                instance.logger.debug('onClick', event);
            }
        });

        instance.events.on('surface.create', function (surface) {
            instance.surface.setInteraction(surface, 'object');
        });

    }, ['surface-interaction']);
})());
