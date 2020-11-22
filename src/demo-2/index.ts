import vsSource from './shader-vs.glsl';
import fsSource from './shader-fs.glsl';
function init() {
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 600;
  document.body.appendChild(canvas);
  const webgl = canvas.getContext('webgl');
  webgl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
  webgl.clearColor(0, 0, 0, 1);
  webgl.clear(webgl.COLOR_BUFFER_BIT);

  const vertexShaderObject = webgl.createShader(webgl.VERTEX_SHADER);
  const fragmentShaderObject = webgl.createShader(webgl.FRAGMENT_SHADER);

  webgl.shaderSource(vertexShaderObject, vsSource);
  webgl.shaderSource(fragmentShaderObject, fsSource);
  
  webgl.compileShader(vertexShaderObject);
  webgl.compileShader(fragmentShaderObject);

  if (!webgl.getShaderParameter(vertexShaderObject, webgl.COMPILE_STATUS)) {
    console.log('Error: vertexShaderObject compile error!');
    return;
  }
  if (!webgl.getShaderParameter(fragmentShaderObject, webgl.COMPILE_STATUS)) {
    console.log('Error: fragmentShaderObject compile error!');
    return;
  }

  const programObject = webgl.createProgram();

  webgl.attachShader(programObject, vertexShaderObject);
  webgl.attachShader(programObject, fragmentShaderObject);

  let v3PositionIndex = 0;
  webgl.bindAttribLocation(programObject, v3PositionIndex, 'v3Position');

  webgl.linkProgram(programObject);
  if (!webgl.getProgramParameter(programObject, webgl.LINK_STATUS)) {
    console.log('Error: programObject link error!');
    return;
  }

  webgl.useProgram(programObject);

  const jsArrayData = [0.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0];

  const triangleBuffer = webgl.createBuffer();
  webgl.bindBuffer(webgl.ARRAY_BUFFER, triangleBuffer);
  webgl.bufferData(
    webgl.ARRAY_BUFFER,
    new Float32Array(jsArrayData),
    webgl.STATIC_DRAW
  );
  webgl.bindBuffer(webgl.ARRAY_BUFFER, triangleBuffer);

  webgl.enableVertexAttribArray(v3PositionIndex);
  webgl.vertexAttribPointer(v3PositionIndex, 3, webgl.FLOAT, false, 0, 0);
  webgl.drawArrays(webgl.TRIANGLES, 0, 3);
}
export default init;
