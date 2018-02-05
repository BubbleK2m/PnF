"use strict"

class Circle extends Entity{

  constructor(x, y, radius) {
    super();
    this.body = new Body(this);
    this.density=0.001;
    this.setRadius(radius);
    this.body.pos.x = x;
    this.body.pos.y = y;

    this.model = new TextureModel(this, Sprite.CIRCLE);

    this.collision = new CircleCollision(this, this.body);
    this.ordinal = 0;
  }

  computeMass(body, density) {
    body.mass = Math.PI * body.radius * body.radius * density;
    body.inv_mass = (body.mass) ? 1.0 / body.mass : 0.0;
    body.inertia = body.mass * body.radius * body.radius;
    body.inv_inertia = (body.inertia) ? 1.0 / body.inertia : 0.0;
  }

  setRadius(radius) {
    this.body.radius = radius;
    this.body.width = this.body.height = radius * 2;
    this.computeMass(this.body, this.density);
  }

  setStatic() {
    this.body.setMass(0);
    this.body.setInertia(0);
  }

  update() {
    this.body.update();
  }

  hitProcess(e) {

    // if(this.body.radius<40){
    //   this.setRadius((3-this.body.radius)*0.05+this.body.radius);
    //   if(this.body.radius<4)
    //     this.remove();
    // }else{
    //   this.remove();
    //   for(let i=0;i<2;i++){
    //     let c=new Circle(this.body.pos.x+Math.random()*200-100,this.body.pos.y+Math.random()*200-100,this.body.radius/2);
    //     c.body.restitution=3;
    //   }
    // }

    // if(this.body.radius>90){
    //   this.remove();
    //   for(let i=0;i<5;i++){
    //     let angle=360*i/5;
    //     let c=new Circle(this.body.pos.x+Math.cos(angle*Math.PI/180)*this.body.radius,this.body.pos.y+Math.sin(angle*Math.PI/180)*this.body.radius,10);
    //     c.body.accel=new Vector2d(15,15);
    //     c.body.move(angle);
    //     c.body.restitution=3;
    //   }
    // }else{
    //   this.setRadius((80-this.body.radius)*0.05+this.body.radius);
    //   if(this.body.radius>70)
    //     this.remove();
    // }


  }
}
