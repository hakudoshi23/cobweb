precision highp float;

attribute vec3 a_vertex;
attribute vec3 a_normal;
attribute vec4 a_color;

varying vec3 v_normal;
varying vec4 v_color;

uniform mat4 u_mvp;
uniform mat4 u_model;

void main() {
    v_color = a_color;
    v_normal = (u_model * vec4(a_normal,0.0)).xyz;
    gl_Position = u_mvp * vec4(a_vertex,1.0);
}
