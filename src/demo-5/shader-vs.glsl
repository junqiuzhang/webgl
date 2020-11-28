precision mediump float;
attribute vec3 a_position;
attribute vec2 a_text_position;
uniform mat4 u_trans_pos_matrix;
varying vec2 v_text_position;
void main() {
  v_text_position = a_text_position;
  gl_Position = u_trans_pos_matrix * vec4(a_position, 1.0);
}