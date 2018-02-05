"use strict"
class UIButton extends UIComponent {

  constructor(sprite, x, y, width, height, buttonListener) {
    super(sprite, x, y, width, height);
    this.buttonListener = buttonListener;
    this.inside = false;
    this.pressed = false;
    this.label = new UILabel(this);
    this.textLabel = new UITextLabel(this);
    //기본 버튼 텍스트 크기설정
    this.textLabel.body.width/=2;
    this.textLabel.body.height/=2;
  }

  setText(value) {
    this.textLabel.setText(value);
  }

  //현재 자신이속한 판넬에서 해당좌표(절대좌표)에 가장 위에있는 component의 id를 리턴하는 함수
  checkDepthHighest(mousePos) {
    for (let i = this.panel.components.length - 1; i >= 0; i--) {
      let component = this.panel.components[i];
      if (hitTestPoint(component.collision, mousePos)) {
        return component.id;
      }
    }

    return -1;
  }

  render(display, xOffset, yOffset) {
    super.render(display, xOffset, yOffset);
    this.textLabel.render(display, xOffset, yOffset);
    this.label.render(display, xOffset, yOffset);
  }

  update() {
    this.textLabel.update();
    this.label.update();
    //버튼리스너가 null이면 아무동작도 하지않음
    if (this.buttonListener == null)
      return;

    if (this.checkDepthHighest(mousePos) == this.id) {
      if (!this.inside) {
        this.buttonListener.entered(this);
      }
      this.inside = true;

      if (!this.pressed && isMouseDown(1)) {
        this.buttonListener.pressed(this);
        this.pressed = true;
      } else if (this.pressed && !isMouseDown(1)) {
        this.buttonListener.released(this);
        this.pressed = false;
      }
    } else {
      if (this.inside) {
        this.buttonListener.exited(this);
        this.pressed = false;
      }
      this.inside = false;
    }

  }

}

var input = {
  cho: ['r', 'R', 's', 'e', 'E', 'f', 'a', 'q', 'Q', 't', 'T', 'd', 'w', 'W', 'c', 'z', 'x', 'v', 'g'],
  jung: ["k", "o", "i", "O", "j", "p", "u", "P", "h", "hk", "ho", "hl", "y", "n", "nj", "np", "nl", "b", "m", "ml", "l"],
  jong: ["", "r", "R", "rt", "s", "sw", "sg", "e", "f", "fr", "fa", "fq", "ft", "fx", "fv", "fg", "a", "q", "qt", "t", "T", "d", "w", "c", "z", "x", "v", "g"]
}

var hangul = {
  cho: ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'],
  jung: ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'],
  jong: ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']
};

/**
 * @param String h : 영어값
 * @return 영어에 해당하는 한글 값
 */
function getHangul(h) {
  for (let i = 0; i < input.cho.length; i++) {
    if (input.cho[i] == h)
      return hangul.cho[i];
  }

  for (let i = 0; i < input.jung.length; i++) {
    if (input.jung[i] == h)
      return hangul.jung[i];
  }

  return -1;
}

function isHangul(h) {
  for (let i = 0; i < input.cho.length; i++) {
    if (input.cho[i] == h)
      return true;
  }

  for (let i = 0; i < input.jung.length; i++) {
    if (input.jung[i] == h)
      return true;
  }

  return false;
}

class UILabel extends GameObject {
  constructor(owner) {
    super();
    this.owner = owner;
    this.body = new UIBody(this);
    this.body.pos.x = owner.body.pos.x;
    this.body.pos.y = owner.body.pos.y;
    this.body.width = owner.body.width;
    this.body.height = owner.body.height;
    this.model = new ShapeModel(this);
    this.model.setColor(0, 0, 0, 0.0);
  }

  setColor() {
    this.model.setColor.apply(this.model, arguments);
  }

  render(display, xOffset, yOffset) {
    this.model.render(display.getProjection(), xOffset + this.body.pos.x, yOffset + this.body.pos.y, this.body.width, this.body.height, this.body.rotateAngle);
  }

  update() {}
}

class UITextLabel extends GameObject {
  constructor(owner) {
    super();
    this.owner = owner;
    this.body = new UIBody(this);
    this.body.pos.x = owner.body.pos.x;
    this.body.pos.y = owner.body.pos.y;
    this.body.width = owner.body.width;
    this.body.height = owner.body.height;
    this.model = new TextureModel(this, Sprite.TEXT);
    this.text = "";
  }

  setText(value) {
    this.text=value;
    this.model.sprite = new Sprite(new Text(this.text));
  }

