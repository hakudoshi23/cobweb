((function () {
    'use strict';

    function HalfEdgeCube () {
        var mesh = new Math.HalfEdgeMesh();

        var vhandle = [];
        vhandle[0] = [-1, -1,  1];
        vhandle[1] = [ 1, -1,  1];
        vhandle[2] = [ 1,  1,  1];
        vhandle[3] = [-1,  1,  1];
        vhandle[4] = [-1, -1, -1];
        vhandle[5] = [ 1, -1, -1];
        vhandle[6] = [ 1,  1, -1];
        vhandle[7] = [-1,  1, -1];

        var face_vhandles = [];
        face_vhandles.push(vhandle[0]);
        face_vhandles.push(vhandle[1]);
        face_vhandles.push(vhandle[2]);
        face_vhandles.push(vhandle[3]);
        mesh.addFace(face_vhandles);

        face_vhandles = [];
        face_vhandles.push(vhandle[7]);
        face_vhandles.push(vhandle[6]);
        face_vhandles.push(vhandle[5]);
        face_vhandles.push(vhandle[4]);
        mesh.addFace(face_vhandles);

        face_vhandles = [];
        face_vhandles.push(vhandle[1]);
        face_vhandles.push(vhandle[0]);
        face_vhandles.push(vhandle[4]);
        face_vhandles.push(vhandle[5]);
        mesh.addFace(face_vhandles);

        face_vhandles = [];
        face_vhandles.push(vhandle[2]);
        face_vhandles.push(vhandle[1]);
        face_vhandles.push(vhandle[5]);
        face_vhandles.push(vhandle[6]);
        mesh.addFace(face_vhandles);

        face_vhandles = [];
        face_vhandles.push(vhandle[3]);
        face_vhandles.push(vhandle[2]);
        face_vhandles.push(vhandle[6]);
        face_vhandles.push(vhandle[7]);
        mesh.addFace(face_vhandles);

        face_vhandles = [];
        face_vhandles.push(vhandle[0]);
        face_vhandles.push(vhandle[3]);
        face_vhandles.push(vhandle[7]);
        face_vhandles.push(vhandle[4]);
        mesh.addFace(face_vhandles);

        return mesh;
    }

    window.HalfEdgeCube = HalfEdgeCube;
})());
