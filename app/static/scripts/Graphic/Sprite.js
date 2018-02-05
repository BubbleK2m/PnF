"use strict"

class Sprite{
  constructor(spriteSheet,sx,sy,fx,fy,flag){//flag가 false 또는 null이면 0~1의 일반 좌표, true이면 실제좌표값
    this.spriteSheet=spriteSheet;
    if(flag==null||flag==false){
      this.sx=sx;
      this.sy=sy;
      this.fx=fx;
      this.fy=fy;
    }else if(flag){
      let w=this.spriteSheet.getImageWidth();
      let h=this.spriteSheet.getImageHeight();
      this.sx=sx/w;
      this.sy=sy/h;
      this.fx=fx/w;
      this.fy=fy/h;
    }
  }

  setUV(sx,sy,fx,fy){
    this.sx=sx;
    this.sy=sy;
    this.fx=fx;
    this.fy=fy;
  }

  render(mvMatrix,pMtrx){
    this.spriteSheet.render(mvMatrix,pMtrx,this.sx,this.sy,this.fx,this.fy);
  }
}
