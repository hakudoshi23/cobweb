((function(){
    'use strict';

    var emptyFunction = function () {};

    var Logger = function (instance, isDebug) {
        this.debug = isDebug ? console.debug.bind() : emptyFunction;

        this.info = isDebug ? console.info.bind() : emptyFunction;

        this.warn = console.warn.bind();

        this.error = console.error.bind();
    };

    window.Logger = Logger;
})());
