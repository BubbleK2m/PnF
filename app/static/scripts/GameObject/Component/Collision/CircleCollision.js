"use strict"

function CircleCollision(owner,body){
  Collision.apply(this,[owner]);
  this.body=body;
}

inherit(Collision,CircleCollision);

CircleCollision.prototype.hitTest=function(collision){
  if(collision instanceof CircleCollision)
    return CirclevsCircle(this.owner.body,collision.owner.body);
  if (collision instanceof PolygonCollision)
    return CirclevsPolygon(this.owner.body, collision.owner.body);
}

function CirclevsCircle(m,A,B)
{

  // Vector from A to B
  var n = B.pos.sub(A.pos);

  var r = A.radius + B.radius;
  var r2=r*r;

  if(n.lengthSquared() > r2){
    m.contactCount=0;
    return;
  }

  // Circles have collided, now compute manifold
  var d = n.length() // perform actual sqrt

  m.contactCount=1;

  // Circles are on same position
  if(d == 0)
  {
    // Choose random (but consistent) values
    m.penetration = A.radius;
    m.normal = new Vector2d(1,0);
    m.contacts[0].set(A.pos);
  }
  else// If distance between circles is not zero
  {
    // Distance is difference between radius and distance
    m.penetration = r - d;

    // Utilize our d since we performed sqrt on it already within Length( )
    // Points from A to B, and is a unit vector
    m.normal.set(n.scale(1/d));
    m.contacts[0].set(m.normal.scale(A.radius).add(A.pos));
  }

}
