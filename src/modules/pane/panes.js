((function () {
    'use strict';

    Modules.prototype.add('pane', function (instance) {
        var mainPanes = document.createElement('div');
        mainPanes.className = 'main-panes';

        var container = document.querySelector(instance.options.container.selector);
        container.appendChild(mainPanes);

        instance.events.on('app.loaded', function () {
            instance.pane.internal = new Pane({
                container: 'div.main-panes',
                separator: {
                    size: 3
                },
                callbacks: {
                    onPaneCreate: onPaneCreate,
                    onPaneSplit: onPaneSplit,
                    onPaneResize: onPaneResize,
                    //onPaneMerge: onPaneMerge,
                    //onPaneDestroy: onPaneDestroy,
                }
            });

            var root = instance.pane.internal.container.querySelector('.pane');
            instance.pane.setType(root, 'surface');
        });

        instance.pane = {};

        function onPaneCreate (pane) {
            instance.events.trigger('pane.create', pane);
        }

        function onPaneSplit (origin, newPane) {
            instance.events.trigger('pane.split', origin, newPane);
        }

        function onPaneResize (pane) {
            instance.events.trigger('pane.resize', pane);
        }

        function onPaneMerge (merger, toRemove) {
            console.debug('onPaneMerge', merger, toRemove);
        }

        function onPaneDestroy (pane) {
            console.debug('onPaneDestroy', pane);
        }
    });
})());
