'use strict';

(function(){
    var WebMesh = function(options) {
        this.options = {
            container: {
                selector: '#webmesh',
                className: 'wm-container'
            },
            menu: {
                className: 'wm-menu'
            },
            logger: {
                className: 'wm-logger'
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
        WebMesh.prototype.enablePlugins(this);

        this.events.on('resize', function(instance) {
            instance.gl.canvas.height = instance.container.height();
            instance.gl.canvas.width = instance.container.width();
        });

        var scope = this;
        window.addEventListener('resize', function(event) {
            scope.events.trigger('resize', scope);
        });
    };

    WebMesh.prototype.plugins = {};

    WebMesh.prototype.enablePlugins = function(instance) {
        for (var name in WebMesh.prototype.plugins)
            instance[name] = new WebMesh.prototype.plugins[name](instance);
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

    window.WebMesh = WebMesh;
}());
