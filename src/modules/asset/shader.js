((function () {
    'use strict';

    Modules.prototype.add('shader', function (instance) {
        instance.asset = instance.asset || {};
        instance.asset.shader = {
            get: function (name, callback) {
                var shader = null, firstSource = null;
                var vertSource = Ajax.get('shader/' + name + '.vert', function (response) {
                    if (firstSource) {
                        shader = new Shader(response, firstSource);
                        callback(shader);
                    } firstSource = response;
                });
                var fragSource = Ajax.get('shader/' + name + '.frag', function (response) {
                    if (firstSource) {
                        shader = new Shader(firstSource, response);
                        callback(shader);
                    } firstSource = response;
                });
            }
        };
    }, ['surface-interaction']);
})());
