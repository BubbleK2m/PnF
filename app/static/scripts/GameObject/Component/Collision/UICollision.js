"use strict"

class UICollision extends Collision{

  constructor(owner,body){
    super(owner);
    this.pos=new Vector2d();
    this.pos.set(owner.getX(),owner.getY());
    this.width=body.width;
    this.height=body.height;
  }

  setBound(x,y,width,height){
    this.pos.set(x,y);
    this.width=width;
    this.height=height;
  }

  setPos(x,y){
    this.pos.set(x,y);
  }

}
