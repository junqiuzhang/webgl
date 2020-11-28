import vsSource from './shader-vs.glsl';
import fsSource from './shader-fs.glsl';
import { initCanvas, initWebglProgram } from '../utils/index';
import { mat4 } from 'gl-matrix';
import LeavesImage from '../assets/leaves.jpg';
function main() {
  const canvas = initCanvas();
  const webgl = canvas.getContext('webgl');
  const webglProgram = initWebglProgram({ webgl, vsSource, fsSource });

  const positionArray = [
    0, 0, 0, 0, 0,
    240, 0, 0, 1, 0,
    240, 180, 0, 1, 1,
    
    0, 0, 0, 0, 0,
    240, 180, 0, 1, 1,
    0, 180, 0, 0, 1
  ];
  const triangleBuffer = webgl.createBuffer();
  webgl.bindBuffer(webgl.ARRAY_BUFFER, triangleBuffer);
  webgl.bufferData(
    webgl.ARRAY_BUFFER,
    new Float32Array(positionArray),
    webgl.STATIC_DRAW
  );

  const image = new Image();
  image.src = LeavesImage;
  image.onload = function() {
    const texture = webgl.createTexture();
    webgl.bindTexture(webgl.TEXTURE_2D, texture);
    webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, image);
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.NEAREST);
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.NEAREST);
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.CLAMP_TO_EDGE);
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.CLAMP_TO_EDGE);

    const u_image = webgl.getUniformLocation(webglProgram, 'u_image');
    webgl.activeTexture(webgl.TEXTURE0);
    webgl.bindTexture(webgl.TEXTURE_2D, texture);
    webgl.uniform1i(u_image, 0);

    const transPosMat = mat4.create();
    const u_trans_pos_matrix = webgl.getUniformLocation(webglProgram, 'u_trans_pos_matrix');
    mat4.ortho(transPosMat, 0, canvas.clientWidth, canvas.clientHeight, 0, -1, 1);
    webgl.uniformMatrix4fv(u_trans_pos_matrix, false, transPosMat);

    const transColorMat = mat4.create();
    const u_trans_color_matrix = webgl.getUniformLocation(webglProgram, 'u_trans_color_matrix');
    mat4.set(transColorMat, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    mat4.rotateX(transColorMat, transColorMat, 1);
    webgl.uniformMatrix4fv(u_trans_color_matrix, false, transColorMat);

    const a_position = webgl.getAttribLocation(webglProgram, 'a_position');
    webgl.enableVertexAttribArray(a_position);
    webgl.vertexAttribPointer(a_position, 3, webgl.FLOAT, false, 4 * 5, 0);
  
    const a_text_position = webgl.getAttribLocation(webglProgram, 'a_text_position');
    webgl.enableVertexAttribArray(a_text_position);
    webgl.vertexAttribPointer(a_text_position, 2, webgl.FLOAT, false, 4 * 5, 4 * 3);

    webgl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
    webgl.clearColor(0, 0, 0, 1);
    webgl.clear(webgl.COLOR_BUFFER_BIT);
    webgl.drawArrays(webgl.TRIANGLES, 0, 6);
  };
}
export default main;
