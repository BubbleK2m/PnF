"use strict"

var GameStateManager=function(){
  this.list=[];
  this.currentState=GameState.TITLE_STATE;

  this.list.push(new TitleState());
  this.list.push(new LoginState());
  this.list.push(new RegisterState());
  this.list.push(new LobbyState());
  this.list.push(new CreateRoomState());
  this.list.push(new InRoomState());
  this.list.push(new MainGameState());

  this.setState(GameState.TITLE_STATE);

  //게임 전반의 적용되는 값을 저장할수 있는 객체(ex:아이디)
  this.cookie={};
}

GameStateManager.prototype.setState=function(state,data){
  this.list[this.currentState].reset();
  //전의 상태에서 넘겨받은 정보를 null로 초기화한다.
  this.list[this.currentState].receivedData=null;
	this.currentState = state;

  //넘겨받은 데이터의 유무에 따라 설정
  if(data!=null)
    this.list[this.currentState].receivedData=data;
  //초기화
  this.list[this.currentState].init();

  console.log(this.list[this.currentState]);
}

GameStateManager.prototype.update=function(){
	this.list[this.currentState].update();
}

GameStateManager.prototype.render=function(display) {
	this.list[this.currentState].render(display);
}





//GameState






function GameState(){

}

(function(){
  let i=0;

  GameState.TITLE_STATE=i++;
  GameState.LOGIN_STATE=i++;
  GameState.REGISTER_STATE=i++;
  GameState.LOBBY_STATE=i++;
  GameState.CREATE_ROOM_STATE=i++;
  GameState.IN_ROOM_STATE=i++;
  GameState.MAINGAME_STATE=i++;
}());

//미구현 함수(상속)
GameState.prototype.init=function(){}
GameState.prototype.reset=function(){}
GameState.prototype.update=function(){}
GameState.prototype.render=function(display){}
