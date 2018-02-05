"use strict"

class Spring{//미완성이다// solve부분이 구현 미완료
  constructor(A,B,length){
    this.A=A;
    this.B=B;
    this.length=length;
    this.k=0.2;//스프링 상수//얼마나 스프링이 강한지 나타냄
    this.d=0.8;//댐핑량//감쇠할 비율
  }

  applyImpulse(v) {
    this.A.applyImpulse(v, new Vector2d());
    this.B.applyImpulse(v.scale(-1), new Vector2d());
  }

  solve(){
    var A = this.A;
    var B = this.B;
    var length = this.length;

    // get some information that we need
    var axis = B.pos.sub(A.pos);
    var currentDistance = axis.length();
    var unitAxis = axis.normalize();

    // calculate relative velocity in the axis, we want to remove this
    var relVel = B.velocity.sub(A.velocity).dot(unitAxis);

    var relDist = currentDistance - length;

    var impulse = (-this.k*relDist-this.d*relVel) / (A.inv_mass + B.inv_mass);
    console.log(impulse);
    // F = -kx-cv

    // generate impulse vector
    var I = unitAxis.scale(impulse);

    // apply
    this.applyImpulse(I);
  }
}
