function init() {
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 600;
  document.body.appendChild(canvas);
  const webgl = canvas.getContext('webgl');
  webgl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
  webgl.clearColor(0, 0, 0, 1);
  webgl.clear(webgl.COLOR_BUFFER_BIT);
}
export default init;
