attribute vec3 v3Position;
void main() {
  gl_Position = vec4(v3Position, 1.0);
}