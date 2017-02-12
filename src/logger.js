/* jshint loopfunc:true */

((function(){
    'use strict';

    var Logger = function (instance) {
        this.handlers = [];

        this.addHandler(this.level.ALL, function (level, args) {
            if (Logger.prototype.level.DEBUG === level) {
                console.debug.apply(this, args);
            } else if (Logger.prototype.level.INFO === level) {
                console.info.apply(this, args);
            } else if (Logger.prototype.level.WARNING === level) {
                console.warn.apply(this, args);
            } else if (Logger.prototype.level.ERROR === level) {
                console.error.apply(this, args);
            }
        });
    };

    Logger.prototype.debug = function () {
        this.log(Logger.prototype.level.DEBUG, arguments);
    };

    Logger.prototype.info = function () {
        this.log(Logger.prototype.level.INFO, arguments);
    };

    Logger.prototype.warning = function () {
        this.log(Logger.prototype.level.WARNING, arguments);
    };

    Logger.prototype.error = function () {
        this.log(Logger.prototype.level.ERROR, arguments);
    };

    Logger.prototype.log = function (level, args) {
        var tmp = level;
        var levelHandlers = this.handlers[tmp] || [];
        while (tmp >= 0) {
            levelHandlers.forEach(function (handler) {
                handler(level, args);
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

    Logger.prototype.level = {
        ALL: 0,
        DEBUG: 1,
        INFO: 2,
        WARNING: 3,
        ERROR: 4,
        NONE: 5,
    };

    window.Logger = Logger;
})());
