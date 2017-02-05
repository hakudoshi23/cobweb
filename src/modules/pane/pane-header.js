((function () {
    'use strict';

    Cobweb.prototype.modules.add('pane-header', function (instance) {
        instance.events.on('pane.create', function (pane) {
            onCreateCallback(pane, instance);
        });

        var panes = instance.pane.container.querySelectorAll('.pane');
        for (var i = 0; i < panes.length; i++)
            onCreateCallback(panes[i], instance);
    }, ['pane-types']);

    function onCreateCallback (pane, instance) {
        var header = createHeader();
        pane.append(header);
    }

    function createHeader () {
        var div = document.createElement('div');
        div.className = 'pane-header';
        return div;
    }
})());
