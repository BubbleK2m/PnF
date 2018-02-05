"use strict"

function TitleState(){
  this.camera=new Camera(new Vector2d(0,0),gl.viewportWidth,gl.viewportHeight);
}

inherit(GameState,TitleState);

TitleState.prototype.init=function(){
  //투명 메인 판넬
  var mainPanel=new UIPanel(null,0,0,display.getWidth(),display.getHeight());

  //메인 로고
  mainPanel.addComponent(new UIButton(Sprite.PAF_LOGO,display.getWidth()/2-100,display.getHeight()/2-100,200,100,{
    entered:function(uiButton){
      uiButton.body.width=200/1.5;
      uiButton.body.height=100/1.5;
    },
    exited:function(uiButton){
      uiButton.body.width=200;
      uiButton.body.height=100;
    },
    pressed:function(uiButton){},
    released:function(uiButton){}
  }));

  //start버튼
  mainPanel.addComponent(new UIButton(Sprite.PAF_LOGO,display.getWidth()/2-100,display.getHeight()/2+100,200,100,{
    entered:function(uiButton){
      uiButton.body.width=200/1.1;
      uiButton.body.height=100/1.1;
    },
    exited:function(uiButton){
      uiButton.body.width=200;
      uiButton.body.height=100;
    },
    pressed:function(uiButton){
      gsm.setState(GameState.LOGIN_STATE);
    },
    released:function(uiButton){}
  }));
  uiManager.addPanel(mainPanel);
}
TitleState.prototype.reset=function(){
  uiManager.clear();
}
TitleState.prototype.update=function(){
  uiManager.update();
  if(isKeyPressed(32)){
    gsm.setState(GameState.MAINGAME_STATE);
  }
}
TitleState.prototype.render=function(display){
  uiManager.render(display);
}
