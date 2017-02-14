precision highp float;
attribute vec3 a_vertex;
attribute vec3 a_normal;
varying vec3 v_normal;
uniform mat4 u_mvp;
uniform mat4 u_model;
void main() {
    v_normal = (u_model * vec4(a_normal,0.0)).xyz;
    gl_Position = u_mvp * vec4(a_vertex,1.0);
}
