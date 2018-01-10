const socket = new WebSocket(`wss://${location.host}/socket`);

socket.onmessage = (event) => {
    console.log(event.data);
};

document.getElementById("add-param-btn").onclick = (event) => {
    let keyInput = document.createElement("input");
    keyInput.type = "text";
    keyInput.placeholder = "Key";

    let valueInput = document.createElement("input");
    valueInput.type = "text";
    valueInput.placeholder = "Value";

    let keyValueContainer = document.createElement("div");
    keyValueContainer.classList.add("key-value-container");
    keyValueContainer.style.display = "block";

    keyValueContainer.appendChild(keyInput);
    keyValueContainer.appendChild(valueInput);

    let keyValueForm = document.getElementById("key-value-form");
    keyValueForm.appendChild(keyValueContainer);
};

document.getElementById("key-value-form").onsubmit = (event) => {
    event.preventDefault();
    alert("ㅇㅅㅇ");
};