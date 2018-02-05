// "use strict"

(function(w){
  class TextureLoader{

    constructor(srcList,callback){
      this.list={};
      this.srcList=srcList;
      this.loadingNum=0;
      this.loadComplete=callback;

      this.loadAllImage();

      var me=this;

      var timer = setInterval(function() {
           if (me.loadingNum == me.srcList.length) {
                clearInterval(timer);
                //모든 이미지 로딩이 끝나면 최종적으로 텍스쳐를 로딩하고
                me.loadAllTexture();
                //끝났을시 실행할 함수를 실행
                me.loadComplete();
           }else{
             console.log("로딩중...",me.loadingNum);
           }
      }, 10);

    }

    loadAllImage(){
      var me=this;

      for(let i=0;i<this.srcList.length;i++){
        let image=new Image();
        image.onload=function(){
          me.loadingNum++;
        };
        image.src=this.srcList[i];
        this.list[this.srcList[i]]=image;
      }

    }

    loadAllTexture(){

      for(let i=0;i<this.srcList.length;i++){
        this.list[this.srcList[i]]=new Texture(this.list[this.srcList[i]]);
      }

    }

    get(src){
      return this.list[src];
    }

  }

  w.TextureLoader=new TextureLoader(["/static/images/blankImage.png",
                  "/static/images/cloud.png",
                  "/static/images/Pig1-Sheet.png",
                  "/static/images/P&F-Sprite.png",
                  "/static/images/circle.png"
                ],function(){
                  console.log("로딩 완료");
                  //main.js에 있다.
                  init();
                });
}(window));
