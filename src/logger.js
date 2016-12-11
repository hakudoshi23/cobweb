/* jshint loopfunc:true */

((function(){
    'use strict';

    var Logger = function (instance) {
        this.handlers = [];

        this.addHandler(this.level.ALL, function (level, message) {
            if (Logger.prototype.level.DEBUG === level) {
                console.debug(message);
            } else if (Logger.prototype.level.INFO === level) {
                console.info(message);
            } else if (Logger.prototype.level.WARNING === level) {
                console.warn(message);
            } else if (Logger.prototype.level.ERROR === level) {
                console.error(message);
            }
        });
    };

    Logger.prototype.level = {
        ALL: 0,
        DEBUG: 1,
        INFO: 2,
        WARNING: 3,
        ERROR: 4,
        NONE: 5,
    };

    Logger.prototype.debug = function (message) {
        this.log(Logger.prototype.level.DEBUG, message);
    };

    Logger.prototype.info = function (message) {
        this.log(Logger.prototype.level.INFO, message);
    };

    Logger.prototype.warning = function (message) {
        this.log(Logger.prototype.level.WARNING, message);
    };

    Logger.prototype.error = function (message) {
        this.log(Logger.prototype.level.ERROR, message);
    };

    Logger.prototype.log = function (level, message) {
        var tmp = level;
        var levelHandlers = this.handlers[tmp] || [];
        while (tmp >= 0) {
            levelHandlers.forEach(function (handler) {
                handler(level, message);
            });
            levelHandlers = this.handlers[--tmp] || [];
        }
    };

    Logger.prototype.addHandler = function (level, callback) {
        if (!this.handlers[level])
            this.handlers[level] = [];
        this.handlers[level].push(callback);
    };

    Logger.prototype.removeHandler = function (level, callback) {
        var levelHandlers = this.handlers[level];
        if (levelHandlers) {
            var index = levelHandlers.indexOf(callback);
            if (index > -1)
                levelHandlers.splice(index, 1);
        }
    };

    window.Logger = Logger;
})());
