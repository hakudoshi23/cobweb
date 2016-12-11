((function(){
    'use strict';

    safeExtend(Array.prototype, 'unique', function() {
        var a = this.concat();
        for(var i = 0; i < a.length; ++i)
            for(var j = i + 1; j < a.length; ++j)
                if(a[i] === a[j]) a.splice(j--, 1);
        return a;
    });

    safeExtend(Array.prototype, 'forEach', function(callback) {
        for (var i = 0; i < this.length; i++)
            callback(this[i], i, this);
    });

    function safeExtend(prototype, property, value) {
        if(!prototype[property]) prototype[property] = value;
    }
})());
