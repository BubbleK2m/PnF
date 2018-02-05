"use strict"

class Sprite{
  constructor(texture,sx,sy,fx,fy,flag){//flag가 false 또는 null이면 0~1의 일반 좌표, true이면 실제좌표값
    this.texture=texture;
    this.isSpriteSheet=false;

    var a=arguments

    switch (a.length) {

      case 1:{
        if(a[0] instanceof Text){
          let text=a[0];
          this.texture=new Texture(text);
          this.sx=0;
          this.sy=0;
          this.fx=this.texture.textWidth/getPowerOfTwo(this.texture.textWidth);
          this.fy=this.texture.textHeight/getPowerOfTwo(this.texture.textHeight);
        }else{
          this.sx=0;
          this.sy=0;
          this.fx=1;
          this.fy=1;
          this.isSpriteSheet=true;
        }
      }break;

      case 5:{
        this.sx=sx;
        this.sy=sy;
        this.fx=fx;
        this.fy=fy;
      }break;

      case 6:{
        if(flag){
          let w=this.texture.getImageWidth();
          let h=this.texture.getImageHeight();
          this.sx=sx/w;
          this.sy=sy/h;
          this.fx=fx/w;
          this.fy=fy/h;
        }else{
          console.error("Sprite 인자가 잘못됨");
        }
      }break;

      default: OverloadingException();

    }
  }

  //스프라이트의 실제 가로길이를 리턴//이미지의 가로길이 아님
  getWidth(){
    let w=this.texture.getImageWidth();
    return (this.fx-this.sx)*w;
  }

  getHeight(){
    let h=this.texture.getImageHeight();
    return (this.fy-this.sy)*h;
  }

  setUV(sx,sy,fx,fy){
    this.sx=sx;
    this.sy=sy;
    this.fx=fx;
    this.fy=fy;
  }

  render(mvMatrix,pMtrx){
    this.texture.render(mvMatrix,pMtrx,this.sx,this.sy,this.fx,this.fy);
  }
}
