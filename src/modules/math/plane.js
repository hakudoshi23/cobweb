((function () {
    'use strict';

    var Plane = function (point, normal) {
        this.normal = normal || [0, 1, 0];
        this.point = point || vec3.create();
        vec3.normalize(this.normal, this.normal);
    };

    window.Math.Plane = Plane;
})());
