"use strict"

class TextureModel extends Model{
  constructor(owner,sprite){
    super(owner);

    this.sprite=sprite;
  }

  setSprite(sprite){
    this.sprite=sprite;
  }

  render(pMtrx,body) {
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

        this.sprite.render(mvMatrix,pMtrx);
      }break;

      default: OverloadingException();

    }
  }

}
