"use strict"
var STICKY_THRESHOLD=0.0004;
//상속함수
var inherit = (function(){
  var F = function(){};
  return function( Parent, Child ){
    let P=new Parent();
    F.prototype = P;
    Child.prototype = new F();
    Child.prototype.constructor = Child;

    if(P.remove!=null)
      P.remove();
    // console.log(Parent.prototype,Child.prototype);
  }
})();

class OverlodingTool{
  constructor(self){
    this.self=self;
    this.functionList={};
  }

  addFunction(f,parameterNum){
    this.functionList[parameterNum]=f;
  }

  execute(){
    this.functionList[arguments.length].apply(this.self,arguments);
  }

}

function hitTestPoint(uiCollision, point){
  //현재는 aabb만 지원
  return (uiCollision.pos.x<point.x&&point.x<uiCollision.pos.x+uiCollision.width&&
          uiCollision.pos.y<point.y&&point.y<uiCollision.pos.y+uiCollision.height);
}

function collisionProcess(self,other){

    // To find the side of entry calculate based on
    // the normalized sides
    if(other instanceof Entity){

      var dx = (other.body.pos.x - self.body.pos.x) / ((self.body.width+other.body.width)*0.5);
      var dy = (other.body.pos.y - self.body.pos.y) / ((self.body.height+other.body.height)*0.5);

      // Calculate the absolute change in x and y
      var absDX = Math.abs(dx);
      var absDY = Math.abs(dy);

      var newPos=self.body.pos.clone();

      // If the distance between the normalized x and y
      // position is less than a small threshold (.1 in this case)
      // then this object is approaching from a corner
      if (absDX > absDY) {

          // If the self is approaching from positive X
          if (dx < 0) {
              newPos.x = other.body.pos.x+(self.body.width+other.body.width)/2;
          } else {
              newPos.x = other.body.pos.x-(self.body.width+other.body.width)/2;
          }

          // Velocity component
          other.body.velocity.x+=self.body.velocity.x;
          self.body.velocity.x = -self.body.velocity.x * 0.5;

          if (Math.abs(self.body.velocity.x) < STICKY_THRESHOLD) {
              self.body.velocity.x = 0;
          }
      } else {

          // If the self is approaching from positive Y
          if (dy < 0) {
              newPos.y = other.body.pos.y+(self.body.height+other.body.height)/2;
          } else {
              newPos.y = other.body.pos.y-(self.body.height+other.body.height)/2;
          }

          // Velocity component
          other.body.velocity.y+=self.body.velocity.y;
          self.body.velocity.y = -self.body.velocity.y * 0.5;
          if (Math.abs(self.body.velocity.y) < STICKY_THRESHOLD) {
              self.body.velocity.y = 0;
          }
      }

      self.body.pos=newPos;

    }

}
