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

  webgl.linkProgram(programObject);
  if (!webgl.getProgramParameter(programObject, webgl.LINK_STATUS)) {
    console.log('Error: programObject link error!');
    return;
  }

  webgl.useProgram(programObject);

  const jsArrayData = [
    -0.5, 0.5, 0.0, 1.0, 0.0, 0.0, 1.0,
    0.5, 0.5, 0.0, 0.0, 1.0, 0.0, 1.0,
    0.5, -0.5, 0.0, 0.0, 0.0, 1.0, 1.0,
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

  let v3PositionIndex = 0;
  let inColor = 0;
  webgl.bindAttribLocation(programObject, v3PositionIndex, 'v3Position');
  webgl.bindAttribLocation(programObject, inColor, 'inColor');

  webgl.enableVertexAttribArray(v3PositionIndex);
  webgl.enableVertexAttribArray(inColor);

  webgl.vertexAttribPointer(v3PositionIndex, 3, webgl.FLOAT, false, 4 * 7, 0);
  webgl.vertexAttribPointer(inColor, 4, webgl.FLOAT, false, 4 * 7, 4 * 3);

  webgl.drawElements(webgl.TRIANGLES, 6, webgl.UNSIGNED_SHORT, 0);
}
export default init;
