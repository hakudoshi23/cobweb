precision highp float;
varying vec3 v_normal;
uniform vec3 u_lightvector;
uniform vec4 u_color;
void main() {
  vec3 N = normalize(v_normal);
  vec4 ambient = vec4(0.4, 0.4, 0.4, 1);
  gl_FragColor = ambient + u_color * max(0.0, dot(u_lightvector,N));
}
