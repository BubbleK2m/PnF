"use strict"

class Game{
  constructor(){
    this.camera=new Camera(new Vector2d(0,0),gl.viewportWidth,gl.viewportHeight);
    this.player;
    this.players=[];
    this.world=new World(new Rectangle(-1500,-1500,3000,3000));
    this.timer=0;
  }

  init(users){
    this.camera.setZoom(new Vector2d(1,1));
    this.camera.setPos(new Vector2d(0,0));

    this.player=new Player("TempName",Math.random()*500-250,0);
    this.world.addBody(this.player.body);
    var ground=new Polygon(0,400);
    ground.setVertices([
      new Vector2d(-1000,-50),
      new Vector2d(1000,-50),
      new Vector2d(1000,50),
      new Vector2d(-1000,50),
    ]);
    ground.setStatic();
    ground.setColor(0,0,0,0.5);
    ground.tag="ground";
    ground.body.rotateAngle=Math.PI*0.05;
    this.world.addBody(ground.body);

    ground=new Polygon(-1000,400);
    ground.setVertices([
      new Vector2d(-50,-1000),
      new Vector2d(50,-1000),
      new Vector2d(50,1000),
      new Vector2d(-50,1000),
    ]);
    ground.setStatic();
    ground.setColor(0,0,0,0.5);
    this.world.addBody(ground.body);

    ground=new Polygon(1000,400);
    ground.setVertices([
      new Vector2d(-50,-1000),
      new Vector2d(50,-1000),
      new Vector2d(50,1000),
      new Vector2d(-50,1000),
    ]);
    ground.setStatic();//setStatic은 항상 마지막에
    ground.setColor(0,0,0,0.5);
    this.world.addBody(ground.body);

    // let c=new Circle(0,0);
    // c.setRadius(50);
    // c.body.angularVelocity=0.1;
    // c.setStatic();
    // this.world.addBody(c.body);
  }

  reset(){
    Entity.clear();
    this.world=null;
  }

  update(){
    this.camera.follow(this.player.body,0.05);

    this.player.body.angularVelocity+=0.05*(-this.player.body.rotateAngle);

    this.world.update();

    Entity.updateAll();

    if(isKeyDown(65)){
      this.player.move(Math.PI);
    }

    if(isKeyDown(87)){
      this.player.jump(15);
    }

    if(isKeyDown(68)){
      this.player.move(0);
    }

    if(isKeyPressed(32)){
      // for(let i=0;i<5;i++){
      //   let p=new Polygon(this.player.nose.body.pos.x,this.player.nose.body.pos.y);
      //   p.setRegularPolygon(3,50);
      //   p.body.angularVelocity=1;
      //   p.body.setMass(4);
      //   let v=this.player.body.u.mul(this.player.nose.fixedPos).normalize().scale(50);
      //   p.body.applyForce(v);
      //   this.world.addBody(p.body);
      // }

      for(let i=0;i<1;i++){
        let c=new Circle(this.player.nose.body.pos.x,this.player.nose.body.pos.y,50);
        c.body.angularVelocity=1.1;
        // c.body.setMass(1);
        let v=this.player.body.u.mul(this.player.nose.fixedPos).normalize().scale(50);
        c.body.applyForce(v);
        this.world.addBody(c.body);
      }
    }

    //zoom
    if(isKeyPressed(90)){
      this.camera.setZoom(this.camera.zoomScale.add(new Vector2d(0.1,0.1)));
    }

    //unzoom
    if(isKeyPressed(88)){
      this.camera.setZoom(this.camera.zoomScale.add(new Vector2d(-0.1,-0.1)));
    }

  }

  messageProcess(message) {
    switch (message.Protocol) {

      case "DataSyncReport":{
        for(let p of this.players){
          if(p.name==message.UserID){
            p.body.pos.set(message.Pos.x,message.Pos.y);
            p.body.velocity.set(message.Velocity.x,message.Velocity.y);
          }
        }
      }break;

      case "UserInputReport":{
        for(let p of this.players){
          if(p.name==message.UserID)
            p.keys[message.KeyCode]=message.Value;
        }
      }break;

      default:console.log("UnknownProtocol",message);

    }
  }

  render(){
    Entity.renderAll(this.camera);
  }


}
