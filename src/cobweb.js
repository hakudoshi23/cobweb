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
        if (options && typeof options === 'object') {
            extend(this.options, options);
        }

        this.container = document.querySelector(this.options.container.selector);
        this.container.addClass(this.options.container.className);

        this.gl = GL.create({
            height: container.height(),
            width: container.width()
        });

        this.container.append(this.gl.canvas);

        this.events = new EventHandler();
        Cobweb.prototype.enablePlugins(this);

        this.events.on('resize', function(instance) {
            instance.gl.canvas.height = instance.container.height();
            instance.gl.canvas.width = instance.container.width();
        });

        var scope = this;
        window.addEventListener('resize', function(event) {
            scope.events.trigger('resize', scope);
        });
    };

    Cobweb.prototype.plugins = {};

    Cobweb.prototype.enablePlugins = function(instance) {
        for (var name in Cobweb.prototype.plugins)
            instance[name] = new Cobweb.prototype.plugins[name](instance);
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
