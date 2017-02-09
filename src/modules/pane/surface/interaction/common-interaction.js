((function () {
    'use strict';

    Cobweb.prototype.modules.add('common-interaction', function (instance) {
        instance.surface.interaction.add('common', {
            onMouseMove: function (event) {
                return true;
            },
            onMouseDown: function (event) {
                instance.logger.debug('COMMON - onMouseDown', event);
                return true;
            },
            onMouseUp: function (event) {
                instance.logger.debug('COMMON - onMouseUp', event);
                return true;
            },
            onClick: function (event) {
                instance.logger.debug('COMMON - onClick', event);
                return true;
            }
        });
    }, ['surface-interaction']);
})());
