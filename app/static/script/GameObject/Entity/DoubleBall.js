"use strict"

class DoubleBall extends Entity{

  constructor(x, y, radius) {
    super();
    this.circle=new Circle(x,y+1,radius);
    this.circle2=new Circle(x,y,radius);

    this.joint=new Joint(this.circle.body,this.circle2.body,150);
  }

  update() {
    this.circle.update();
    this.circle2.update();
    this.joint.solve();
  }

  render(camera) {
    this.circle.render(camera);
    this.circle2.render(camera);
  }

  hitProcess(e) {

  }
}
