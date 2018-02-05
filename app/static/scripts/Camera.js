"use strict"

function Camera(pos,width,height){
  this.pos=pos;
  this.width=width;
  this.height=height;
  this.zoomScale=new Vector2d(1,1);
  this.projectionMatrix=mat4.create();
  //                                   -1000,-0   (실제 보여지는 z값은 -1000~0이다(0이 맨앞,-1000이 맨뒤))
  mat4.ortho(this.projectionMatrix,-this.width/2,this.width/2,this.height/2,-this.height/2,1000,0);
}

Camera.prototype.follow=function(entity,rate){
  this.pos.x+=(entity.pos.x-this.pos.x)*rate;
  this.pos.y+=(entity.pos.y-this.pos.y)*rate;
}

Camera.prototype.move=function(angle,speed){
  var rad=angle*Math.PI/180;
  this.pos.x+=Math.cos(rad)*speed;
  this.pos.y+=Math.sin(rad)*speed;
}

Camera.prototype.setPos=function(pos){
  this.pos=pos.clone();
}

Camera.prototype.setZoom=function(scale){
  this.zoomScale=scale.clone();
}

Camera.prototype.render=function(renderAble,x,y,width,height,rad){
  var mvMatrix=mat4.create();
  mat4.identity(mvMatrix);

  var translation = vec3.create();
  vec3.set(translation, x, y, 0);
  mat4.translate(mvMatrix, mvMatrix, translation);

  mat4.rotateZ(mvMatrix, mvMatrix, rad);

  var scale = vec3.create();
  vec3.set(scale, width, height, 1);
  mat4.scale(mvMatrix, mvMatrix, scale);

  renderAble.render(mvMatrix,this.getProjection());
}

Camera.prototype.getProjection=function(){
  var projection=mat4.clone(this.projectionMatrix);
  var translation = vec3.create();
  vec3.set(translation, -this.pos.x*this.zoomScale.x, -this.pos.y*this.zoomScale.y, 0);
  mat4.translate (projection, projection, translation);

  var scale = vec3.create();
  vec3.set(scale, this.zoomScale.x, this.zoomScale.y, 1);
  mat4.scale(projection, projection, scale);

  return projection;
}
