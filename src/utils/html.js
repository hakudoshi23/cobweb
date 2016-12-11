((function(){
    'use strict';

    safeExtend(HTMLElement.prototype, 'addClass', function () {
        var oldClassNames, newClassNames;
        for(var i in arguments){
            oldClassNames = !this.className ? [] : this.className.trim().replace(/\s+/g, ' ').split(' ');
            newClassNames = !arguments[i] ? [] : arguments[i].trim().replace(/\s+/g, ' ').split(' ');
            this.className = oldClassNames.concat(newClassNames).unique().join(' ');
        }
    });

    safeExtend(HTMLElement.prototype, 'hasClass', function () {
        var queryClassNames, currentClassNames = !this.className ? [] : this.className.trim().replace(/\s+/g, ' ').split(' ');
        for(var i in arguments){
            queryClassNames = !arguments[i] ? [] : arguments[i].trim().replace(/\s+/g, ' ').split(' ');
            for (var index = 0; index < queryClassNames.length; index++) {
                var name = queryClassNames[index];
                if (currentClassNames.indexOf(name) == -1)
                    return false;
            }
        }
        return true;
    });

    safeExtend(HTMLElement.prototype, 'removeClass', function () {
        var index = 0, currentClassNames, removeClassNames;
        var removeEach = function (name) {
            index = currentClassNames.indexOf(name);
            if (index != -1)
                currentClassNames.splice(index, 1);
        };
        for(var i in arguments){
            currentClassNames = !this.className ? [] : this.className.trim().replace(/\s+/g, ' ').split(' ');
            removeClassNames = !arguments[i] ? [] : arguments[i].trim().replace(/\s+/g, ' ').split(' ');
            removeClassNames.forEach(removeEach);
            this.className = currentClassNames.unique().join(' ');
        }
    });

    safeExtend(HTMLElement.prototype, 'data', function (attr, value) {
        if (!window.__data_cache) window.__data_cache = new WeakMap();
        var elAttrs = window.__data_cache.get(this) || {};
        if (value) {
            elAttrs[attr] = value;
            window.__data_cache.set(this, elAttrs);
        } else {
            if (attr) return elAttrs && elAttrs[attr];
            else return elAttrs;
        }
        return this;
    });

    safeExtend(HTMLElement.prototype, 'setData', function (data) {
        if (!window.__data_cache) window.__data_cache = new WeakMap();
        window.__data_cache.set(this, data);
        return this;
    });

    safeExtend(HTMLElement.prototype, 'attr', function (name, value) {
        if (value !== undefined)
            this.setAttribute(name, value);
        else if (value === null)
            this.removeAttribute(name);
        else
            return this.getAttribute(name);
        return this;
    });

    safeExtend(HTMLElement.prototype, 'attrData', function (name, value) {
        return this.attr('data-' + name, value);
    });

    safeExtend(Element.prototype, 'matches',
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function(s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;
        }
    );

    safeExtend(HTMLElement.prototype, 'parent', function (query) {
        if (!query) return this.parentElement;
        var current = this.parentElement;
        while (!current.matches(query))
            current = current.parentElement;
        return current;
    });

    safeExtend(HTMLElement.prototype, 'height', function () {
        if (arguments.length == 1) {
            var value = arguments[0];
            if (typeof value === 'number')
                this.style.height = value + 'px';
            else
                this.style.height = value;
        } else
            return this.getBoundingClientRect().height;
    });

    safeExtend(HTMLElement.prototype, 'width', function () {
        if (arguments.length == 1) {
            var value = arguments[0];
            if (typeof value === 'number')
                this.style.width = value + 'px';
            else
                this.style.width = value;
        } else
            return this.getBoundingClientRect().width;
    });

    function safeExtend(prototype, property, value) {
        if(!prototype[property]) prototype[property] = value;
    }
})());
