import vsSource from './shader-vs.glsl';
import fsSource from './shader-fs.glsl';
import { initCanvas, initWebglProgram } from '../common';
function init() {
  const canvas = initCanvas();
  const webgl = canvas.getContext('webgl');
  const webglProgram = initWebglProgram({ webgl, vsSource, fsSource });
  // 画布设置
  webgl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
  webgl.clearColor(0, 0, 0, 1);
  webgl.clear(webgl.COLOR_BUFFER_BIT);
  // 数据设置
  const jsArrayData = [
    -0.5, +0.5, 0.0, 1.0, 0.0, 0.0, 1.0,
    +0.5, +0.5, 0.0, 0.0, 1.0, 0.0, 1.0,
    +0.5, -0.5, 0.0, 0.0, 0.0, 1.0, 1.0,
    -0.5, -0.5, 0.0, 1.0, 1.0, 0.0, 1.0,
  ];

  const triangleBuffer = webgl.createBuffer();
  webgl.bindBuffer(webgl.ARRAY_BUFFER, triangleBuffer);
  webgl.bufferData(
    webgl.ARRAY_BUFFER,
    new Float32Array(jsArrayData),
    webgl.STATIC_DRAW
  );

  const jsIndexArrayData = [
    0, 1, 2,
    0, 2, 3
  ];
  const indexBuffer = webgl.createBuffer();
  webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  webgl.bufferData(
    webgl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(jsIndexArrayData),
    webgl.STATIC_DRAW
  );

  let v3PositionLocation = webgl.getAttribLocation(webglProgram, 'v3Position');
  let inColorLocation = webgl.getAttribLocation(webglProgram, 'inColor');
  
  webgl.bindAttribLocation(webglProgram, v3PositionLocation, 'v3Position');
  webgl.bindAttribLocation(webglProgram, inColorLocation, 'inColor');

  webgl.enableVertexAttribArray(v3PositionLocation);
  webgl.enableVertexAttribArray(inColorLocation);

  webgl.vertexAttribPointer(v3PositionLocation, 3, webgl.FLOAT, false, 4 * 7, 0);
  webgl.vertexAttribPointer(inColorLocation, 4, webgl.FLOAT, false, 4 * 7, 4 * 3);

  webgl.drawElements(webgl.TRIANGLES, 6, webgl.UNSIGNED_SHORT, 0);
}
export default init;
