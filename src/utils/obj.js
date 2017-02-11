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

    function safeExtend(prototype, property, value) {
        if(!prototype[property]) prototype[property] = value;
    }

    window.extend = _extend;

    function _extend(options, defaults) {
        for (var prop in defaults) {
            if (prop && defaults.hasOwnProperty(prop)) {
                var value = defaults[prop];
                if (typeof value === 'object') {
                    if (options[prop]) {
                        _extend(options[prop], value);
                    } else
                        options[prop] = value;
                } else if (typeof options[prop] === 'undefined')
                    options[prop] = value;
            }
        }
    }
})());
