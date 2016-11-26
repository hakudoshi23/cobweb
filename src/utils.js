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

    function safeOverride(prototype, property, value) {
        if(!prototype[property]) prototype[property] = value;
    }
})());
