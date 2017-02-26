(function(){
    'use strict';

    var defaultOptions = {
        container: {
            selector: '#cobweb'
        }
    };

    var Cobweb = function (options) {
        this.options = Object.assign({}, defaultOptions, options);
        var instance = this;

        this.container = document.querySelector(this.options.container.selector);
        if (!this.container)
            throw new Error('Invalid container selector: \'' +
                this.options.container.selector + '\'');
        this.container.addClass('cb-container');
        this.container.data('instance', this);

        this.logger = new Logger(this, true);
        this.events = new EventHandler(true);
        this.modules = new Modules([this], {
            onLoadedAll: function (names) {
                instance.events.trigger('modules.loaded.all', names);
                instance.events.trigger('app.loaded');
            }
        });
    };

    window.Cobweb = Cobweb;
}());
