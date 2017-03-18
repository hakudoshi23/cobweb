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

    //TODO: refactor to reduce number of operations
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

    //TODO: refactor to reduce number of operations
    Math.geo.closestPointsBetweenSegments = function (a0,a1, b0,b1, p_a, p_b) {
		var u = vec3.subtract( vec3.create(), a1, a0 );
		var v = vec3.subtract( vec3.create(), b1, b0 );
		var w = vec3.subtract( vec3.create(), a0, b0 );

		var a = vec3.dot(u,u);         // always >= 0
		var b = vec3.dot(u,v);
		var c = vec3.dot(v,v);         // always >= 0
		var d = vec3.dot(u,w);
		var e = vec3.dot(v,w);
		var D = a*c - b*b;        // always >= 0
		var sc, tc;

		// compute the line parameters of the two closest points
		if (D < EPSILON) {          // the lines are almost parallel
			sc = 0.0;
			tc = (b>c ? d/b : e/c);    // use the largest denominator
		}
		else {
			sc = (b*e - c*d) / D;
			tc = (a*e - b*d) / D;
		}

		// get the difference of the two closest points
		if(p_a)	vec3.add(p_a, a0, vec3.scale(vec3.create(),u,sc));
		if(p_b)	vec3.add(p_b, b0, vec3.scale(vec3.create(),v,tc));

		var dP = vec3.add( vec3.create(), w, vec3.subtract( vec3.create(), vec3.scale(vec3.create(),u,sc) , vec3.scale(vec3.create(),v,tc)) );  // =  L1(sc) - L2(tc)
		return vec3.length(dP);   // return the closest distance
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

    Math.geo.computePointsCenter = function (points) {
        if (!points || points.length === 0) return null;
        var center = [0, 0, 0];
        points.forEach(function(point) {
            vec3.add(center, center, point);
        });
        vec3.scale(center, center, 1 / points.length);
        return center;
    };

    Math.geo.findClosestPointIndex = function (position, points) {
        if (!points || !points.length) return null;
        var distance = Math.geo.pointPointDistance(position, points[0]);
        var closestIndex = 0;
        for (var i = 1; i < points.length; i++) {
            var newDistance = Math.geo.pointPointDistance(position, points[i]);
            if (newDistance < distance) {
                distance = newDistance;
                closestIndex = i;
            }
        }
        return closestIndex;
    };

    Math.geo.findClosestPoint = function (position, points) {
        if (!points || !points.length) return null;
        var index = Math.geo.findClosestPointIndex(position, points);
        return points[index];
    };

    Math.geo.findClosestFace = function (position, faces) {
        if (!faces || !faces.length) return null;
        var centers = faces.map(function (face) {
            return face.computeCenter();
        });
        var index = Math.geo.findClosestPointIndex(position, centers);
        return faces[index];
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
