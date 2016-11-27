'use strict';

(function(){
    var Cobweb = function(options) {
        this.options = {
            container: {
                selector: '#cobweb',
                className: 'cb-container'
            },
            menu: {
                className: 'cb-menu'
            },
            logger: {
                className: 'cb-logger'
            }
        };
        if (options && typeof options === 'object')
            extend(this.options, options);

        this.container = document.querySelector(this.options.container.selector);
        this.container.addClass(this.options.container.className);

        this.events = new EventHandler();
        this.events.on('core.resize', function(instance) {
            instance.plugins.surface.gl.canvas.height = instance.container.height();
            instance.plugins.surface.gl.canvas.width = instance.container.width();
        });
        Cobweb.prototype.plugins.load(this);

        var scope = this;
        window.addEventListener('resize', function(event) {
            scope.events.trigger('core.resize', scope);
        });
    };

    function extend(source, properties){
        for (var property in properties) {
            if (properties.hasOwnProperty(property)) {
                var value = properties[property];
                if (typeof value === 'object') {
                    extend(source[property], properties[property]);
                } else {
                    source[property] = properties[property];
                }
            }
        }
    }

    window.Cobweb = Cobweb;
}());
