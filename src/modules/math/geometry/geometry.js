(function () {
    'use strict';

    var EPSILON = 0.000001;

    Math.geo = Math.geo || {};

    Math.geo.rayFaceCollision = function (start, direction, vertices, result) {
        var triangles = Math.geo.triangulateFace(vertices);
        for (var i = 0; i < triangles.length; i++) {
            var triangle = triangles[i];
            if (Math.geo.rayTriangleCollision(start, direction,
                triangle[0], triangle[1], triangle[2], result))
                return true;
        }
        return false;
    };

    Math.geo.rayTriangleCollision = function (start, direction, v1, v2, v3, result) {
        result = result || [0, 0, 0];
    	var triangleNormal = getNormal(v1, v2, v3);
        if (Math.geo.rayPlaneCollision(start, direction, v1, triangleNormal, result)) {
            var bary = getBarycentricCoordinates(v1, v2, v3, result);
        	return (bary[0] <= 1 && bary[0] >= 0) &&
                (bary[1] <= 1 && bary[1] >= 0) &&
                (bary[2] <= 1 && bary[2] >= 0);
        }
    	return false;
    };

    Math.geo.rayPlaneCollision = function (start, direction, planePoint, planeNormal, result) {
		var numer = vec3.dot(planePoint, planeNormal) -
            vec3.dot(planeNormal, start);
		var denom = vec3.dot(planeNormal, direction);
		if (Math.abs(denom) < EPSILON) return false;
		var t = numer / denom;
		if (t < 0.0) return false;
		if (result) {
            vec3.scale(result, direction, t);
            vec3.add(result, start, result);
        }
		return true;
    };

    Math.geo.rayAABBCollision = function (start, direction, minB, maxB, result) {
        result = result || vec3.create();

		var inside = true;
		var quadrant = new Float32Array(3);
		var i = 0|0;
		var whichPlane;
		var maxT = new Float32Array(3);
		var candidatePlane = new Float32Array(3);

		/* Find candidate planes; this loop can be avoided if
		rays cast all from the eye(assume perpsective view) */
		for (i=0; i < 3; ++i)
			if(start[i] < minB[i]) {
				quadrant[i] = 1;
				candidatePlane[i] = minB[i];
				inside = false;
			}else if (start[i] > maxB[i]) {
				quadrant[i] = 0;
				candidatePlane[i] = maxB[i];
				inside = false;
			}else	{
				quadrant[i] = 2;
			}

		/* Ray origin inside bounding box */
		if(inside)	{
			vec3.copy(result, start);
			return true;
		}

		/* Calculate T distances to candidate planes */
		for (i = 0; i < 3; ++i)
			if (quadrant[i] !== 2 && direction[i] !== 0)
				maxT[i] = (candidatePlane[i] - start[i]) / direction[i];
			else
				maxT[i] = -1;

		/* Get largest of the maxT's for final choice of intersection */
		whichPlane = 0;
		for (i = 1; i < 3; i++)
			if (maxT[whichPlane] < maxT[i])
				whichPlane = i;

		/* Check final candidate actually inside box */
		if (maxT[whichPlane] < 0) return false;
		if (maxT[whichPlane] > Number.MAX_VALUE) return false; //NOT TESTED

		for (i = 0; i < 3; ++i)
			if (whichPlane != i) {
				result[i] = start[i] + maxT[whichPlane] * direction[i];
				if (result[i] < minB[i] || result[i] > maxB[i])
					return false;
			} else {
				result[i] = candidatePlane[i];
			}
		return true;
    };

    Math.geo.rayPointDistance = function (start, direction, point) {
        var aux = [0, 0, 0];
        vec3.sub(aux, point, start);
        vec3.cross(aux, direction, aux);
        return vec3.len(aux);
    };

    Math.geo.pointPointDistance = function (p1, p2) {
        var aux = [0, 0, 0];
        vec3.sub(aux, p2, p1);
        return vec3.len(aux);
    };

    Math.geo.triangulateFace = function (vertices) {
        var triangulated = [];
        for (var i = 0; i < vertices.length - 2; i++) {
            triangulated.push([vertices[0], vertices[i + 1], vertices[i + 2]]);
        }
        return triangulated;
    };

    Math.geo.findClosestFace = function (position, faces) {
        if (!faces.length) return null;
        var distance = Math.geo.pointPointDistance(position, faces[0].computeCenter());
        var closestFace = faces[0];
        for (var i = 1; i < faces.length; i++) {
            var newDistance = Math.geo.pointPointDistance(position, faces[i].computeCenter());
            if (newDistance < distance) {
                distance = newDistance;
                closestFace = faces[i];
            }
        }
        return closestFace;
    };

    function getBarycentricCoordinates (p1, p2, p3, point) {
        var v0 = getVectorFromPoints(p1, p2);
        var v1 = getVectorFromPoints(p1, p3);
        var v2 = getVectorFromPoints(p1, point);

    	var d00 = vec3.dot(v0, v0);
    	var d01 = vec3.dot(v0, v1);
    	var d11 = vec3.dot(v1, v1);
    	var d20 = vec3.dot(v2, v0);
    	var d21 = vec3.dot(v2, v1);
    	var denom = d00 * d11 - d01 * d01;

        var result = [(d11 * d20 - d01 * d21) / denom,
            (d00 * d21 - d01 * d20) / denom, 0];
        result[2] = 1 - result[0] - result[1];
    	return result;
    }

    function getNormal (v1, v2, v3) {
        var tmp1 = vec3.create();
        var tmp2 = vec3.create();
        vec3.sub(tmp1, v2, v1);
        vec3.sub(tmp2, v3, v1);
        vec3.cross(tmp1, tmp1, tmp2);
        return tmp1;
    }

    function getVectorFromPoints (a, b) {
        var output = vec3.create();
        vec3.sub(output, b, a);
        return output;
    }
})();
