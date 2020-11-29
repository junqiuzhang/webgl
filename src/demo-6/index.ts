import vsSource from './shader-vs.glsl';
import fsSource from './shader-fs.glsl';
import { initCanvas, initWebglProgram } from '../utils/index';
import { mat4, mat2 } from 'gl-matrix';
import LeavesImage from '../assets/leaves.jpg';
// 这种数据处理场景下，这个简陋的 push 性能好很多
const push = (arr: number[], x: number) => { arr[arr.length] = x }

// 生成将图像等分为 n x n 矩形的数据
const initParticlesData = (n: number) => {
  const positions: number[] = [];

  // 这种时候求你们别用 forEach 了
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const [x0, x1] = [i / n, (i + 1) / n] // 每个粒子的 x 轴左右坐标
      const [y0, y1] = [j / n, (j + 1) / n] // 每个粒子的 y 轴上下坐标

      // positions in (x, y), z = 0
      push(positions, x0);
      push(positions, y0);
      push(positions, x0);
      push(positions, y0);

      push(positions, x1);
      push(positions, y0);
      push(positions, x0);
      push(positions, y0);

      push(positions, x1);
      push(positions, y1);
      push(positions, x0);
      push(positions, y0);

      push(positions, x0);
      push(positions, y0);
      push(positions, x0);
      push(positions, y0);

      push(positions, x0);
      push(positions, y1);
      push(positions, x0);
      push(positions, y0);

      push(positions, x1);
      push(positions, y1);
      push(positions, x0);
      push(positions, y0);
    }
  }

  // 着色器内的变量名是单数形式，将复数形式的数组名与其对应起来
  return positions
}
function main() {
  const canvas = initCanvas();
  const webgl = canvas.getContext('webgl');
  const webglProgram = initWebglProgram({ webgl, vsSource, fsSource });
  webgl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);

  const positionArray = initParticlesData(300);
  const triangleBuffer = webgl.createBuffer();
  webgl.bindBuffer(webgl.ARRAY_BUFFER, triangleBuffer);
  webgl.bufferData(
    webgl.ARRAY_BUFFER,
    new Float32Array(positionArray),
    webgl.STATIC_DRAW
  );

  const image = new Image();
  image.src = LeavesImage;
  image.onload = function () {
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
    mat4.ortho(transPosMat, 0, 1 / image.width * canvas.clientWidth, 1 / image.height * canvas.clientWidth, 0, -1, 1);
    webgl.uniformMatrix4fv(u_trans_pos_matrix, false, transPosMat);

    const transTexMat = mat2.create();
    const u_trans_tex_matrix = webgl.getUniformLocation(webglProgram, 'u_trans_tex_matrix');
    webgl.uniformMatrix2fv(u_trans_tex_matrix, false, transTexMat);

    const a_position = webgl.getAttribLocation(webglProgram, 'a_position');
    webgl.enableVertexAttribArray(a_position);
    webgl.vertexAttribPointer(a_position, 2, webgl.FLOAT, false, 4 * 4, 0);

    const a_center = webgl.getAttribLocation(webglProgram, 'a_center');
    webgl.enableVertexAttribArray(a_center);
    webgl.vertexAttribPointer(a_center, 2, webgl.FLOAT, false, 4 * 4, 4 * 2);
  
    const u_time = webgl.getUniformLocation(webglProgram, 'u_time');
    let time = 10;
    function render() {
      time -= 0.1;
      if (time < Number.EPSILON) {
        time = 0;
      }
      webgl.uniform1f(u_time, time);
      webgl.clearColor(0, 0, 0, 1);
      webgl.clear(webgl.COLOR_BUFFER_BIT);
      webgl.drawArrays(webgl.TRIANGLES, 0, positionArray.length / 4);
      requestAnimationFrame(render);
    }
    render();
  };
}
export default main;
