(function(){
    'use strict';

    var defaultOptions = {
        container: {
            selector: '#cobweb',
            className: 'cb-container'
        }
    };

    var Cobweb = function (options) {
        this.options = defaultOptions;
        extend(this.options, options || {});

        this.container = document.querySelector(this.options.container.selector);
        if (!this.container)
            throw new Error('Invalid container selector: \'' +
                this.options.container.selector + '\'');
        this.container.addClass(this.options.container.className);
        this.container.data('instance', this);

        this.logger = new Logger(this, true);
        this.events = new EventHandler(this);
        Cobweb.prototype.modules.load(this);
        this.events.trigger('app.loaded');
    };

    window.Cobweb = Cobweb;
}());
