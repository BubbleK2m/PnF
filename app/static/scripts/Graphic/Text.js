"use strict"

class Text{
  // 사이즈를 250으로 하면 출력할떼 잘려서 나오는 오류 있음
  constructor(text="",font="Arial",color="black",size=150){
    this.value=text;
    this.font=font;//글씨모양
    this.color=color;
    this.size=size;//height크기
  }
}
