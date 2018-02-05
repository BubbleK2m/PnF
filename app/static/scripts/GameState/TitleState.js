"use strict"
// 오늘해결할것-> 1.text출력의 일원화
//               2.ui출력할때 정렬되는거 잘되게
//               3.해상도 조절 자유롭게 되게만들기
function TitleState(){
  this.camera=new Camera(new Vector2d(0,0),gl.viewportWidth,gl.viewportHeight);
}

inherit(GameState,TitleState);

TitleState.prototype.init=function(){
  //투명 메인 판넬
  var mainPanel=new UIPanel(Sprite.GREEN,0,0,display.getWidth(),display.getHeight());

  //메인 로고
  mainPanel.addComponent(new UIButton(Sprite.PAF_LOGO,display.getWidth()/2-210,display.getHeight()/2-250,400,300,{
    entered:function(uiButton){
      // uiButton.body.width=200/1.5;
      // uiButton.body.height=100/1.5;
    },
    exited:function(uiButton){
      // uiButton.body.width=200;
      // uiButton.body.height=100;
    },
    pressed:function(uiButton){},
    released:function(uiButton){}
  }));

  var startBtn=new UIButton(Sprite.BROWN,display.getWidth()/2-100,display.getHeight()/2+150,200,100,{
    entered:function(uiButton){
      uiButton.body.width=200/1.1;
      uiButton.body.height=100/1.1;
      uiButton.label.body.width=uiButton.body.width/1.1;
      uiButton.label.body.height=uiButton.body.height/1.1;
      uiButton.textLabel.body.width=uiButton.body.width/2/1.1;
      uiButton.textLabel.body.height=uiButton.body.height/2/1.1;
    },
    exited:function(uiButton){
      uiButton.body.width=200;
      uiButton.body.height=100;
      uiButton.label.body.width=uiButton.body.width;
      uiButton.label.body.height=uiButton.body.height;
      uiButton.textLabel.body.width=uiButton.body.width/2;
      uiButton.textLabel.body.height=uiButton.body.height/2;
    },
    pressed:function(uiButton){

    },
    released:function(uiButton){
      gsm.setState(GameState.LOGIN_STATE);
    }
  });
  startBtn.setText("Start");

  //start버튼
  mainPanel.addComponent(startBtn);

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
