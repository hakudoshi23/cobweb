'use strict';

(function(){
    window.WebMesh = function(options) {
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

        window.addEventListener('resize', function(event) {
            this.gl.canvas.height = this.container.height();
            this.gl.canvas.width = this.container.width();
            this.events.trigger('resize');
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
}());
