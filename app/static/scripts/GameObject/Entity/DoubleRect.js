"use strict"

class DoubleRect extends Entity {
  constructor(x, y, radius) {
    super();
    this.box = new Polygon(x, y + 1);
    this.box2 = new Polygon(x, y);

    // this.box.body.setMass(this.box.body.mass);

    this.spring = new Spring(this.box.body, this.box2.body, 150);
  }

  update() {
    this.box.update();
    this.box2.update();
    this.spring.solve();
  }

  render(camera) {
    this.box.render(camera);
    this.box2.render(camera);
  }

  hitProcess(e) {

  }
}
