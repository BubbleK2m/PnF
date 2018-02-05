"use strict"
function UIManager(){
  this.panels=[];
}

UIManager.prototype.clear=function(){
  this.panels=[];
}

UIManager.prototype.addPanel=function(panel){
  this.panels.push(panel);
}

UIManager.prototype.render=function(display){
  for(var panel of this.panels){
    panel.render(display);
  }
}

UIManager.prototype.update=function(){
  for(var panel of this.panels){
    panel.update();
  }
}

UIManager.prototype.keyDown=function(e){
  //이벤트가 발생하지 않은 이유는 component가 uiPanel인 경우를 간과해서이다.
  for(var panel of this.panels){
    this.loopComponent(panel,e);
  }
}

UIManager.prototype.loopComponent=function(component,e){
  if(component instanceof UIPanel){
    for(var c of component.components)
      this.loopComponent(c,e);
  }else{
    if(component instanceof UITextField)
      component.keyDown(e);
  }
}

UIManager.prototype.keyUp=function(e){
  for(var panel of this.panels){
    for(var component of panel.components){
      if(component instanceof UITextField)
        component.keyUp(e);
    }
  }
}

UIManager.prototype.isKeyUp=function(e){
  for(var panel of this.panels){
    panel.update();
  }
}





//UIComponent





class UIComponent extends GameObject{
  constructor(sprite,x,y,width,height){
    super();
    this.id=Math.random();
    if(sprite!=null)
        this.model=new TextureModel(this,sprite);

    //local 좌표//렌더링용//기본적으로 입력한값을 토대로 왼쪽 상단을 기준으로 잡는다.
    this.body=new UIBody(this);
    this.body.pos.x=x+width/2;
    this.body.pos.y=y+height/2;
    this.body.width=width;
    this.body.height=height;

    //월드 좌표
    this.collision=new UICollision(this,this.body);

    this.panel;

  }

  setTexture(){
    this.model.setTexture.apply(this.model,arguments);
  }

  setUV(){
    this.model.setUV.apply(this.model,arguments);
  }

  init(uiPanel){
    this.panel=uiPanel;
    this.collision.setPos(this.panel.collision.pos.x+this.getX(),this.panel.collision.pos.y+this.getY());
  }

  //Body의 pos는 실제 모델좌표의 중심, 실제 사용할때는 아래 메서드 사용하여 왼쪽상단의 좌표를 리턴해준다//UI는 무조건 왼쪽상단이 기준
  getX(){
    return this.body.pos.x-this.body.width/2;
  }

  getY(){
    return this.body.pos.y-this.body.height/2;
  }

  getWorldX(){
    var sum=0;
    for(let component=this;component.panel!=null;component=component.panel){
      sum+=component.getX();
    }

    return sum;
  }

  getWorldY(){
    var sum=0;
    for(let component=this;component.panel!=null;component=component.panel){
      sum+=component.getY();
    }

    return sum;
  }

  //body의 실제 좌표는 중심좌표//collision는 왼쪽 상단
  setX(x){
    this.body.pos.x=x+this.body.width/2;
  }

  setY(y){
    this.body.pos.y=y+this.body.height/2;
  }

  render(display, xOffset, yOffset){
    this.model.render(display.getProjection(),xOffset+this.body.pos.x,yOffset+this.body.pos.y,this.body.width,this.body.height,this.body.rotateAngle);
  }

  update(){
    //collision bound 업데이트
    this.collision.setBound(this.getWorldX(),this.getWorldY(),this.body.width,this.body.height);
  }

}



//UIPanel



class UIPanel extends UIComponent{
  constructor(sprite,x,y,width,height){
    super(sprite,x,y,width,height);
    this.components=[];
    this.hasTexture;
    if(sprite!=null)this.hasTexture=true;
          else this.hasTexture=false;
  }

  addComponent(component){
    component.init(this);
    this.components.push(component);
  }

  clear(){
    this.components=[];
  }

  //루트 판넬일때만
  render(display,xOffset,yOffset){
    var a=arguments;
    switch (a.length) {
      case 1:{
        if(this.hasTexture)//offset을 0으로 설정
          super.render(display,0,0);

        for(var i in this.components){
          this.components[i].render(display,this.getX(),this.getY());
        }
      }break;

      case 3:{
        if(this.hasTexture)
          super.render(display,xOffset,yOffset);

        for(var i in this.components){
          this.components[i].render(display,xOffset+this.getX(),yOffset+this.getY());
        }
      }break;

      default: OverloadingException();

    }

  }

  update(){
    super.update();
    for(var i in this.components){
      this.components[i].update();
    }
  }

}
