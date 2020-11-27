export function initCanvas(width?: number, height?: number) {
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  canvas.width = width || 600;
  canvas.height = height || 600;
  document.body.appendChild(canvas);
  return canvas;
}
export function initWebglProgram({
  webgl,
  vsSource,
  fsSource
}: {
  webgl: WebGLRenderingContext | WebGL2RenderingContext;
  vsSource: string;
  fsSource: string;
}) {
  // 创建shader
  const vertexShaderObject = webgl.createShader(webgl.VERTEX_SHADER);
  const fragmentShaderObject = webgl.createShader(webgl.FRAGMENT_SHADER);
  // 绑定shader
  webgl.shaderSource(vertexShaderObject, vsSource);
  webgl.shaderSource(fragmentShaderObject, fsSource);
  // 编译shader
  webgl.compileShader(vertexShaderObject);
  webgl.compileShader(fragmentShaderObject);
  // 编译错误处理
  if (!webgl.getShaderParameter(vertexShaderObject, webgl.COMPILE_STATUS)) {
    console.log(
      'Error: vertexShaderObject compile error!',
      webgl.getShaderInfoLog(vertexShaderObject)
    );
    return;
  }
  if (!webgl.getShaderParameter(fragmentShaderObject, webgl.COMPILE_STATUS)) {
    console.log(
      'Error: fragmentShaderObject compile error!',
      webgl.getShaderInfoLog(fragmentShaderObject)
    );
    return;
  }
  // 创建program
  const programObject = webgl.createProgram();
  // 绑定program
  webgl.attachShader(programObject, vertexShaderObject);
  webgl.attachShader(programObject, fragmentShaderObject);
  // 链接program
  webgl.linkProgram(programObject);
  // 链接错误处理
  if (!webgl.getProgramParameter(programObject, webgl.LINK_STATUS)) {
    console.log(
      'Error: programObject link error!',
      webgl.getProgramInfoLog(programObject)
    );
    return;
  }
  // 使用program
  webgl.useProgram(programObject);
  return programObject;
}
