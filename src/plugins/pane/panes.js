((function () {
    'use strict';

    var defaultOptions = {
        minSize: 50,
        separator: {
            size: 5
        }
    };

    var Pane = function (instance) {
        this.instance = instance;
        this.options = defaultOptions;
        instance.extendOptions(this.options, instance.options.pane || {});

        var root = createPane();
        root.data('perc-height', 100);
        root.data('perc-width', 100);
        root.style.height = '100%';
        root.style.width = '100%';
        instance.container.append(root);

        this.separator = null;
        this.anchor = null;
        this.current = null;

        document.addEventListener('mousemove', onDocumentMouseMove);
        document.addEventListener('mouseup', onDocumentMouseUp);

        instance.events.on('pane.select', function (pane) {
            instance.pane.current = pane;
        });

        window.addEventListener('resize', function (event) {
            var queryString = ':scope > .pane, :scope > .pane-group';
            var root = instance.container.querySelector(queryString);
            triggerResize(instance, root);
        });
    };

    Pane.prototype.splitPane = function (pane, axis) {
        var styleAttr = axis === 'h' ? 'width' : 'height';
        var _styleAttr = axis === 'h' ? 'height' : 'width';
        if (pane[styleAttr]() > this.options.minSize) {
            var group = wrapByGroup(pane, 'pane-group-' + axis);
            var newPane = createPane();

            if (pane.nextSibling)
                pane.nextSibling.data('pane1', newPane);

            //newPane.setData(Object.clone(group.data()));
            var originalDimension = pane.data('perc-' + styleAttr);
            newPane.data('perc-' + styleAttr, originalDimension / 2);
            pane.data('perc-' + styleAttr, originalDimension / 2);
            newPane.data('perc-' + _styleAttr, 100);
            pane.data('perc-' + _styleAttr, 100);
            group.insertBefore(newPane, pane.nextSibling);
            createSeparator(pane, newPane, this.options.separator.size);

            updateDimensions(group, styleAttr);

            this.instance.events.trigger('pane.split', pane, newPane);
            triggerResize(this.instance, newPane);
            triggerResize(this.instance, pane);
        }
    };

    Pane.prototype.mergePane = function (pane, axis) {
        var removedSize = 0;
        var group = pane.parent('.pane-group');
        if ((axis === 'h' && group.hasClass('pane-group-h')) ||
            (axis === 'v' && group.hasClass('pane-group-v'))) {
            var sibling = axis === 'h' ? 'nextSibling' : 'previousSibling';
            var styleAttr = axis === 'h' ? 'width' : 'height';
            if (pane[sibling]) {
                var toRemove = pane[sibling][sibling];
                removedSize = toRemove.data('perc-' + styleAttr);

                this.instance.events.trigger('pane.merge', pane, toRemove);

                group.removeChild(pane[sibling]);
                group.removeChild(pane[sibling]);
                if (pane.previousSibling) pane.previousSibling.data('pane2', pane);
                if (pane.nextSibling) pane.nextSibling.data('pane1', pane);

                var siblings = group.children.length;
                var newPerc = pane.data('perc-' + styleAttr) + removedSize;
                pane.data('perc-' + styleAttr, siblings === 1 ? 100 : newPerc);

                var subPanes = group.querySelectorAll(':scope > .pane, :scope > .pane-group');
                if (subPanes.length === 1) unwrapFromGroup(pane);
                else updateDimensions(group, styleAttr);
                triggerResize(this.instance, pane);
            }
        }
    };

    Cobweb.prototype.plugins.add('pane', function (instance) {
        instance.pane = new Pane(instance);
    });

    function createPane () {
        var element = document.createElement('DIV');
        element.addClass('pane');
        element.addEventListener('mouseover', onPaneMouseOver);

        var anchor = document.createElement('DIV');
        anchor.addClass('pane-anchor');
        anchor.addEventListener('mousedown', onAnchorMouseDown);
        element.append(anchor);
        return element;
    }

    function createSeparator (pane1, pane2, size) {
        var element = document.createElement('DIV');
        var group = pane1.parent('.pane-group');
        element[group.data('styleProperty')](size);
        element.addEventListener('mousedown', onSeparatorMouseDown);
        element.addClass('pane-separator');
        element.data('pane1', pane1);
        element.data('pane2', pane2);
        var arrow = group.data('styleProperty') === 'width' ? 'ew' : 'ns';
        element.style.cursor = arrow + '-resize';
        group.insertBefore(element, pane2);
        return element;
    }

    function wrapByGroup (pane, className) {
        var parent = pane.parent();
        if (!parent.hasClass(className)) {
            var group = document.createElement('DIV');
            if (pane.nextSibling)
                pane.nextSibling.data('pane1', group);
            if (pane.previousSibling)
                pane.previousSibling.data('pane2', group);
            group.addClass('pane-group', className);

            var styleProp = className === 'pane-group-h' ? 'width' : 'height';
            group.style.cssText = pane.style.cssText;
            group.data('perc-height', pane.data('perc-height'));
            group.data('perc-width', pane.data('perc-width'));
            group.data('styleProperty', styleProp);
            pane.attr('style', null);

            parent.insertBefore(group, pane);
            parent.removeChild(pane);
            group.append(pane);
            return group;
        } else return parent;
    }

    function unwrapFromGroup (pane) {
        var group = pane.parent();
        var parent = group.parent();

        pane.data('perc-height', group.data('perc-height'));
        pane.data('perc-width', group.data('perc-width'));
        pane.style.cssText = group.style.cssText;

        group.removeChild(pane);
        parent.insertBefore(pane, group);
        parent.removeChild(group);

        if (pane.previousSibling) pane.previousSibling.data('pane2', pane);
        if (pane.nextSibling) pane.nextSibling.data('pane1', pane);
    }

    function updateDimensions (group, styleAttr) {
        var totalPercs = 0, perc, prevSize;
        var seps = group.querySelectorAll(':scope > .pane-separator');
        var panes = group.querySelectorAll(':scope > .pane, :scope > .pane-group');
        var subSize = 0;
        if (seps.length !== 0)
            subSize = seps[0][styleAttr]() * seps.length / panes.length;
        for (var i = 0; i < panes.length; i++) {
            perc = panes[i].data('perc-' + styleAttr);
            totalPercs += perc;
            prevSize = perc + '%';
            panes[i].style[styleAttr] = 'calc(' + prevSize + ' - ' + subSize + 'px)';
        }
        if (totalPercs < 100) {
            perc = panes[panes.length - 1].data('perc-' + styleAttr);
            prevSize = (perc + (100 - totalPercs)) + '%';
            panes[panes.length - 1].style[styleAttr] = 'calc(' + prevSize + ' - ' + subSize + 'px)';
        }
    }

    function onPaneMouseOver (event) {
        var pane = event.target.hasClass('pane') ? event.target : event.target.parent('.pane');
        var container = pane.parent('.cb-container');
        var instance = container.data('instance');
        if (!instance.pane.anchor)
            instance.pane.current = pane;
    }

    function onAnchorMouseDown (event) {
        var container = event.target.parent('.cb-container');
        var instance = container.data('instance');
        instance.pane.anchor = event.target;
    }

    function onSeparatorMouseDown (event) {
        var container = event.target.parent('.cb-container');
        var instance = container.data('instance');
        instance.pane.separator = event.target;
        instance.pane.separator.data('startX', event.pageX);
        instance.pane.separator.data('startY', event.pageY);
    }

    var anchorTreshhold = 30;
    function onDocumentMouseMove (event) {
        var container = document.querySelector('.cb-container');
        var instance = container.data('instance');

        if (instance.pane.anchor) {
            var b = instance.pane.anchor.getBoundingClientRect();
            var position = [b.left + (b.width / 2), b.top + (b.height / 2)];

            if ((position[0] - event.pageX) > anchorTreshhold) {
                instance.pane.anchor.style.backgroundColor = '#000000';
            } else if ((position[0] - event.pageX) < -anchorTreshhold) {
                instance.pane.anchor.style.backgroundColor = '#FF0000';
            } else if ((position[1] - event.pageY) > anchorTreshhold) {
                instance.pane.anchor.style.backgroundColor = '#00FF00';
            } else if ((position[1] - event.pageY) < -anchorTreshhold) {
                instance.pane.anchor.style.backgroundColor = '#0000FF';
            } else {
                instance.pane.anchor.style.backgroundColor = '';
            }
        }

        if (instance.pane.separator) {
            var sep = instance.pane.separator;
            var group = sep.parent();
            var styleAttr = group.data('styleProperty');
            var panes = group.querySelectorAll(':scope > .pane, :scope > .pane-group');
            var seps = group.querySelectorAll(':scope > .pane-separator');

            var pane1 = sep.data('pane1');
            var pane2 = sep.data('pane2');

            var delta = 0;
            var subSize = (seps[0][styleAttr]() * seps.length / panes.length) + 'px';
            if (styleAttr === 'height') delta = event.pageY - sep.data('startY');
            else delta = event.pageX - sep.data('startX');
            if ((delta > 0 && pane2[styleAttr]() > 100) || (delta < 0 && pane1[styleAttr]() > 100)) {
                var deltaPerc = delta * 100 / group[styleAttr]();
                var newPane1Perc = pane1.data('perc-' + styleAttr) + deltaPerc;
                var newPane2Perc = pane2.data('perc-' + styleAttr) - deltaPerc;
                pane1.style[styleAttr] = 'calc(' + newPane1Perc + '% - ' + subSize + ')';
                pane2.style[styleAttr] = 'calc(' + newPane2Perc + '% - ' + subSize + ')';
                pane1.data('perc-' + styleAttr, newPane1Perc);
                pane2.data('perc-' + styleAttr, newPane2Perc);

                sep.data('startX', event.pageX);
                sep.data('startY', event.pageY);

                triggerResize(instance, pane1);
                triggerResize(instance, pane2);
            }
        }
    }

    function onDocumentMouseUp (event) {
        var container = document.querySelector('.cb-container');
        var instance = container.data('instance');

        if (instance.pane.anchor) {
            instance.pane.anchor.style.backgroundColor = '';

            var b = instance.pane.anchor.getBoundingClientRect();
            var position = [b.left + (b.width / 2), b.top + (b.height / 2)];

            if ((position[0] - event.pageX) > anchorTreshhold) {
                instance.pane.splitPane(instance.pane.current, 'h');
            } else if ((position[0] - event.pageX) < -anchorTreshhold) {
                instance.pane.mergePane(instance.pane.current, 'h');
            } else if ((position[1] - event.pageY) > anchorTreshhold) {
                instance.pane.mergePane(instance.pane.current, 'v');
            } else if ((position[1] - event.pageY) < -anchorTreshhold) {
                instance.pane.splitPane(instance.pane.current, 'v');
            } else {
                instance.pane.anchor.style.backgroundColor = '';
            }

            instance.pane.anchor = null;
        }

        if (instance.pane.separator) {
            instance.pane.separator = null;
        }
    }

    function triggerResize (instance, pane) {
        if (pane.hasClass('pane-group')) {
            var panes = pane.querySelectorAll('.pane');
            panes.forEach(function (pane) {
                instance.events.trigger('pane.resize', pane);
            });
        } else {
            instance.events.trigger('pane.resize', pane);
        }
    }
})());
