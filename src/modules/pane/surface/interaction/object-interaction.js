((function () {
    'use strict';

    Cobweb.prototype.modules.add('object-interaction', function (instance) {
        instance.surface.interaction.add('object', {
            onMouseDown: function (event) {
                instance.logger.debug('onMouseDown', event);
            },
            onMouseUp: function (event) {
                instance.logger.debug('onMouseUp', event);
            },
            onMouseMove: function (event) {
                instance.logger.debug('onMouseMove', event);
            }
        });

    }, ['surface-interaction']);
})());
