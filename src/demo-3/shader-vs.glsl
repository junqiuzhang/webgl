precision lowp float;
attribute vec3 v3Position;
attribute vec4 inColor;
varying vec4 outColor;
void main() {
  outColor = inColor;
  gl_Position = vec4(v3Position, 1.0);
}