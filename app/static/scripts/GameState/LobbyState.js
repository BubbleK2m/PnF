"use strict"
class LobbyState extends GameState {

  constructor(){
    super();
    this.blankImage=TextureLoader.get("images/blankImage.png");
    this.currentPage=0;
    this.maxPage=1;
    this.roomList={"방이당":{length:5},"방이당2":{length:3}};
  }

  init() {
    //메인 판넬//백그라운드
    var mainPanel = new UIPanel(null, 0, 0, display.getWidth(), display.getHeight());

    var roomListPanel=new UIPanel(this.blankImage, 250, display.getHeight() / 2 - 300, 1200, 600);

    for(var i=0;i<8;i++){
      if(i<this.roomList.length){
        this.roomList[i];
        let x=i%4;
        let y=Math.floor(i/4);
        let smallPanel=new UIPanel(this.blankImage,x*100, y*100, 100, 100);
        let btn=new UIButton(this.blankImage, 0, 0, 10, 10, null);
        smallPanel.addComponent(btn);
        roomListPanel.addComponent(smallPanel);
      }
    }

    //빨리 넣을수록 아래로간다

    mainPanel.addComponent(roomListPanel);
    uiManager.addPanel(mainPanel);
  }

  reset() {
    uiManager.clear();
  }

  update() {
    uiManager.update();
  }

  render(display) {
    uiManager.render(display);
  }
}
