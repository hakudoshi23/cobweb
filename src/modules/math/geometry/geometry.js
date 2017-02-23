(function () {
    'use strict';

    Math.geo = Math.geo || {};

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
})();
