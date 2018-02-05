"use strict"

function MainGameState(){
  this.game=new Game();
}

inherit(GameState,MainGameState);

MainGameState.prototype.init=function(){
  // this.t=new Texture("www.jrr.kr","bold 20px Arial");
  this.game.init();
  var mainPanel=new UIPanel(null,0,0,display.getWidth(),display.getHeight());
  mainPanel.addComponent(new UIButton(TextureLoader.get("images/cloud.png"),0,display.getHeight()/2,200,100,{
    entered:function(uiButton){
      uiButton.body.width=200/1.5;
      uiButton.body.height=100/1.5;
      console.log("enter");
    },
    exited:function(uiButton){
      uiButton.body.width=200;
      uiButton.body.height=100;
      console.log("exit");
    },
    pressed:function(uiButton){
      console.log("press");
    },
    released:function(uiButton){
      console.log("release");
    }
  }));

  mainPanel.addComponent(new UITextField(TextureLoader.get("images/blankImage.png"),0,display.getHeight()-200/2,500,100,{
    entered:function(uiButton){
      // uiButton.body.width=200/1.5;
      // uiButton.body.height=100/1.5;
      // console.log("enter");
    },
    exited:function(uiButton){
      // uiButton.body.width=200;
      // uiButton.body.height=100;
      // console.log("exit");
      uiButton.isFocus=false;
    },
    pressed:function(uiButton){
      // console.log("press");
      uiButton.isFocus=true;
    },
    released:function(uiButton){
      // console.log("release");
    }
  }));

  // var list=new UIList(TextureLoader.get("images/blankImage.png"),500,0,200,500);
  // for(var i=0;i<4;i++){
  //   list.addComponent(new UIButton(TextureLoader.get("images/cloud.png"),0,0,200,100+i*50,{
  //     entered:function(uiButton){
  //       console.log("enter");
  //     },
  //     exited:function(uiButton){
  //       console.log("exit");
  //     },
  //     pressed:function(uiButton){
  //
  //       console.log("press");
  //     },
  //     released:function(uiButton){
  //       for(var i=0;i<list.components.length;i++){
  //         if(list.components[i]==uiButton)
  //         list.deleteComponent(i);
  //       }
  //       console.log("release");
  //     }
  //   }));
  // }
  uiManager.addPanel(mainPanel);
  // uiManager.addPanel(list);
}
MainGameState.prototype.reset=function(){
  this.game.reset();
  this.game=null;
  uiManager.clear();
}
let i=0;
MainGameState.prototype.update=function(){
  // var mvMatrix=mat4.create();
  // mat4.identity(mvMatrix);
  // this.t.render(mvMatrix,display.getProjection());
  this.game.update();
  // for(let y in Entity.list){
  //   let e1=Entity.list[y];
  //   for(let x in Entity.list){
  //     let e2=Entity.list[x];
  //
  //     if(e1.collision!=null&&e2.collision!=null&&e1!=e2&&e1.collision.hitTest(e2.collision)){
  //
  //     }
  //     i++;
  //   }
  // }

  // console.log(i);

  // if(Math.floor(Math.random()*30)==0){
  //   let c=new Circle(Math.random()*1000-500,-500,100);
  //   c.body.setMass(5);
  //   c.body.restitution=0.3;
  //   c.body.velocity=this.player2.body.pos.sub(c.body.pos).normalize().scale(25);
  // }
  //
  // if(isMousePressed(1)){
  //   let angle=mousePos.sub(new Vector2d(display.getWidth()/2,display.getHeight()/2));
  //   let rad=Math.atan2(angle.y,angle.x);
  //   let c=new Box(this.player2.body.pos.x+Math.cos(rad)*50,this.player2.body.pos.y+Math.sin(rad)*50,50,5);
  //   c.body.setMass(5);
  //   c.body.restitution=3;
  //   c.body.velocity=angle.normalize().scale(15);
  // }
  uiManager.update();
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

MainGameState.prototype.render=function(display){
  // var mvMatrix=mat4.create();
  // mat4.identity(mvMatrix);
  // this.t.render(mvMatrix,this.game.camera.getProjection());
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
