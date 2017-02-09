((function () {
    'use strict';

    Cobweb.prototype.modules.add('common-interaction', function (instance) {
        instance.surface.interaction.add('common', {
            onMouseMove: function (event) {
                return true;
            },
            onMouseDown: function (event) {
                event.target.dataset.moving = 'true';
                return true;
            },
            onMouseUp: function (event) {
                delete event.target.dataset.moving;
                return true;
            },
            onClick: function (event) {
                instance.logger.debug('COMMON - onClick', event);
                return true;
            }
        });
    }, ['surface-interaction']);
})());
