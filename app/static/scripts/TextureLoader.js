"use strict"

var TextureLoader=(function(){
  var self=function(){
    this.list={};
  }

  self.prototype.load=function(src){
    this.list[src]=new Texture(src);
  }

  self.prototype.get=function(src){
    return this.list[src];
  }

  return new self();
}());

TextureLoader.load("/static/images/blankImage.png");
TextureLoader.load("/static/images/cloud.png");
TextureLoader.load("/static/images/bat.png");
TextureLoader.load("/static/images/cuby.png");
TextureLoader.load("/static/images/circle.png");
TextureLoader.load("/static/images/Pig1-Sheet.png");
TextureLoader.load("/static/images/P&F-Sprite.png");

Sprite.PAF_LOGO=new Sprite(TextureLoader.get("/static/images/P&F-Sprite.png"),0,0,556,335,true);
Sprite.BROWN=new Sprite(TextureLoader.get("/static/images/P&F-Sprite.png"),0,335/1024,87/1024,422/1024);
Sprite.YELLOW=new Sprite(TextureLoader.get("/static/images/P&F-Sprite.png"),0,0,1,1);
Sprite.SLIGHTLY_GRAY=new Sprite(TextureLoader.get("/static/images/P&F-Sprite.png"),0,0,1,1);
Sprite.GREEN=new Sprite(TextureLoader.get("/static/images/P&F-Sprite.png"),261,335,348,422,1);
Sprite.BEIGE=new Sprite(TextureLoader.get("/static/images/P&F-Sprite.png"),0,0,1,1);
Sprite.WHITE=new Sprite(TextureLoader.get("/static/images/P&F-Sprite.png"),0,0,1,1);
Sprite.GRAY=new Sprite(TextureLoader.get("/static/images/P&F-Sprite.png"),0,0,1,1);
