"use strict"
class UIButton extends UIComponent {

  constructor(sprite, x, y, width, height, buttonListener) {
    super(sprite, x, y, width, height);
    this.buttonListener = buttonListener;
    this.inside = false;
    this.pressed = false;
    this.label=new UILabel(this);
  }

  //현재 자신이속한 판넬에서 해당좌표(절대좌표)에 가장 위에있는 component의 id를 리턴하는 함수
  checkDepthHighest(mousePos){
    for(let i=this.panel.components.length-1;i>=0;i--){
      let component=this.panel.components[i];
      if(hitTestPoint(component.collision, mousePos)){
        return component.id;
      }
    }

    return -1;
  }

  render(display,xOffset,yOffset){
    super.render(display,xOffset,yOffset);
    this.label.render(display,xOffset,yOffset);
  }

  update() {
    //버튼리스너가 null이면 아무동작도 하지않음
    if(this.buttonListener==null)
      return;

    if (this.checkDepthHighest(mousePos)==this.id) {
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

var input={
  cho:['r','R','s','e','E','f','a','q','Q','t','T','d','w','W','c','z','x','v','g'],
  jung:["k", "o", "i", "O", "j", "p", "u", "P", "h", "hk", "ho", "hl", "y", "n", "nj", "np", "nl", "b", "m", "ml", "l"],
  jong:["","r", "R", "rt", "s", "sw", "sg", "e", "f", "fr", "fa", "fq", "ft", "fx", "fv", "fg", "a", "q", "qt", "t", "T", "d", "w", "c", "z", "x", "v", "g"]
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
function getHangul(h){
  for(let i=0;i<input.cho.length;i++){
    if(input.cho[i]==h)
      return hangul.cho[i];
  }

  for(let i=0;i<input.jung.length;i++){
    if(input.jung[i]==h)
      return hangul.jung[i];
  }

  return -1;
}

function isHangul(h){
  for(let i=0;i<input.cho.length;i++){
    if(input.cho[i]==h)
      return true;
  }

  for(let i=0;i<input.jung.length;i++){
    if(input.jung[i]==h)
      return true;
  }

  return false;
}

class UILabel extends GameObject{
  constructor(owner){
    super();
    this.owner=owner;
    this.body=new UIBody(this);
    this.body.pos.x=owner.body.pos.x;
    this.body.pos.y=owner.body.pos.y;
    this.body.width=owner.body.width;
    this.body.height=owner.body.height;
    this.model=new ShapeModel(this);
    this.model.setColor(0,0,0,0.0);
    this.timer=0;
  }

  setColor(){
    this.model.setColor.apply(this.model,arguments);
  }

  render(display,xOffset,yOffset){
    this.model.render(display.getProjection(),xOffset+this.body.pos.x,yOffset+this.body.pos.y,this.body.width,this.body.height,this.body.rotateAngle);
  }

  update(){
  }
}

class UICursor extends GameObject{
  constructor(owner){
    super();
    this.owner=owner;
    this.body=new UIBody(this);
    this.body.pos.x=owner.body.pos.x;
    this.body.pos.y=owner.body.pos.y;
    this.body.width=5;
    this.body.height=owner.body.height;
    this.model=new ShapeModel(this);
    this.model.setColor(0,0,0,0.0);
    this.timer=0;
  }

  setColor(){
    this.model.setColor.apply(this.model,arguments);
  }

  inputAction(){
    this.body.pos.y-=7;
    this.timer=0;
  }

  render(display,xOffset,yOffset){
    this.model.render(display.getProjection(),xOffset+this.body.pos.x,yOffset+this.body.pos.y,this.body.width,this.body.height,this.body.rotateAngle);
  }

  update(){
    this.body.pos.y+=(this.owner.body.pos.y-this.body.pos.y)*0.05;
    if(++this.timer>60){
      this.timer=0;
    }else if(this.timer>30){
      this.model.setColor(0,0,0,0.2);
    }else if(this.timer>0){
      this.model.setColor(0,0,0,0.9);
    }
  }

  setCurrentPos(currentCursorIndex,display){
    var total=0;
    for(let i=0;i<currentCursorIndex;i++){
      total+=display.textCtx.measureText(this.owner.text.charAt(i)).width;
    }

    this.body.pos.x=this.owner.getX()+total;
  }
}

class UITextField extends UIButton {
  constructor(sprite, x, y, width, height, buttonListener) {
    super(sprite, x, y, width, height, buttonListener);
    this.isFocus=false;
    this.isHangulMode = false;
    this.text = "";
    this.displayText = "";
    this.buffer = [];
    // this.maxLength=10;

    this.currentCursorIndex=0;
    this.cursor=new UICursor(this);
  }

  //현재 textCtx 와 gl좌표계가 달라 단위 통일이 안됨
  // getTextWidth(){
  //   var total=0;
  //   for(let i=0;i<this.displayText.length;i++){
  //     total+=display.textCtx.measureText(this.displayText.charAt(i)).width;
  //   }
  //   return total;
  // }
  //
  // getTextLeastMaxIndex(){
  //   var total=0;
  //   var i=-1;
  //   for(i=0;i<this.displayText.length;i++){
  //     let w=display.textCtx.measureText(this.displayText.charAt(i)).width;
  //     if(total+w<this.body.width)
  //       total+=w;
  //     else break;
  //   }
  //   return i;
  // }

  keyDown(e) {

    if(!this.isFocus)
      return;
    if (e.keyCode == 21) {
      this.isHangulMode = !this.isHangulMode;
      return;
    }

    this.displayText="";
    //만약 영어 자판에 해당하면
    if(65<=e.keyCode&&e.keyCode<=90){
      let char=e.key;
      if (this.isHangulMode) {
        char=getHangul(e.key);
        if(char!=-1)
          this.buffer.push(char);
      }else{
        let h=Hangul.a(this.buffer);
        if(this.buffer.length!=0){//버퍼가 비지 않았다면
          //글자 입력후 버퍼를 비운다.
          let a=this.text.substring(0,this.currentCursorIndex-1);
          let b=this.text.substring(this.currentCursorIndex-1,this.currentCursorIndex);
          let c=this.text.substring(this.currentCursorIndex,this.text.length);
          this.text=a+b+h.charAt(0)+c;

          this.buffer=[];
          this.currentCursorIndex++;
        }
        let a=this.text.substring(0,this.currentCursorIndex-1);
        let b=this.text.substring(this.currentCursorIndex-1,this.currentCursorIndex);
        let c=this.text.substring(this.currentCursorIndex,this.text.length);
        this.text=a+b+char+c;
        this.currentCursorIndex++;
      }
    }else{
      switch (e.key) {

        case "Backspace":if(this.buffer.length!=0){//버퍼가 비지 않았다면
          this.buffer=[];
        }else{
          if(0<this.currentCursorIndex){
            let a=this.text.substring(0,this.currentCursorIndex-1);
            let b=this.text.substring(this.currentCursorIndex-1,this.currentCursorIndex);
            let c=this.text.substring(this.currentCursorIndex,this.text.length);
            this.text=a+c;
            this.currentCursorIndex--;
          }
        }
        break;
        case "Delete":if(this.buffer.length!=0){//버퍼가 비지 않았다면
          this.buffer=[];
        }else{
          if(this.text.length>=this.currentCursorIndex+1){
            let a=this.text.substring(0,this.currentCursorIndex);
            let b=this.text.substring(this.currentCursorIndex,this.currentCursorIndex+1);
            let c=this.text.substring(this.currentCursorIndex+1,this.text.length);
            this.text=a+c;
          }
        }
        break;
        case "ArrowRight":if(this.buffer.length!=0){//버퍼가 비지 않았다면
          //글자 입력후 버퍼를 비운다.
          let h=Hangul.a(this.buffer);

            let a=this.text.substring(0,this.currentCursorIndex-1);
            let b=this.text.substring(this.currentCursorIndex-1,this.currentCursorIndex);
            let c=this.text.substring(this.currentCursorIndex,this.text.length);
            this.text=a+b+h.charAt(0)+c;

          this.currentCursorIndex++;
          this.buffer=[];
        }else{
          if(this.text.length>this.currentCursorIndex)
            this.currentCursorIndex++;
        }
        break;
        case "ArrowLeft":if(this.buffer.length!=0){//버퍼가 비지 않았다면
          //글자 입력후 버퍼를 비운다.
          let h=Hangul.a(this.buffer);

            let a=this.text.substring(0,this.currentCursorIndex-1);
            let b=this.text.substring(this.currentCursorIndex-1,this.currentCursorIndex);
            let c=this.text.substring(this.currentCursorIndex,this.text.length);
            this.text=a+b+h.charAt(0)+c;

          this.currentCursorIndex--;
          this.buffer=[];
        }else{
          if(0<this.currentCursorIndex)
            this.currentCursorIndex--;
        }
        break;
        case "Shift":
        case "Control":
        case "Alt":
        case "Tab":
        case "F1":case "F2":case "F3":case "F4": case "F5": case "F6":
        case "F7":case "F8":case "F9":case "F10":case "F11":case "F12":
        case "ArrowUp":
        case "ArrowDown":break;
        default:{
          let char=e.key;
          //기본입력 처리
          let h=Hangul.a(this.buffer);
          if(this.buffer.length!=0){//버퍼가 비지 않았다면
            //글자 입력후 버퍼를 비운다.
            let a=this.text.substring(0,this.currentCursorIndex-1);
            let b=this.text.substring(this.currentCursorIndex-1,this.currentCursorIndex);
            let c=this.text.substring(this.currentCursorIndex,this.text.length);
            this.text=a+b+h.charAt(0)+c;

            this.buffer=[];
            this.currentCursorIndex++;
          }
          let a=this.text.substring(0,this.currentCursorIndex-1);
          let b=this.text.substring(this.currentCursorIndex-1,this.currentCursorIndex);
          let c=this.text.substring(this.currentCursorIndex,this.text.length);
          this.text=a+b+char+c;
          this.currentCursorIndex++;
        }break;

      }
    }

    this.cursor.inputAction();

    let h=Hangul.a(this.buffer);
    if(h.length>=2){//만약 글자 길이가 2이상이면
      //앞에 글자를 붙이고 뒤에 글자를 버퍼에 넣는다.
      let a=this.text.substring(0,this.currentCursorIndex-1);
      let b=this.text.substring(this.currentCursorIndex-1,this.currentCursorIndex);
      let c=this.text.substring(this.currentCursorIndex,this.text.length);
      this.text=a+b+h.charAt(0)+c;

      this.buffer=Hangul.d(h.charAt(1));
      this.currentCursorIndex++;
    }

    //갱신
    h=Hangul.a(this.buffer);

    let a=this.text.substring(0,this.currentCursorIndex-1);
    let b=this.text.substring(this.currentCursorIndex-1,this.currentCursorIndex);
    let c=this.text.substring(this.currentCursorIndex,this.text.length);

    this.displayText=a+b+h+c;
  }

  keyUp(e) {}

  update() {
    super.update();
    if(this.isFocus)
      this.cursor.update();
    else{
      this.cursor.model.setColor(0,0,0,0.0);
    }
  }

  render(display, xOffset, yOffset) {
    super.render(display, xOffset, yOffset);
    display.textCtx.save();
    display.textCtx.font = (this.body.height * 0.8) + "px Verdana";
    //text rendering
    var txt="";
    txt=this.displayText;
    display.fillText(txt, xOffset + this.getX(), yOffset + this.getY() + this.body.height / 1.2);
    //현재 한글 완성중인지 표시
      // var s="";
      // for(let i=0;i<this.buffer.length;i++){
      //   s+=this.buffer[i];
      // }
      // display.fillText(s, xOffset + this.getX(), yOffset + this.getY() - this.body.height / 1.2);
    this.cursor.render(display,xOffset,yOffset);
    this.cursor.setCurrentPos(this.currentCursorIndex,display);
    display.textCtx.restore();
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
