"use strict"

var GameStateManager=function(){
  this.list=[];
  this.currentState=GameState.TITLE_STATE;

  this.list.push(new TitleState());
  this.list.push(new LoginState());
  this.list.push(new RegisterState());
  this.list.push(new LobbyState());
  this.list.push(new MainGameState());

  this.setState(GameState.TITLE_STATE);
}

GameStateManager.prototype.setState=function(state){
  this.list[this.currentState].reset();
	this.currentState = state;
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

GameState.TITLE_STATE=0;
GameState.LOGIN_STATE=1;
GameState.REGISTER_STATE=2;
GameState.LOBBY_STATE=3;
GameState.MAINGAME_STATE=4;

//미구현 함수(상속)
GameState.prototype.init=function(){}
GameState.prototype.reset=function(){}
GameState.prototype.update=function(){}
GameState.prototype.render=function(display){}
