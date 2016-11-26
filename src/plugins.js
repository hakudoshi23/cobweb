'use strict';

((function() {
    WebMesh.prototype.plugins = {};

    WebMesh.prototype.enablePlugins = function(instance) {
        for (var name in WebMesh.prototype.plugins)
            instance[name] = new WebMesh.prototype.plugins[name](instance);
    };
})());
