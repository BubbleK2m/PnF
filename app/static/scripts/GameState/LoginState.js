"use strict"
class LoginState extends GameState {

  constructor(){
    super();
  }

  init() {

    var self=this;
    //메인 판넬//백그라운드
    var mainPanel = new UIPanel(Sprite.GREEN, 0, 0, display.getWidth(), display.getHeight());

    var loginPanel=new UIPanel(Sprite.BEIGE, display.getWidth() / 2 - 350, display.getHeight() / 2 - 200, 700, 500);

    var goToLoginBtn=new UIButton(Sprite.YELLOW, 0, -100, 150, 100, null);
    goToLoginBtn.setText("Login");

    var goToRegisterBtn=new UIButton(Sprite.SLIGHTLY_GRAY, 150, -100, 150, 100, {
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
        gsm.setState(GameState.REGISTER_STATE);
      }
    });
    goToRegisterBtn.setText("Register");

    this.idText=new UITextField(Sprite.INPUT_LINE, 150, 150, 400, 50, {
      entered: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.1);
      },
      exited: function(uiButton) {
        uiButton.isFocus=false;
        uiButton.label.setColor(0,0,0,0.0);
      },
      pressed: function(uiButton) {
        uiButton.isFocus=true;
        uiButton.label.setColor(0,0,0,0.2);
      },
      released: function(uiButton) {
      }
    });

    this.passwordText=new UITextField(Sprite.INPUT_LINE, 150, 250, 400, 50, {
      entered: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.1);
      },
      exited: function(uiButton) {
        uiButton.isFocus=false;
        uiButton.label.setColor(0,0,0,0.0);
      },
      pressed: function(uiButton) {
        uiButton.isFocus=true;
        uiButton.label.setColor(0,0,0,0.2);
      },
      released: function(uiButton) {
      }
    });

    var submitBtn=new UIButton(Sprite.BROWN, loginPanel.body.width/2-75, 400, 150, 70, {
      entered: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.1);
      },
      exited: function(uiButton) {
        uiButton.isFocus=false;
        uiButton.label.setColor(0,0,0,0.0);
      },
      pressed: function(uiButton) {
        uiButton.isFocus=true;
        uiButton.label.setColor(0,0,0,0.2);
      },
      released: function(uiButton) {
        var data={};
        data.Protocol="Login";
        data.Id=self.idText.textLabel.text;
        data.Password=self.passwordText.textLabel.text;
        networkManager.send(data);
      }
    });
    submitBtn.setText("Submit");

    //빨리 넣을수록 아래로간다
    loginPanel.addComponent(goToLoginBtn);
    loginPanel.addComponent(goToRegisterBtn);
    loginPanel.addComponent(this.idText);
    loginPanel.addComponent(this.passwordText);
    loginPanel.addComponent(submitBtn);
    mainPanel.addComponent(loginPanel);
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

      case "LoginResult":{
        if(message.Value){
          gsm.cookie.UserID=this.idText.textLabel.text;
          gsm.setState(GameState.LOBBY_STATE);
        }else {
          this.idText.setText("");
          this.passwordText.setText("");
        }
      }break;

      default:console.log("UnknownProtocol",message);

    }
  }

  render(display) {
    uiManager.render(display);
  }
}
