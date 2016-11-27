'use strict';

((function(){
    safeOverride(Array.prototype, 'unique', function() {
        var a = this.concat();
        for(var i = 0; i < a.length; ++i) {
            for(var j = i + 1; j < a.length; ++j) {
                if(a[i] === a[j]) a.splice(j--, 1);
            }
        }
        return a;
    });

    safeOverride(HTMLElement.prototype, 'addClass', function() {
        for(var i in arguments){
            var oldClassNames = !this.className ? [] : this.className.trim().replace(/\s+/g, ' ').split(' ');
            var newClassNames = !arguments[i] ? [] : arguments[i].trim().replace(/\s+/g, ' ').split(' ');
            this.className = oldClassNames.concat(newClassNames).unique().join(' ');
        }
    });

    safeOverride(HTMLElement.prototype, 'height', function() {
        return this.getBoundingClientRect().height;
    });

    safeOverride(HTMLElement.prototype, 'width', function() {
        return this.getBoundingClientRect().width;
    });

    safeOverride(Object, 'keys', (function() {
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
            dontEnums = [
              'toString',
              'toLocaleString',
              'valueOf',
              'hasOwnProperty',
              'isPrototypeOf',
              'propertyIsEnumerable',
              'constructor'
            ],
            dontEnumsLength = dontEnums.length;

        return function(obj) {
            if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                throw new TypeError('Object.keys called on non-object');
            }

            var result = [], prop, i;

            for (prop in obj) {
                if (hasOwnProperty.call(obj, prop)) {
                    result.push(prop);
                }
            }

            if (hasDontEnumBug) {
                for (i = 0; i < dontEnumsLength; i++) {
                    if (hasOwnProperty.call(obj, dontEnums[i])) {
                        result.push(dontEnums[i]);
                    }
                }
            }
            return result;
        };
  }()));

    function safeOverride(prototype, property, value) {
        if(!prototype[property]) prototype[property] = value;
    }
})());
