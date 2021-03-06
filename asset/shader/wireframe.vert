precision highp float;

attribute vec3 a_vertex;
attribute vec4 a_color;

varying vec4 v_color;

uniform mat4 u_mvp;

void main() {
    v_color = a_color;
    gl_PointSize = 3.0;
    gl_Position = u_mvp * vec4(a_vertex, 1.0);
}
