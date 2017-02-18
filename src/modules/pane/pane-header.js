((function () {
    'use strict';

    Modules.prototype.add('pane-header', function (instance) {
        instance.events.on('pane.create', function (pane) {
            onCreateCallback(pane, instance);
        });
    }, ['pane-types']);

    function onCreateCallback (pane, instance) {
        var header = createHeader();
        pane.appendChild(header);
    }

    function createHeader () {
        var div = document.createElement('div');
        div.className = 'pane-header';
        return div;
    }
})());
