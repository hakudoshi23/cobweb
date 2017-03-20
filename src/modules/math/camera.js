((function () {
    'use strict';

    var Camera = function (center, rotation, distance) {
        this.center = center || [0, 0, 0];
        this.rotation = rotation || [2.8, 0.5];
        this.distance = distance || 15;
        this.projection = mat4.create();
    };

    Camera.prototype.getViewMatrix = function (view) {
        view = view || mat4.create();
        var eye = [0, 0, 0];
        this.getPosition(eye);
        mat4.lookAt(view, eye, this.center, this.getUpDirection());
        return view;
    };

    Camera.prototype.getPosition = function (eye) {
        eye = eye || vec3.create();
        vec3.set(eye, 0, 0, -this.distance);
        vec3.rotateX(eye, eye, this.rotation[1]);
        vec3.rotateY(eye, eye, -this.rotation[0]);
        return eye;
    };

    Camera.prototype.getDirection = function (direction) {
        direction = direction || vec3.create();
        var eye = this.getPosition();
        vec3.sub(direction, this.center, eye);
        vec3.normalize(direction, direction);
        return direction;
    };

    Camera.prototype.getRay = function (ray, canvasCoords, canvasSize) {
        ray = ray || new Math.Ray();
        this.getPosition(ray.start);
        vec3.set(ray.direction, canvasCoords[0] / (canvasSize[0] * 0.5) - 1.0,
            canvasCoords[1] / (canvasSize[1] * 0.5) - 1.0, 1);
        var auxMat = mat4.create();
        mat4.multiply(auxMat, this.projection, this.getViewMatrix());
        mat4.invert(auxMat, auxMat);
        vec3.transformMat4(ray.direction, ray.direction, auxMat);
        vec3.normalize(ray.direction, ray.direction);
        return ray;
    };

    Camera.prototype.getUpDirection = function (up) {
        up = up || vec3.create();
        var vRotation = this.rotation[1];
        if (vRotation >= Math.PI / 2 &&
            vRotation <= ((Math.PI * 3) / 2))
            vec3.set(up, 0, 1, 0);
        else vec3.set(up, 0, -1, 0);
        return up;
    };

    Camera.prototype.computeLocalAxis = function () {
        var left = [0, 0, 0];
        var up = [0, 0, 0];

        var forward = this.getDirection();
        vec3.cross(left, forward, [0, 1, 0]);
        vec3.cross(up, forward, left);

        return {up: up, left: left};
    };

    window.Math.Camera = Camera;
})());
