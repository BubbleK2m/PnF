"use strict"

function Body(owner, vertices) {
  Component.apply(this, [owner]);

  this.bound = new Rectangle(0,0,100,100);
  //텍스쳐 렌더링할대 쓰는 변수
  this.width = 100;
  this.height = 100;
  //
  this.radius = 50;

  this.vertices = vertices;

  this.pos = new Vector2d();
  this.velocity = new Vector2d();
  this.force = new Vector2d();

  // Angular components
  this.rotateAngle = 0; // radians
  this.angularVelocity = 0;
  this.torque = 0;

  this.u = new Mat2d();

  this.mass = 1;
  this.inv_mass = 1 / this.mass;
  this.restitution = 0.5;

  this.inertia = 1;
  this.inv_inertia = 1/this.inertia;

  this.staticFriction = 0.5*2;
  this.dynamicFriction = 0.3*2;
}

inherit(Component, Body);

//각도는 적용하지않는다.
Body.prototype.getNormal = function(index) {
  var i = index;

  let p1 = this.vertices[i];
  // get the next vertex
  let p2 = this.vertices[i + 1 == this.vertices.length ? 0 : i + 1];

  // subtract the two to get the edge vector
  var edge = p1.sub(p2);

  // ===== 1. 지금 교차하는지 본다 =====
  // 지금 변에 수직인 축을 찾는다//시계방향
  var axis = new Vector2d(-edge.y, edge.x);
  axis.normalizeLocal();

  return axis;
}

Body.prototype.getSupport = function(dir) {
  var bestProjection = -Number.MAX_VALUE;
  var bestVertex = null;

  for (let i = 0; i < this.vertices.length; ++i) {
    let v = this.vertices[i];
    let projection = v.dot(dir);

    if (projection > bestProjection) {
      bestVertex = v;
      bestProjection = projection;
    }
  }

  return bestVertex;
}

Body.prototype.applyForce = function(f) {
  // force += f;
  this.force.addLocal(f);
}

Body.prototype.applyTorque = function(t) {
  // force += f;
  this.torque+=t;
}

Body.prototype.applyImpulse = function(impulse, contactVector) {
  this.velocity.addLocal(impulse.scale(this.inv_mass));
  this.angularVelocity += this.inv_inertia * contactVector.cross(impulse);
}

Body.prototype.update = function() {
  this.u.setRotation(this.rotateAngle);
  //aabb 경계구역 설정
  if (this.owner.ordinal != 0) {
    let vertex = this.pos.add(this.u.mul(this.vertices[0]));
    let minX = vertex.x;
    let minY = vertex.y;
    let maxX = vertex.x;
    let maxY = vertex.y;
    for (let i = 0; i < this.vertices.length; i++) {
      vertex = this.pos.add(this.u.mul(this.vertices[i]));
      if (vertex.x < minX) {
        minX = vertex.x;
      }
      if (vertex.x > maxX) {
        maxX = vertex.x;
      }
      if (vertex.y < minY) {
        minY = vertex.y;
      }
      if (vertex.y > maxY) {
        maxY = vertex.y;
      }
    }
    this.bound.set(minX, minY, maxX - minX, maxY - minY);
  } else {
    let x = this.pos.x - this.width / 2;
    let y = this.pos.y - this.height / 2;
    this.bound.set(x, y, this.width, this.height);
  }
}

Body.prototype.setMass = function(mass) {
  if (mass != 0) {
    this.mass = mass;
    this.inv_mass = 1 / this.mass;
    return;
  }
  this.mass = 0;
  this.inv_mass = 0;
}

Body.prototype.setInertia = function(inertia) {
  if (inertia != 0) {
    this.mass = inertia;
    this.inv_mass = 1 / this.mass;
    return;
  }
  this.inertia = 0;
  this.inv_inertia = 0;
}
