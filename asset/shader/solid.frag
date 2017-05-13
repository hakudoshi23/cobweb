#extension GL_OES_standard_derivatives : enable

precision highp float;

varying vec3 v_position;
varying vec4 v_color;

uniform vec3 u_lightvector;
uniform vec4 u_color;

vec3 computeNormal(vec3 pos) {
    vec3 fdx = dFdx(pos);
    vec3 fdy = dFdy(pos);
    return normalize(cross(fdx, fdy));
}

void main() {
  vec3 N = computeNormal(v_position);
  vec4 ambient = vec4(0.4, 0.4, 0.4, 1);
  gl_FragColor = ambient + u_color * max(0.0, dot(u_lightvector,N)) + v_color;
}
