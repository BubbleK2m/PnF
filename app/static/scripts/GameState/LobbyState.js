"use strict"
class LobbyState extends GameState {

  constructor(){
    super();
    this.currentPage=0;
    this.roomList={};
    this.maxPage=Math.floor((Object.keys(this.roomList).length-1)/8);
  }

  reloadFunc(roomListPanel){
    var self=this;

    var startX=50;
    var startY=30;
    var width=250;
    var height=250;
    var xMargin=30;
    var yMargin=30;

    roomListPanel.clear();
    //누를때마다 설정된 페이지대로 ui재로드
    for(let i=0;i<8;i++){
      let keys=Object.keys(self.roomList);
      if(keys[i+self.currentPage*8]!=null){
        let x=i%4;
        let y=Math.floor(i/4);

        let smallPanel=new UIPanel(Sprite.BROWN,startX+x*(width+xMargin), startY+y*(height+yMargin), width, height);

        let roomName=new UIButton(Sprite.VOID, 0, height/4, width, height/4, null);
        roomName.setText(self.roomList[keys[i+self.currentPage*8]].RoomName);

        let roomNum=new UIButton(Sprite.VOID, 0, height/1.5, width, height/4, null);
        roomNum.setText(self.roomList[keys[i+self.currentPage*8]].UserNum+" players");

        let btn=new UIButton(Sprite.HALF_VOID, 0, 0, width, height, {
          entered: function(uiButton) {
            uiButton.label.setColor(0,0,0,0.1);
          },

          exited: function(uiButton) {
            uiButton.label.setColor(0,0,0,0.0);
          },
          //클로저 사용
          pressed: (function(roomID,name,num){
            return function(uiButton) {
              uiButton.label.setColor(0,0,0,0.2);

              let data={};
              data.Protocol="JoinRoomRequest";
              data.RoomID=roomID;
              networkManager.send(data);
            }
          }(self.roomList[keys[i+self.currentPage*8]].RoomID , self.roomList[keys[i+self.currentPage*8]].RoomName , self.roomList[keys[i+self.currentPage*8]].UserNum)),

          released: function(uiButton) {
            uiButton.label.setColor(0,0,0,0.1);
          }
        });

        smallPanel.addComponent(roomName);
        smallPanel.addComponent(roomNum);
        smallPanel.addComponent(btn);
        roomListPanel.addComponent(smallPanel);
      }else break;
    }

    var leftBtn=new UIButton(Sprite.BROWN_ARROW, 0, roomListPanel.body.height/2-35, 50, 70, {
      entered: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.1);
      },
      exited: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.0);
      },
      pressed: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.2);
      },
      released: function(uiButton) {
        self.currentPage=(self.currentPage-1<0)?self.currentPage:self.currentPage-1;
        self.reloadFunc(roomListPanel);
      }
    });
    leftBtn.model.setFlip(true);

    var rightBtn=new UIButton(Sprite.BROWN_ARROW, roomListPanel.body.width-55, roomListPanel.body.height/2-35, 50, 70, {
      entered: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.1);
      },
      exited: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.0);
      },
      pressed: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.2);
      },
      released: function(uiButton) {
        self.currentPage=(self.currentPage>=self.maxPage)?self.currentPage:self.currentPage+1;
        self.reloadFunc(roomListPanel);
      }
    });

    var createRoomBtn=new UIButton(Sprite.BROWN, roomListPanel.body.width-170, 20, 150, 70, {
      entered: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.1);
      },
      exited: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.0);
      },
      pressed: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.2);
      },
      released: function(uiButton) {
        gsm.setState(GameState.CREATE_ROOM_STATE);
      }
    });
    createRoomBtn.setText("Create");

    roomListPanel.addComponent(leftBtn);
    roomListPanel.addComponent(rightBtn);
    roomListPanel.addComponent(createRoomBtn);
  }

  init() {
    //메인 판넬//백그라운드
    var mainPanel = new UIPanel(Sprite.GREEN, 0, 0, display.getWidth(), display.getHeight());
    this.roomListPanel=new UIPanel(Sprite.BEIGE, 250, display.getHeight() / 2 - 300, 1200, 600);

    //ui 구성 함수
    this.reloadFunc(this.roomListPanel);

    //빨리 넣을수록 아래로간다
    mainPanel.addComponent(this.roomListPanel);
    uiManager.addPanel(mainPanel);

    var data={};
    data.Protocol="GetRoomList";
    networkManager.send(data);
  }

  reset() {
    uiManager.clear();
    this.currentPage=0;
    this.roomList={};
    this.maxPage=0;
  }

  update() {
    var msg=networkManager.pollMessage();
    if(msg!=null){
      this.messageProcess(msg);
    }

    if(isKeyPressed(67)){
      gsm.setState(GameState.CREATE_ROOM_STATE);
    }
    uiManager.update();
  }
// 아직 나갈때 처리가 안됬다. 이건 서버에서 처리해야하는 부분
  messageProcess(message) {
    switch (message.Protocol) {

      case "GetRoomList":{
        this.roomList=message.RoomList;
        this.reloadFunc(this.roomListPanel);
        console.log(this.roomList);
      }break;

      case "AddRoom":{
        let room=message.Room;
        this.roomList[room.RoomID]=room;
        this.reloadFunc(this.roomListPanel);
      }break;

      case "RemoveRoom":{
        let roomID=message.RoomID;
        delete this.roomList[roomID];
        this.reloadFunc(this.roomListPanel);
      }break;

      case "JoinRoomResult":{
        //Status:0=정상처리,-1=인원수 초과
        if(message.Status>=0){
          gsm.setState(GameState.IN_ROOM_STATE,{
            Room:message.Room
          });
        }else{
          console.log("방의 인원수가 너무 많습니다.");
        }
      }break;

      case "StartGameReport":{
        let roomID=message.RoomID;
        delete this.roomList[roomID];
        this.reloadFunc(this.roomListPanel);
      }break;

      case "UpdateRoomCurrentUserNum":{
        let roomID=message.RoomID;
        let userNum=message.UserNum;
        this.roomList[roomID].UserNum=userNum;
        this.reloadFunc(this.roomListPanel);
      }break;

      default:console.log("UnknownProtocol",message);

    }
  }

  render(display) {
    uiManager.render(display);
  }
}
