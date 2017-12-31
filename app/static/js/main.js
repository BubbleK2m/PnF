const socket = new WebSocket(`ws://${location.host}/socket`);

socket.onmessage = (event) => {
    console.log(event.data);
};