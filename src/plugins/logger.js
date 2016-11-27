'use strict';

((function(){
    var Logger = function(instance) {
        var container = document.createElement('DIV');
        container.addClass(instance.options.logger.className);
        instance.container.append(container);

        var info = document.createElement('DIV');
        info.innerHTML = 'Lorem ipsum...';
        info.addClass('info');
        container.append(info);

        this.info = function(text) {
            info.innerHTML = text;
        }

        instance.events.on('logger.info', this.info);
    };

    Cobweb.prototype.plugins['logger'] = Logger;
})());
