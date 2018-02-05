"use strict"

class GameText extends Entity{
  constructor(owner,name,x,y){
    super();
    this.owner=owner;
    this.fixedPos=new Vector2d(x,y);
    this.polygon=new Polygon(owner.body.pos.x+x,owner.body.pos.y+y);
    //body 크기 설정 // 직사각형만 해당
    var width=100*4;
    var height=10*4;
    this.body.width=width;
    this.body.height=height;

    this.polygon.setVertices([
      new Vector2d(-width/2,-height/2),
      new Vector2d(width/2,-height/2),
      new Vector2d(width/2,height/2),
      new Vector2d(-width/2,height/2),
    ]);
    this.body.owner=this.model.owner=this.collision.owner=this;
    this.model=new TextureModel(this,new Sprite(new Text(name)));
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

  update(){
    this.polygon.update();
    var p=this.owner.body.u.mul(this.fixedPos);
    this.body.pos.x=this.owner.body.pos.x+p.x;
    this.body.pos.y=this.owner.body.pos.y+p.y;
  }

  render(pMtrx) {
    this.polygon.render(pMtrx);
  }

  hitProcess(e){
  }

}