  render(display, xOffset, yOffset) {
    this.model.render(display.getProjection(), xOffset + this.body.pos.x, yOffset + this.body.pos.y, this.body.width, this.body.height, this.body.rotateAngle);
  }

  update() {}
}

class UICursor extends GameObject {
  constructor(owner) {
    super();
    this.owner = owner;
    this.body = new UIBody(this);
    this.body.pos.x = owner.body.pos.x;
    this.body.pos.y = owner.body.pos.y;
    this.body.width = 5;
    this.body.height = owner.body.height;
    this.model = new ShapeModel(this);
    this.model.setColor(0, 0, 0, 0.0);
    this.timer = 0;
  }

  setColor() {
    this.model.setColor.apply(this.model, arguments);
  }

  inputAction() {
    this.body.pos.y -= 7;
    this.timer = 0;
  }

  render(display, xOffset, yOffset) {
    this.model.render(display.getProjection(), xOffset + this.body.pos.x, yOffset + this.body.pos.y, this.body.width, this.body.height, this.body.rotateAngle);
  }

  update() {
    this.body.pos.y += (this.owner.body.pos.y - this.body.pos.y) * 0.05;
    if (++this.timer > 60) {
      this.timer = 0;
    } else if (this.timer > 30) {
      this.model.setColor(0, 0, 0, 0.2);
    } else if (this.timer > 0) {
      this.model.setColor(0, 0, 0, 0.9);
    }
  }

  setCurrentPos(currentCursorIndex) {
    var total = 0;
    display.textCtx.save();
    display.textCtx.font=this.owner.textLabel.body.height+"px serif";
    total=display.textCtx.measureText(this.owner.text.substring(0,currentCursorIndex)).width;
    display.textCtx.restore();
    this.body.pos.x = this.owner.getX() + total;
  }
}

class UITextField extends UIButton {
  constructor(sprite, x, y, width, height, buttonListener) {
    super(sprite, x, y, width, height, buttonListener);
    this.isFocus = false;
    this.isHangulMode = false;
    this.text = "";
    this.displayText = "";
    this.buffer = [];
    // this.maxLength=10;

    this.currentCursorIndex = 0;
    this.cursor = new UICursor(this);

    //기본값 0으로 설정
    this.textLabel.body.width=0;
    this.textLabel.body.height=this.body.height;

    //커서위치 설정
    this.cursor.setCurrentPos(this.currentCursorIndex);
  }

