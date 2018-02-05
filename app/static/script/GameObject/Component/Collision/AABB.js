"use strict"

function AABB(owner,body){
  Collision.apply(this,[owner]);
  this.pos=new Vector2d();
  this.pos.set(body.pos);
  this.width=body.width;
  this.height=body.height;
}

inherit(Collision,AABB);

AABB.prototype.setBound=function(x,y,width,height){
  this.pos.set(x,y);
  this.width=width;
  this.height=height;
}

// var setPos=new OverlodingTool();
//
// setPos.addFunction(function(v){
//   this.pos.set(v);
// },1);
//
// setPos.addFunction(function(x,y){
//   this.pos.set(x,y);
// },2);

AABB.prototype.setPos=function(v){
  // setPos.self=this;
  // setPos.execute(arguments);
  this.pos.set(v);
}

AABB.prototype.hitTest=function(collision){
  if(collision instanceof AABB)
    return AABBvsAABB(this.owner.body,collision.owner.body);
}

function AABBvsAABB(A,B)
{

  var normal;
  var penetration;

  // Vector from A to B
  var n = B.pos.sub(A.pos);

  // Calculate half extents along x axis for each object
  let a_extent = A.width/2;
  let b_extent = B.width/2;

  // Calculate overlap on x axis
  var x_overlap = a_extent + b_extent - Math.abs( n.x );

  // SAT test on x axis
  if(x_overlap > 0)
  {
    // Calculate half extents along x axis for each object
    let a_extent = A.height/2;
    let b_extent = B.height/2;

    // Calculate overlap on y axis
    var y_overlap = a_extent + b_extent - Math.abs( n.y );

    // SAT test on y axis
    if(y_overlap > 0)
    {
      // Find out which axis is axis of least penetration
      if(x_overlap < y_overlap)
      {
        // Point towards B knowing that n points from A to B
        if(n.x < 0)
          normal = new Vector2d(-1,0);
        else
          normal = new Vector2d(1,0);
        penetration = x_overlap;
      }
      else
      {
        // Point toward B knowing that n points from A to B
        if(n.y < 0)
          normal = new Vector2d( 0, -1);
        else
          normal = new Vector2d( 0, 1 );
        penetration = y_overlap;
      }
    }
    else
      return false;
  }
  else
    return false;

  if(normal!=undefined&&penetration!=undefined){
    PositionalCorrection(A,B,normal,penetration);
    ResolveCollision(A,B,normal);
  }

  return true;
}
