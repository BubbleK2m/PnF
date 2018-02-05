"use strict"
class LoginState extends GameState {

  constructor(){
    super();
    this.spriteSheet=TextureLoader.get("images/P&F-Sprite.png");
  }

  init() {
    //메인 판넬//백그라운드
    var mainPanel = new UIPanel(this.spriteSheet, 0, 0, display.getWidth(), display.getHeight());
    //녹색
    mainPanel.setUV(261/1024,335/1024,348/1024,422/1024);

    var loginPanel=new UIPanel(this.spriteSheet, display.getWidth() / 2 - 350, display.getHeight() / 2 - 200, 700, 500);
    //베이지색
    loginPanel.setUV(348/1024,335/1024,435/1024,422/1024);

    var goToLoginBtn=new UIButton(this.spriteSheet, 0, -100, 150, 100, null);
    //노란색
    goToLoginBtn.setUV(87/1024,335/1024,174/1024,422/1024);

    var goToRegisterBtn=new UIButton(this.spriteSheet, 150, -100, 150, 100, {
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
    //애배한회색
    goToRegisterBtn.model.setUV(174/1024,335/1024,261/1024,422/1024);

    var idText=new UITextField(this.spriteSheet, 150, 150, 400, 50, {
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

    var passwordText=new UITextField(this.spriteSheet, 150, 250, 400, 50, {
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

    var submitBtn=new UIButton(this.spriteSheet, loginPanel.body.width/2-75, 400, 150, 70, {
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
        gsm.setState(GameState.LOBBY_STATE);
      }
    });

    //빨리 넣을수록 아래로간다
    loginPanel.addComponent(goToLoginBtn);
    loginPanel.addComponent(goToRegisterBtn);
    loginPanel.addComponent(idText);
    loginPanel.addComponent(passwordText);
    loginPanel.addComponent(submitBtn);
    mainPanel.addComponent(loginPanel);
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
