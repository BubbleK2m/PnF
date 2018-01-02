const socket = new WebSocket(`wss://${location.host}/socket`);

socket.onmessage = (event) => {
    console.log(event.data);
};

