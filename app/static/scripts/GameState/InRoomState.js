"use strict"
class InRoomState extends GameState {

  constructor(){
    super();
    this.isReady=false;
  }

  reloadFunc(roomPanel){
    var self=this;

    var startX=50;
    var startY=80;
    var width=250;
    var height=250;

    roomPanel.clear();

    var startBtn=new UIButton(Sprite.BROWN, this.roomPanel.body.width/2-220, 10, 200, 50, {
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
        uiButton.label.setColor(0,0,0,0.1);
        
        if (this.isMaster) {
          for (let userID in this.playerList) {
            if (!this.playerList(userID).isReady) {
              return;
            }
          }

          var data={
            head: "game.start.request",
          };
  
          networkManager.send(data);
        }
      }
    });
    
    startBtn.setText("START");

    var readyBtn=new UIButton(Sprite.BROWN, this.roomPanel.body.width/2, 10, 200, 50, {
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
        uiButton.label.setColor(0,0,0,0.1);
        self.setReady(!self.isReady);
      }
    });

    readyBtn.setText("READY");

    var quitBtn=new UIButton(Sprite.BROWN, this.roomPanel.body.width/2+220, 10, 200, 50, {
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
        uiButton.label.setColor(0,0,0,0.1);
        var data={
          "head": "room.quit.request"
        };
        networkManager.send(data);
      }
    });

    quitBtn.setText("QUIT");

    //우측 상단 자신의 자리
    let smallPanel=new UIPanel(Sprite.WHITE,startX, startY, width, height);

    //원래는 투명
    var readyLabel=new UIButton(Sprite.VOID, width-20, 0, 20, 20, null);

    if(this.isReady)
      readyLabel.model.setSprite(Sprite.CHECK);

    let playerName=new UIButton(Sprite.GRAY, 0, height*(3/4), width, height/4, null);
    playerName.setText(this.userID);

    let btn=new UIButton(Sprite.VOID, 0, 0, width, height, {
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
        uiButton.label.setColor(0,0,0,0.1);
      }
    });

    smallPanel.addComponent(playerName);
    smallPanel.addComponent(btn);
    smallPanel.addComponent(readyLabel);
    roomPanel.addComponent(smallPanel);

    roomPanel.addComponent(startBtn);
    roomPanel.addComponent(readyBtn);
    roomPanel.addComponent(quitBtn);

    startX=350;
    startY=80;
    width=120;
    height=120;
    var xMargin=30;
    var yMargin=30;

    var num=0;

    let userIDSet = Object.keys(this.playerList)

    for(let i=0;i<userIDSet.length;i++){
      let x=num%2;
      let y=Math.floor(num/2);

      let userID = userIDSet[i];

      if(userID===this.userID)
        continue;

      else ++num;

      let smallPanel=new UIPanel(Sprite.WHITE, startX+x*(width+xMargin), startY+y*(height+yMargin), width, height);

      //원래는 투명
      let readyLabel=new UIButton(Sprite.VOID, width-20, 0, 20, 20, null);
      if(self.playerList[userID].isReady)//준비된 상태라면 표시
        readyLabel.model.setSprite(Sprite.CHECK);

      let playerName=new UIButton(Sprite.GRAY, 0, height*(3/4), width, height/4, null);
      playerName.setText(userID);

      let btn=new UIButton(Sprite.VOID, 0, 0, width, height, {
        entered: function(uiButton) {
          uiButton.label.setColor(0,0,0,0.1);
        },

        exited: function(uiButton) {
          uiButton.label.setColor(0,0,0,0.0);
        },

        pressed: function(uiButton){
          uiButton.label.setColor(0,0,0,0.2);
        },

        released: function(uiButton) {
          uiButton.label.setColor(0,0,0,0.1);
        }
      });

      smallPanel.addComponent(playerName);
      smallPanel.addComponent(btn);
      smallPanel.addComponent(readyLabel);
      roomPanel.addComponent(smallPanel);

    }

  }

  setReady(value){
    this.isReady=value;

    this.reloadFunc(this.roomPanel);

    var data={
      "head": "game.ready.request",
      "body": {
        "ready": value
      }
    };
    
    networkManager.send(data);
  }

  init() {
    console.log(this.receivedData);
    this.userID=gsm.cookie.id;

    this.playerList=this.receivedData.members;
    this.isMaster=this.playerList[this.userID].isMaster;

    var self=this;

    //메인 판넬//백그라운드
    var mainPanel = new UIPanel(Sprite.GREEN, 0, 0, display.getWidth(), display.getHeight());

    this.roomPanel=new UIPanel(Sprite.BEIGE, display.getWidth()/4, 50, display.getWidth()/2, 700);
    this.reloadFunc(this.roomPanel);

    mainPanel.addComponent(this.roomPanel);
    uiManager.addPanel(mainPanel);
  }

  reset() {
    uiManager.clear();
    
    this.userID=null;
    this.playerList={};
    this.isReady=false;
  }

  update() {
    var msg=networkManager.pollMessage();

    if(msg!=null){
      this.messageProcess(msg);
    }

    uiManager.update();
  }

  messageProcess(message) {
    switch (message.head) {
      case "room.join.report":{
        let userID = message.body.member

        this.playerList[userID] = {
          isMaster: false,
          isReady: false,
          currentCharacter: 0,
        };

        this.reloadFunc(this.roomPanel);
      }break;

      case "room.quit.response":{
        if (message.body.result) {
          gsm.setState(GameState.LOBBY_STATE);
        }
      }

      case "room.quit.report":{
        delete this.playerList[message.body.member]; 
        this.reloadFunc(this.roomPanel);
      }break;

      case "room.kick.report":{
        let memberID = message.body.member;

        if (this.userID === memberID) {
          gsm.setState(GameState.LOBBY_STATE);
        } else {
          delete this.playerList[memberID];
          this.reloadFunc(this.roomPanel);
        }
      }break;

      case "game.ready.report":{
        let userID = message.body.member
        let isReady = message.body.ready

        this.playerList[userID].isReady = isReady;
        this.reloadFunc(this.roomPanel);
      }break;

      case "game.start.response":{
        if (message.body.result) {
          gsm.setState(GameState.MAINGAME_STATE,{
            users: this.playerList
          });
        }
      }break;

      case "game.start.report":{
        gsm.setState(GameState.MAINGAME_STATE,{
          users: this.playerList
        });
      }break;

      default:console.log("Unknown Header",message);
    }
  }

  render(display) {
    uiManager.render(display);
  }
}
