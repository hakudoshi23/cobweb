((function(){
    'use strict';

    window.extend = function (defaults, properties) {
        for (var property in properties)
            if (property && properties.hasOwnProperty(property)) {
                var value = properties[property];
                if (typeof value === 'object')
                    extend(defaults[property], properties[property]);
                else
                    defaults[property] = properties[property];
            }
    };

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