  keyDown(e) {

    if (!this.isFocus)
      return;
    if (e.keyCode == 21) {
      this.isHangulMode = !this.isHangulMode;
      return;
    }

    this.displayText = "";
    //만약 영어 자판에 해당하면
    if (65 <= e.keyCode && e.keyCode <= 90) {
      let char = e.key;
      if (this.isHangulMode) {
        char = getHangul(e.key);
        if (char != -1)
          this.buffer.push(char);
      } else {
        let h = Hangul.a(this.buffer);
        if (this.buffer.length != 0) { //버퍼가 비지 않았다면
          //글자 입력후 버퍼를 비운다.
          this.insertText(h.charAt(0),this.currentCursorIndex);

          this.buffer = [];
          this.currentCursorIndex++;
        }
        this.insertText(char,this.currentCursorIndex);
        this.currentCursorIndex++;
      }
    } else {
      switch (e.key) {

        case "Backspace":
          if (this.buffer.length != 0) { //버퍼가 비지 않았다면
            this.buffer = [];
          } else {
            if (0 < this.currentCursorIndex) {
              this.currentCursorIndex--;
              this.deleteText(this.currentCursorIndex);
            }
          }
          break;
        case "Delete":
          if (this.buffer.length != 0) { //버퍼가 비지 않았다면
            this.buffer = [];
          } else {
            if (this.text.length >= this.currentCursorIndex + 1) {
              this.deleteText(this.currentCursorIndex);
            }
          }
          break;
        case "ArrowRight":
          if (this.buffer.length != 0) { //버퍼가 비지 않았다면
            //글자 입력후 버퍼를 비운다.
            let h = Hangul.a(this.buffer);

            this.insertText(h.charAt(0),this.currentCursorIndex);

            this.currentCursorIndex++;
            this.buffer = [];
          } else {
            if (this.text.length > this.currentCursorIndex)
              this.currentCursorIndex++;
          }
          break;
        case "ArrowLeft":
          if (this.buffer.length != 0) { //버퍼가 비지 않았다면
            //글자 입력후 버퍼를 비운다.
            let h = Hangul.a(this.buffer);

            this.insertText(h.charAt(0),this.currentCursorIndex);

            this.currentCursorIndex--;
            this.buffer = [];
          } else {
            if (0 < this.currentCursorIndex)
              this.currentCursorIndex--;
          }
          break;
        case "Shift":
        case "Control":
        case "Alt":
        case "Tab":
        case "F1":
        case "F2":
        case "F3":
        case "F4":
        case "F5":
        case "F6":
        case "F7":
        case "F8":
        case "F9":
        case "F10":
        case "F11":
        case "F12":
        case "ArrowUp":
        case "ArrowDown":
          break;
        default:
          {
            let char = e.key;
            //기본입력 처리
            let h = Hangul.a(this.buffer);
            if (this.buffer.length != 0) { //버퍼가 비지 않았다면
              //글자 입력후 버퍼를 비운다.
              this.insertText(h.charAt(0),this.currentCursorIndex);

              this.buffer = [];
              this.currentCursorIndex++;
            }
            this.insertText(char,this.currentCursorIndex);
            this.currentCursorIndex++;
          }
          break;
      }
    }

    this.cursor.inputAction();

    let h = Hangul.a(this.buffer);
    if (h.length >= 2) { //만약 글자 길이가 2이상이면
      //앞에 글자를 붙이고 뒤에 글자를 버퍼에 넣는다.
      this.insertText(h.charAt(0),this.currentCursorIndex);

      this.buffer = Hangul.d(h.charAt(1));
      this.currentCursorIndex++;
    }

    //갱신
    h = Hangul.a(this.buffer);

    let a = this.text.substring(0, this.currentCursorIndex - 1);
    let b = this.text.substring(this.currentCursorIndex - 1, this.currentCursorIndex);
    let c = this.text.substring(this.currentCursorIndex, this.text.length);

    this.displayText = a + b + h + c;

    //라벨의 text 설정
    this.textLabel.setText(this.displayText);

    display.textCtx.save();
    display.textCtx.font=this.textLabel.body.height+"px serif";

    //라벨의 body의 width와pos를 displayText의 길이에 따라 조정
    this.textLabel.body.width = display.textCtx.measureText(this.displayText).width;
    //label.body.pos는 상위 판넬속에 모델좌표다
    this.textLabel.body.pos.x=this.getX()+this.textLabel.body.width/2;
    this.textLabel.body.pos.y=this.getY()+this.textLabel.body.height/2;
    display.textCtx.restore();

    //커서위치 설정
    this.cursor.setCurrentPos(this.currentCursorIndex);
  }

  insertText(char,index){
    let a = this.text.substring(0, index - 1);
    let b = this.text.substring(index - 1, index);
    let c = this.text.substring(index, this.text.length);
    this.text = a + b + char + c;
  }

  deleteText(index){
    let a = this.text.substring(0, index);
    let b = this.text.substring(index, index + 1);
    let c = this.text.substring(index + 1, this.text.length);
    this.text = a + c;
  }

  setText(value){
    this.text=value;
    this.displayText=value;
    this.buffer=[];
    this.currentCursorIndex=value.length;

    display.textCtx.save();
    display.textCtx.font=this.textLabel.body.height+"px serif";

    //라벨의 body의 width와pos를 displayText의 길이에 따라 조정
    this.textLabel.body.width = display.textCtx.measureText(this.displayText).width;

    display.textCtx.restore();

    //커서위치 설정
    this.cursor.setCurrentPos(this.currentCursorIndex);

    this.textLabel.setText(this.displayText);
  }

  keyUp(e) {}

  update() {
    super.update();
    if (this.isFocus)
      this.cursor.update();
    else {
      this.cursor.model.setColor(0, 0, 0, 0.0);
    }
  }

  render(display, xOffset, yOffset) {
    super.render(display, xOffset, yOffset);

    this.cursor.render(display, xOffset, yOffset);
  }
}

class UIList extends UIPanel {
  constructor(sprite, x, y, width, height) {
    super(sprite, x, y, width, height);
  }

  addComponent(component) {
    component.init(this);
    component.setX(0);
    component.setY(0);
    var result = 0;
    for (var c of this.components) {
      result += c.body.height;
    }
    component.body.pos.y += result;
    this.components.push(component);
  }

  deleteComponent(index) {
    this.components.splice(index, 1);
    for (var i = 0; i < this.components.length; i++) {
      let component = this.components[i];
      component.setX(0);
      component.setY(0);
      var result = 0;
      for (var j = 0; j < i; j++) {
        let c = this.components[j];
        result += c.body.height;
      }
      component.body.pos.y += result;
    }

  }

}
