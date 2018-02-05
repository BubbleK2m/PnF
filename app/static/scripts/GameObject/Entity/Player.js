"use strict"
class Player extends Entity{
  constructor(x,y){
    //263*203
    super();
    this.tag="player";
    this.polygon=new Polygon(x,y);
    //body 크기 설정 // 직사각형만 해당
    var width=140;
    var height=100;
    this.body.width=width;
    this.body.height=height;

    this.polygon.setVertices([
      new Vector2d(-width/2,-height/2),
      new Vector2d(width/2,-height/2),
      new Vector2d(width/2,height/2),
      new Vector2d(-width/2,height/2),
    ]);

    //ordinal 설정및 owner 재설정
    this.ordinal=1;
    this.body.owner=this.model.owner=this.collision.owner=this;

    this.nose=new PigNose(this,200,0);

    this.idleAni=new AnimationModel(this,TextureLoader.get("images/Pig1-Sheet.png"),0,17,949/4,143,4,30);
    this.idleAni.loop=true;
    this.walkAni=new AnimationModel(this,TextureLoader.get("images/Pig1-Sheet.png"),2868,18,949/4,153,4,6);

    this.walkAni.finishFunction=(function(self){
      return function(){
        if(!self.isMoving){
          self.model=self.idleAni;
          self.idleAni.restart();
        }
      }
    }(this));

    this.hurtAni=new AnimationModel(this,TextureLoader.get("images/Pig1-Sheet.png"),118,130,79/3,19,3,8);
    this.hurtAni.finishFunction=(function(self){
      return function(){
        self.model=self.idleAni;
        self.idleAni.start();
      }
    }(this));

    //애니메이션 모델은 수시로 바뀌므로 렌더링할때 직접 호출을 한다.
    this.model=this.idleAni;
    this.model.start();

    this.jumpCount=0;
    this.maxJumpCount=1;

    this.maxSpeed=5;

    this.isMoving=false;
  }

  get body(){
    if(this.polygon==undefined)
      return null;
    return this.polygon.body;
  }

  get model(){
    if(this.polygon==undefined)
      return null;
    return this.polygon.model;
  }

  get collision(){
    if(this.polygon==undefined)
      return null;
    return this.polygon.collision;
  }

  set model(model){
    this.polygon.model=model;
  }

  setFlip(value){
    this.hurtAni.isFlipped=value;
    this.idleAni.isFlipped=value;
    this.walkAni.isFlipped=value;
    this.nose.setFlip(value);
  }

  jump(amount){
    if(this.body.velocity.y>=0&&this.jumpCount<this.maxJumpCount){
      this.jumpCount++;
      this.body.velocity.y-=amount;
    }
  }

  move(rad) {
    this.isMoving=true;
    this.model=this.walkAni;
    this.walkAni.play();
    if(Math.abs(this.body.velocity.x)>this.maxSpeed)
      return;
    Player.SPEED.rotate(rad);
    this.body.applyForce(Player.SPEED);
    if(Math.PI/2<rad&&rad<Math.PI*1.5)
      this.setFlip(true);
    else
      this.setFlip(false);
    Player.SPEED.rotate(-rad);
  }

  update(){
    this.model.update();
    this.polygon.update();
    this.nose.update();
    this.isMoving=false;
  }

  render(pMtrx) {
    this.nose.render(pMtrx);
    super.render(pMtrx);
  }

  hitProcess(e){
    // if(e.tag=="ground")
      this.jumpCount=0;
    // this.model=this.hurtAni;
    // this.model.play();
  }
}
Player.SPEED=new Vector2d(1,0);
