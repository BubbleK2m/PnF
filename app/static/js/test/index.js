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

    let delParamButton = document.createElement("input");
    delParamButton.type = "button";
    delParamButton.value = "DELETE";

    let keyValueContainer = document.createElement("div");
    keyValueContainer.classList.add("key-value-container");
    keyValueContainer.style.display = "block";

    delParamButton.onclick = (event) => {
        keyValueContainer.parentNode.removeChild(keyValueContainer);s
    };

    keyValueContainer.appendChild(keyInput);
    keyValueContainer.appendChild(valueInput);
    keyValueContainer.appendChild(delParamButton);

    let keyValueForm = document.getElementById("key-value-form");
    keyValueForm.appendChild(keyValueContainer);
};

document.getElementById("key-value-form").onsubmit = (event) => {
    event.preventDefault();

    let requestPathText = document.getElementById("request-path-text");
    let requestPath = requestPathText.value;

    let keyValueParameters = new Object();
    let keyValueContainers = Array.from(document.getElementsByClassName("key-value-container"));

    keyValueContainers.forEach((container, index) => {
        let [ keyInput, valueInput ] = container.childNodes;
        
        let key = keyInput.value;
        let value = valueInput.value;

        keyValueParameters[key] = value;
    });

    sendRequest(requestPath, keyValueParameters);
};

function sendRequest(path, data) {
    let request = {
        "kind": "request",
        "path": path,
        "data": data
    };

    socket.send(JSON.stringify(request));
};