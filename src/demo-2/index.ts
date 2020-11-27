import vsSource from './shader-vs.glsl';
import fsSource from './shader-fs.glsl';
import { initCanvas, initWebglProgram } from '../common';
function init() {
  const canvas = initCanvas();
  const webgl = canvas.getContext('webgl');
  const webglProgram = initWebglProgram({webgl, vsSource, fsSource});
  webgl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
  webgl.clearColor(0, 0, 0, 1);
  webgl.clear(webgl.COLOR_BUFFER_BIT);

  const jsArrayData = [0.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0];

  const triangleBuffer = webgl.createBuffer();
  webgl.bindBuffer(webgl.ARRAY_BUFFER, triangleBuffer);
  webgl.bufferData(
    webgl.ARRAY_BUFFER,
    new Float32Array(jsArrayData),
    webgl.STATIC_DRAW
  );
  
  let v3PositionLocation = webgl.getAttribLocation(webglProgram, 'v3Position');
  webgl.enableVertexAttribArray(v3PositionLocation);
  webgl.vertexAttribPointer(v3PositionLocation, 3, webgl.FLOAT, false, 0, 0);
  webgl.drawArrays(webgl.TRIANGLES, 0, 3);
}
export default init;
