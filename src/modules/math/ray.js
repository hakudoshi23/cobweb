((function () {
    'use strict';

    var Ray = function (start, direction) {
        this.direction = direction || [0, 0, 1];
        this.start = start || vec3.create();
        vec3.normalize(this.direction, this.direction);
    };

    Ray.fromPoints = function (a, b) {
        var direction = vec3.create();
        vec3.sub(direction, b, a);
        return new Ray(a, direction);
    };

    window.Math.Ray = Ray;
})());
