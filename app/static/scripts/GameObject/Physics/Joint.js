"use strict"

class Joint {
  constructor(A, B, distance) {
    this.A = A;
    this.B = B;

    this.anchorPointA=new Vector2d(this.A.pos);
    this.anchorPointB=new Vector2d(this.B.pos);
    this.distance = distance;
  }

  applyImpulse(v) {
    this.A.applyImpulse(v, new Vector2d());
    this.B.applyImpulse(v.scale(-1), new Vector2d());
  }

  applyTorque(t) {
    this.A.applyTorque(t);
    this.B.applyTorque(t*-1);
  }

  solve() {
    var A = this.A;
    var B = this.B;
    var distance = this.distance;

    // get some information that we need
    var axis = B.pos.sub(A.pos);
    var currentDistance = axis.length();
    var unitAxis = axis.normalize();

    // calculate relative velocity in the axis, we want to remove this
    var relVel = B.velocity.sub(A.velocity).dot(unitAxis);

    var relDist = currentDistance - distance;

    // calculate impulse to solve
    var remove = relVel + relDist;
    var impulse = remove / (A.inv_mass + B.inv_mass);

    // generate impulse vector
    var I = unitAxis.scale(impulse);

    // apply
    this.applyImpulse(I);
  }
}
