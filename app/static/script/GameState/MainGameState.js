"use strict"

class MainGameState{
  constructor(){
    this.game=new Game();
  }

  init(){
    this.game.init(/*this.receivedData.Users*/null);
    var mainPanel=new UIPanel(null,0,0,display.getWidth(),display.getHeight());

    uiManager.addPanel(mainPanel);
  }

  reset(){
    this.game.reset();
    this.game=null;
    uiManager.clear();
  }

  update(){
    var msg=networkManager.pollMessage();
    if(msg!=null){
      this.messageProcess(msg);
    }

    this.game.update();
    uiManager.update();
  }

  messageProcess(message) {
    this.game.messageProcess(message);
  }

  render(display){
    // search(this.game.camera,this.game.world.rootQuad);

    // 쿼드트리 감지영역표시용
    // for(var id in Entity.list){
    //   let bound=Entity.list[id].body.bound;
    //
    //   let w=bound.getWidth();
    //   let h=bound.getHeight();
    //   let x=bound.getX()+w/2;
    //   let y=bound.getY()+h/2;
    //   this.game.camera.render(TextureLoader.get("images/blankImage.png"),x,y,w,h,0);
    // }

    this.game.render();
    uiManager.render(display);
  }

}

function search(camera,node){
  if(node==null)
    return;

  let w=node.bounds.getWidth();
  let h=node.bounds.getHeight();
  let x=node.bounds.getX()+w/2;
  let y=node.bounds.getY()+h/2;
  camera.render(TextureLoader.get("images/blankImage.png"),x,y,w,h,0);

  for(let i=0;i<4;i++){
    search(camera,node.nodes[i]);
  }
}
