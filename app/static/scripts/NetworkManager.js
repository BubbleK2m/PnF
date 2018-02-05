"use strict"

class NetworkManager {
  constructor(url) {
    this.socket = new WebSocket(url);

    var self=this;
    this.buffer=[];
    //웹 소켓이 연결되었을 때 호출되는 이벤트
    this.socket.onopen = function(message) {
      console.log("connect!");
    };
    //웹 소켓이 닫혔을 때 호출되는 이벤트
    this.socket.onclose = function(message) {
      console.log("close!");
    };
    //웹 소켓이 에러가 났을 때 호출되는 이벤트
    this.socket.onerror = function(message) {
      console.log("error!");
    };
    //웹 소켓에서 메시지가 날라왔을 때 호출되는 이벤트
    this.socket.onmessage = function(message) {
      var data = JSON.parse(message.data);
      self.buffer.push(data);
    };

  }

  /**
	 * 메세지 받기
	 * @return JSONObject //받은 메세지 없으면 null리턴
	 */
  pollMessage(){
    return this.buffer.pop();
  }

  /**
   * json object입력
   *
   */
  send(json) {
    let string=JSON.stringify(json);
    //웹소켓으로 textMessage객체의 값을 보낸다.
    this.socket.send(string);
  }
  //웹소켓 종료
  close() {
    this.socket.close();
  }
}
