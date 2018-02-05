"use strict"
class CreateRoomState extends GameState {

  constructor(){
    super();
  }

  init() {
    var self=this;
    //메인 판넬//백그라운드
    var mainPanel = new UIPanel(Sprite.GREEN, 0, 0, display.getWidth(), display.getHeight());
    var roomListPanel=new UIPanel(Sprite.BEIGE, 250, display.getHeight() / 2 - 300, 1200, 600);

    this.inputField=new UITextField(Sprite.INPUT_LINE, roomListPanel.body.width/2-200, roomListPanel.body.height/2-20, 400, 50, {
      entered: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.1);
      },
      exited: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.0);
        uiButton.isFocus=false;
      },
      pressed: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.2);
        uiButton.isFocus=true;
      },
      released: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.1);
      }
    });

    var createBtn=new UIButton(Sprite.BROWN, roomListPanel.body.width/2-75, roomListPanel.body.height/2+80, 150, 70, {
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
        var data={};
        data.Protocol="CreateRoom";
        data.RoomName=self.inputField.textLabel.text;
        networkManager.send(data);
      }
    });
    createBtn.setText("Create");

    //빨리 넣을수록 아래로간다
    roomListPanel.addComponent(this.inputField);
    roomListPanel.addComponent(createBtn);
    mainPanel.addComponent(roomListPanel);
    uiManager.addPanel(mainPanel);
  }

  reset() {
    uiManager.clear();
  }

  update() {
    var msg=networkManager.pollMessage();
    if(msg!=null){
      this.messageProcess(msg);
    }
    uiManager.update();
  }

  messageProcess(message) {
    switch (message.Protocol) {

      case "CreateRoomResult":{
        if(message.Value)
          gsm.setState(GameState.IN_ROOM_STATE,{
            Room:message.Room
          });
        else {
          this.inputField.setText("");
        }
      }break;

      default:console.log("UnknownProtocol",message);

    }
  }

  render(display) {
    uiManager.render(display);
  }
}
