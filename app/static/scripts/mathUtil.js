"use strict"

class Vector2d{

  constructor(x,y){
    var a=arguments;

    switch (a.length) {

      case 0:{
        this.x=0;
        this.y=0;
      }break;

      case 1:{
        this.x=x.x;
        this.y=x.y;
      }break;

      case 2:{
        this.x=x;
        this.y=y;
      }break;

      default:OverloadingException();

    }
  }

  set(x,y) {
    var a=arguments;
    switch (a.length) {
      case 1:{
        this.x=a[0].x;
        this.y=a[0].y;
      }break;

      case 2:{
        this.x=x;
        this.y=y;
      }break;

      default: OverloadingException();
    }
  }

  clone(v) {
    return new Vector2d(this.x,this.y);
  }

  add(v) {
    return new Vector2d(v.x + this.x, v.y + this.y);
  }

  addLocal(v) {
    this.x+=v.x;
    this.y+=v.y;
  }

  sub(v) {
    return new Vector2d(this.x - v.x, this.y - v.y);
  }

  subLocal(v) {
    this.x-=v.x;
    this.y-=v.y;
  }

  scale(s) {
    return new Vector2d(this.x * s, this.y * s);
  }

  scaleLocal(s) {
    this.x*=s;
    this.y*=s;
  }

  dot(v) {
    return (this.x * v.x + this.y * v.y);
  }

  /* Normally the vector cross product function returns a vector. But since we know that all our vectors will only be 2D (x and y only), any cross product we calculate will only have a z-component. Since we don't have a 3D vector class, let's just return the z-component as a scalar. We know that the x and y components will be zero. This is absolutely not the case for 3D. */
  cross(v) {
    return (this.x * v.y - this.y * v.x);
  }

  rotate(rad, vector) {

    var a=arguments;
    switch (a.length) {
      case 1:{
        //점을 0,0을 기준으로 rad만큼 돌린다.
        var x=this.x;
        var y=this.y;
        this.x = x * Math.cos(rad) - y * Math.sin(rad);
        this.y = x * Math.sin(rad) + y * Math.cos(rad);
      }break;

      case 2:{
        var x = this.x - vector.x;
        var y = this.y - vector.y;

        var x_prime = vector.x + ((x * Math.cos(rad)) - (y * Math.sin(rad)));
        var y_prime = vector.y + ((x * Math.sin(rad)) + (y * Math.cos(rad)));

        return new Vector2d(x_prime, y_prime);
      }break;

      default: OverloadingException();

    }

  }

  length() {
    return Math.sqrt(this.x*this.x+this.y*this.y);
  }

  lengthSquared() {
    return this.x*this.x+this.y*this.y;
  }

  normalize() {
    var length=this.length();
    if(length==0)
    console.error("length is 0");
    return new Vector2d(this.x/length,this.y/length);
  }

  normalizeLocal() {
    var length=this.length();
    if(length!=0){
      this.x/=length;
      this.y/=length;
    }
  }

}

Vector2d.cross=function(s,v){
  return new Vector2d(-s * v.y, s * v.x);
}

function Mat2d(){
  var a=arguments;
  switch (a.length) {
    case 0:{
      this.identity();
    }break;

    case 4:{
      this.m00=a[0];
      this.m01=a[1];
      this.m10=a[2];
      this.m11=a[3];
    }break;

    default:

  }
}

Mat2d.prototype.identity=function(){
  this.m00=1;this.m01=0;
  this.m10=0;this.m11=1;
}

Mat2d.prototype.clone=function(){
  return new Mat2d(this.m00,this.m01,this.m10,this.m11);
}

Mat2d.prototype.set=function(mat2d){
  this.m00=mat2d.m00;
  this.m01=mat2d.m01;
  this.m10=mat2d.m10;
  this.m11=mat2d.m11;
}

Mat2d.prototype.mul=function(v){
  return new Vector2d(v.x*this.m00+v.y*this.m01,v.x*this.m10+v.y*this.m11);
}

Mat2d.prototype.transpose=function(){
  var tM=new Mat2d();
  tM.m00 = this.m00;
  tM.m01 = this.m10;
  tM.m10 = this.m01;
  tM.m11 = this.m11;
  return tM;
}

Mat2d.prototype.setRotation=function(rad){
  this.m00=Math.cos(rad);
  this.m01=-Math.sin(rad);
  this.m10=Math.sin(rad);
  this.m11=Math.cos(rad);
}


function getAngle(){

  var a=arguments;

  var result;
  switch (a.length) {
    case 2:{
      var e1=a[0];
      var e2=a[1];

      result=Math.atan2((e2.pos.y-e1.pos.y),(e2.pos.x-e1.pos.x));
    }break;

    default:OverloadingException();

  }

  return result;
}

function clamp(x,min,max){
  if(x<=min)
    return min;
  if(max<=x)
    return max;
  return x;
}

function max(A,B){
  return (A>=B)?A:B;
}

function min(A,B){
  return (A<=B)?A:B;
}
