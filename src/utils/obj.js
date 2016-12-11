((function(){
    'use strict';

    safeExtend(Object, 'keys', (function() {
        var dontEnums = [ 'toString', 'toLocaleString', 'valueOf', 'hasOwnProperty',
            'isPrototypeOf', 'propertyIsEnumerable', 'constructor' ];

        return function(obj) {
            if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null))
                throw new TypeError('Object.keys called on non-object');

            var result = [], prop;
            for (prop in obj)
                if (obj.hasOwnProperty(prop))
                    result.push(prop);
            return result;
        };
    }()));

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

    function safeExtend(prototype, property, value) {
        if(!prototype[property]) prototype[property] = value;
    }
})());
