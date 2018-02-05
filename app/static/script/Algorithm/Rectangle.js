"use strict"

function Rectangle(x,y,width,height){
  this.pos=new Vector2d(x,y);
  this.width=width;
  this.height=height;
}

Rectangle.prototype.set=function(x,y,width,height){
  this.pos.set(x,y);
  this.width=width;
  this.height=height;
}

Rectangle.prototype.getX=function(){
  return this.pos.x;
}

Rectangle.prototype.getY=function(){
  return this.pos.y;
}

Rectangle.prototype.getWidth=function(){
  return this.width;
}

Rectangle.prototype.getHeight=function(){
  return this.height;
}
