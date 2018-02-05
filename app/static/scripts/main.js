"use strict"
window.addEventListener("load",init,false);
var gsm;
var uiManager;

function init(){
  uiManager=new UIManager();
  gsm=new GameStateManager();

  gameLoop();
}

function gameLoop(){
  //textCtx 초기화용
  display.update();
  update();
  render();
  requestAnimationFrame(gameLoop);
}

function render(){
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.GEQUAL);
  gl.clearDepth(0.0);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  gsm.render(display);
}

function update(){
  gsm.update();
  inputLoop();
}
