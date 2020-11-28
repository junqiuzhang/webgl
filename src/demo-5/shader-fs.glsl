precision mediump float;
uniform sampler2D u_image;
uniform mat4 u_trans_color_matrix;
varying vec2 v_text_position;
void main() {
  gl_FragColor = u_trans_color_matrix * texture2D(u_image, v_text_position);
}