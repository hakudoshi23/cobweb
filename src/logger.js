((function(){
    'use strict';

    var Logger = function (instance) {
    };

    Logger.prototype.debug = console.debug.bind();

    Logger.prototype.info = console.info.bind();

    Logger.prototype.warn = console.warn.bind();

    Logger.prototype.error = console.error.bind();

    Logger.prototype.log = console.log.bind();

    window.Logger = Logger;
})());
