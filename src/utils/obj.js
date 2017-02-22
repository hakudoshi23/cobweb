((function(){
    'use strict';

    safeExtend(Object, 'clone', function (obj) {
        var newObj = {};
        for (var property in obj)
            if (obj.hasOwnProperty(property)) {
                var value = obj[property];
                if (typeof value === 'object')
                    newObj[property] = Object.clone(obj[property]);
                else
                    newObj[property] = obj[property];
            }
        return newObj;
    });

    safeExtend(Object, 'assign', function(target, varArgs) {
        if (target === null)
            throw new TypeError('Cannot convert undefined or null to object');
        var to = Object(target);
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];
            if (nextSource !== null) {
                for (var nextKey in nextSource) {
                    if (hasOwnProperty.call(nextSource, nextKey)) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
        }
        return to;
    });

    safeExtend(Object, 'extend', function(options, defaults) {
        return Object.assign({}, defaults, options);
    });

    function safeExtend(prototype, property, value) {
        if(!prototype[property]) prototype[property] = value;
    }
})());
