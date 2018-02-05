"use strict"

class Game{
  constructor(){
    this.camera=new Camera(new Vector2d(0,0),gl.viewportWidth,gl.viewportHeight);
    this.players=[];
    this.world=new World(new Rectangle(-1500,-1500,3000,3000));
  }

  init(){
    this.camera.setZoom(new Vector2d(1,1));
    this.camera.setPos(new Vector2d(0,0));

    this.player=new Player(0,0);
    this.player.body.setMass(1);
    this.player.body.restitution=0.3;
    this.world.addBody(this.player.body);

    this.player2=new Polygon(0,0);
    this.player2.body.setMass(4);
    this.player2.body.restitution=0.3;
    this.player2.setColor(1,0,0,0.5);
    this.world.addBody(this.player2.body);

    // this.player2=new Polygon(350,0);
    // this.player2.body.angularVelocity=0.01;
    // this.player2.setColor(0,1,1,1);
    // this.player2.setRegularPolygon(3,100);
    // this.player2.body.setMass(1);
    // this.world.addBody(this.player2.body);

    var ground=new Polygon(0,400);
    ground.setStatic();
    ground.setVertices([
      new Vector2d(-1000,-50),
      new Vector2d(1000,-50),
      new Vector2d(1000,50),
      new Vector2d(-1000,50),
    ]);
    ground.setColor(0,0,0,0.5);
    ground.tag="ground";
    ground.body.rotateAngle=Math.PI*0.05;
    this.world.addBody(ground.body);

    ground=new Polygon(-1000,400);
    ground.setStatic();
    ground.setVertices([
      new Vector2d(-50,-1000),
      new Vector2d(50,-1000),
      new Vector2d(50,1000),
      new Vector2d(-50,1000),
    ]);
    ground.setColor(0,0,0,0.5);
    this.world.addBody(ground.body);

    ground=new Polygon(1000,400);
    ground.setStatic();
    ground.setVertices([
      new Vector2d(-50,-1000),
      new Vector2d(50,-1000),
      new Vector2d(50,1000),
      new Vector2d(-50,1000),
    ]);
    ground.setColor(0,0,0,0.5);
    this.world.addBody(ground.body);

    // let c=new Circle(0,0);
    // c.setRadius(50);
    // c.body.angularVelocity=0.1;
    // c.setStatic();
    // this.world.addBody(c.body);

    let x=Math.random()*1000-500;
    let y=Math.random()*1000-500;

    // for(let i=0;i<5;i++){
    //   let p=new Polygon(x,y);
    //   p.setRegularPolygon(3+i,100);
    //   p.body.setMass(1);
    //   this.world.addBody(p.body);
    // }
  }

  reset(){
    Entity.clear();
    this.world=null;
  }

  update(){

    // var length=150;
    // var pos=new Vector2d(0,-1200);
    // var k=0.001;
    // pos.subLocal(this.player.body.pos);
    // var currentLength=pos.length();
    // pos.normalizeLocal();
    // var stretch=length-currentLength;
    //
    // this.player.body.applyForce(pos.scale(-k*stretch));
    this.player.body.angularVelocity+=0.05*(-this.player.body.rotateAngle);

    this.world.update();

    Entity.updateAll();

    if(isKeyDown(65)){
      this.player.move(Math.PI);
    }

    if(isKeyDown(87)){
      this.player.jump(12);
    }

    if(isKeyDown(68)){
      this.player.move(0);
    }

    if(isKeyPressed(32)){
      // for(let i=0;i<5;i++){
        // let p=new Polygon(this.player.nose.body.pos.x,this.player.nose.body.pos.y);
        // p.setRegularPolygon(3,50);
        // p.body.angularVelocity=1;
        // p.body.setMass(4);
        // let v=this.player.body.u.mul(this.player.nose.fixedPos).normalize().scale(50);
        // p.body.applyForce(v);
        // this.world.addBody(p.body);
      // }

      for(let i=0;i<1;i++){
        let c=new Circle(this.player.nose.body.pos.x,this.player.nose.body.pos.y);
        c.setRadius(10);
        // c.body.angularVelocity=1.1;
        c.body.setMass(1);
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

    //p2


    if(isKeyDown(37)){
      this.player2.body.applyForce(new Vector2d(-4,0));
    }

    if(isKeyDown(38)){
      this.player2.body.force.y=-4;
    }

    if(isKeyDown(39)){
      this.player2.body.force.x=4;
    }

    if(isKeyDown(40)){
      this.player2.body.force.y=4;
    }
  }

  render(){
    Entity.renderAll(this.camera);
  }


}
