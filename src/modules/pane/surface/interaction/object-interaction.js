((function () {
    'use strict';

    Cobweb.prototype.modules.add('object-interaction', function (instance) {
        instance.surface.interaction.add('object', {
            onMouseMove: function (event) {
                return true;
            },
            onMouseDown: function (event) {
                instance.logger.debug('onMouseDown', event);
                return true;
            },
            onMouseUp: function (event) {
                instance.logger.debug('onMouseUp', event);
                return true;
            },
            onClick: function (event) {
                instance.logger.debug('onClick', event);
                return true;
            }
        });

        instance.events.on('surface.create', function (surface) {
            instance.surface.setInteraction(surface, 'object');
        });

    }, ['surface-interaction']);
})());
