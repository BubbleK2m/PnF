"use strict"

function Polygon(x,y){
  Entity.apply(this,[]);
  this.ordinal=1;

  /**
   * @see 각도가 0일때 기준의 상대좌표
   * @see 입력순서는 무조건 시계방향
   * @see 다만 좌표계는 윈도우 좌표계이다(y가 아래로갈수록 증가한다.)
   * @see 그리고 볼록한 물체만 충돌 감지가 가능하다.
   */
  var vertices=[
    // new Vector2d(100,100),
    // new Vector2d(150,0),
    // new Vector2d(100,-100),
    // new Vector2d(-100,-100),
    // new Vector2d(-150,0),
    // new Vector2d(-100,100),

    // new Vector2d(0,-100),
    // new Vector2d(50*1.732,50),
    // new Vector2d(-50*1.732,50),

    new Vector2d(-50,-50),
    new Vector2d(50,-50),
    new Vector2d(50,50),
    new Vector2d(-50,50),
  ];
  //기본 body위치 설정
  this.body=new Body(this,vertices);
  this.body.pos.x=x;
  this.body.pos.y=y;
  //width,height는 폴리곤에서는 기본적으로 1로설정한다.(안해도 됨)//쿼드트리에서 차지 영역 계산할때 사용
  this.body.width=1;
  this.body.height=1;

  this.density=0.1;
  //무게및 관성력 계산
  this.computeMass(this.body,this.density);

  this.model=new PolygonModel(this,this.body);

  this.collision=new PolygonCollision(this,this.body);
}

inherit(Entity,Polygon);

Polygon.prototype.computeMass=function(body,density){
  // Calculate centroid and moment of interia
  let c=new Vector2d(0,0);//중심
  let area=0;
  const k_inv3=1.0/3.0;

  let I=0;
  for(let i=0;i<body.vertices.length;i++){
    let p1=body.vertices[i];
    let p2=body.vertices[i + 1 == body.vertices.length ? 0 : i + 1];

    //2d cross product
    let D = p1.cross(p2);
    let triangleArea = 0.5 * D;

    area+=triangleArea;

    // Use area to weight the centroid average, not just vertex position
    //c += triangleArea * k_inv3 * (p1 + p2);
    c.addLocal(p1.add(p2).scale(triangleArea*k_inv3));

    let intx2 = p1.x * p1.x + p2.x * p1.x + p2.x * p2.x;
    let inty2 = p1.y * p1.y + p2.y * p1.y + p2.y * p2.y;
    I += (0.25 * k_inv3 * D) * (intx2 + inty2);
  }

  // c.scale(1.0 / area);

  // Translate vertices to centroid (make the centroid (0, 0)
  // for the polygon in model space)
  // Not really necessary, but I like doing this anyway
  // for(let i = 0; i < body.vertices.length; ++i)
  //   body.vertices[i].subLocal(c);

  body.mass = density * area;
  body.inv_mass = (body.mass) ? 1.0 / body.mass : 0.0;
  body.inertia = I * density;
  body.inv_inertia = body.inertia ? 1.0 / body.inertia : 0.0;

  body.inertia=12000;
  body.inv_inertia=1/12000;
}

Polygon.prototype.setVertices = function (vertices) {
  for(let i=0;i<vertices.length;i++){
    this.body.vertices[i]=vertices[i];
  }
  if(this.body.vertices.length>vertices.length)
    this.body.vertices.splice(vertices.length,this.body.vertices.length);

  var verticesData=[];
  for(let i=0;i<this.model.vertices.length;i++){
    verticesData.push(this.model.vertices[i].x);
    verticesData.push(this.model.vertices[i].y);
    verticesData.push(0);
  }
  this.model.renderAble.setVertices(verticesData);

  var indicesData=[];
  for(let i=0;i<this.model.vertices.length-2;i++){
    indicesData.push(0);
    indicesData.push(i+1);
    indicesData.push(i+2);
  }
  this.model.renderAble.setIndices(indicesData);
};

Polygon.prototype.setRegularPolygon = function (verticesNum,radius) {
  var vertices=[];
  for(let i=0;i<verticesNum;i++){
    vertices.push(new Vector2d(Math.cos(i*2*Math.PI/verticesNum+Math.PI*1.5)*radius,Math.sin(i*2*Math.PI/verticesNum+Math.PI*1.5)*radius));
  }

  this.setVertices(vertices);

  //원래는 1에 해당하는 자리에 변수가 들어가야함 [density]
  this.computeMass(this.body,this.density);
};

Polygon.prototype.setStatic = function () {
  this.body.setMass(0);
  this.body.setInertia(0);
};

Polygon.prototype.setColor = function (r,g,b,a) {
  this.model.renderAble.setColor(r,g,b,a);
};

Polygon.prototype.update=function(){
  this.body.update();
}
