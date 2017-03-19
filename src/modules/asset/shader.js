((function () {
    'use strict';

    Modules.prototype.add('shader', function (instance) {
        instance.asset = instance.asset || {};
        instance.asset.shader = {
            get: function (name, callback) {
                var shader = null, firstSource = null;
                Ajax.get('asset/shader/' + name + '.vert', function (response) {
                    if (firstSource) {
                        shader = new Shader(response, firstSource);
                        callback(shader);
                    } firstSource = response;
                });
                Ajax.get('asset/shader/' + name + '.frag', function (response) {
                    if (firstSource) {
                        shader = new Shader(firstSource, response);
                        callback(shader);
                    } firstSource = response;
                });
            }
        };
    });
})());
