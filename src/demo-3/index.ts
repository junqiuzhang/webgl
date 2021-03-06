import vsSource from './shader-vs.glsl';
import fsSource from './shader-fs.glsl';
import { initCanvas, initWebglProgram } from '../utils/index';
function main() {
  const canvas = initCanvas();
  const webgl = canvas.getContext('webgl');
  const webglProgram = initWebglProgram({ webgl, vsSource, fsSource });
  webgl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
  webgl.clearColor(0, 0, 0, 1);
  webgl.clear(webgl.COLOR_BUFFER_BIT);

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

  webgl.bindBuffer(webgl.ARRAY_BUFFER, triangleBuffer);
  webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  let v3PositionIndex = webgl.getAttribLocation(webglProgram, 'v3Position');
  let inColor = webgl.getAttribLocation(webglProgram, 'inColor');
  
  webgl.bindAttribLocation(webglProgram, v3PositionIndex, 'v3Position');
  webgl.bindAttribLocation(webglProgram, inColor, 'inColor');

  webgl.enableVertexAttribArray(v3PositionIndex);
  webgl.enableVertexAttribArray(inColor);

  webgl.vertexAttribPointer(v3PositionIndex, 3, webgl.FLOAT, false, 4 * 7, 0);
  webgl.vertexAttribPointer(inColor, 4, webgl.FLOAT, false, 4 * 7, 4 * 3);

  webgl.drawElements(webgl.TRIANGLES, 6, webgl.UNSIGNED_SHORT, 0);
}
export default main;
