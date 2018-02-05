"use strict"

class AnimationModel extends TextureModel{

  constructor(owner,sprite,startX,startY,width,height,maxFrame,frameDelay) {
     super(owner,sprite);
     if(!sprite.isSpriteSheet)
      console.error("SpriteSheet형태를 넣으시오");
     this.startX=startX;
     this.startY=startY;
     this.width=width;
     this.height=height;
     this.maxFrame=maxFrame;
     this.frameDelay=frameDelay;

     this.currentFrame=0;

     this.frameCounter=this.currentFrame*this.frameDelay;

     this.stop=true;
     this.loop=false;

     this.finishFunction;
  }

  start(){
    if(this.stop){
      this.stop=false;
    }
  }

  restart(){
    if(this.stop){
      this.stop=false;
    }
    this.frameCounter=0;
  }

  play(){
    if(this.stop){
      this.stop=false;
    }

    if(Math.floor((this.frameCounter+1)/this.frameDelay)>=this.maxFrame){
      this.frameCounter=0;
    }
  }

  stop(){
    if(!this.stop){
      this.stop=true;
      this.frameCounter=0;
    }
  }

  pause(){
    if(!this.stop){
      this.stop=true;
    }
  }

  render () {
    var a=arguments;
    switch (a.length) {
      case 2:{

        let pMtrx=a[0];
        let body=a[1];

        this.render(pMtrx,body.pos.x,body.pos.y,body.width,body.height,body.rotateAngle);

      }break;

      case 6:{
        let pMtrx=a[0];
        let x=a[1];
        let y=a[2];
        let width=a[3];
        let height=a[4];
        let rad=a[5];

        var mvMatrix=mat4.create();
        mat4.identity(mvMatrix);

        var translation = vec3.create();
        vec3.set(translation, x, y, 0);
        mat4.translate(mvMatrix, mvMatrix, translation);

        mat4.rotateZ(mvMatrix, mvMatrix, rad);

        var scale = vec3.create();
        if(this.isFlipped)
          width*=-1;

        vec3.set(scale, width, height, 1);
        mat4.scale(mvMatrix, mvMatrix, scale);

        let sx=(this.startX+this.currentFrame*this.width)/this.sprite.texture.getImageWidth();
        let sy=this.startY/this.sprite.texture.getImageHeight();
        let fx=sx+this.width/this.sprite.texture.getImageWidth();
        let fy=sy+this.height/this.sprite.texture.getImageHeight();

        this.sprite.texture.render(mvMatrix,pMtrx,sx,sy,fx,fy);
      }break;

      default: OverloadingException();

    }
  };

  update(){

    if(!this.stop){
      if(++this.frameCounter/this.frameDelay<this.maxFrame){
        this.currentFrame=Math.floor(this.frameCounter/this.frameDelay);
      }else{

        if(this.loop){
          this.frameCounter=0;
        }else{
          this.stop=true;
        }

        if(this.finishFunction!=null)
          this.finishFunction();
      }
    }
  }

}
