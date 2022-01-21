const messageList = document.querySelector("ul");
const nickform = document.querySelector("#nick");
const messageform = document.querySelector("#message");
const socket = new WebSocket(`ws://${window.location.host}`); // 서버로의 연결

let mynick = "";

function makeMessage(type, payload) {
    const msg = {type, payload};
    return JSON.stringify(msg);
}

socket.addEventListener("open", () => {
    console.log("connected to server");
});

socket.addEventListener("message", (e) => {
    const message = JSON.parse(e.data);
    switch(message.type) {
        case "nick":
            mynick = message.payload;
            break;
        case "new_message":
            const li = document.createElement("li");
            li.innerText = message.payload;
            messageList.append(li);
            break;
    }
});

function handleMessage(event) {
    event.preventDefault();
    const input = messageform.querySelector("input");
    socket.send(makeMessage("new_message", input.value));
    const li = document.createElement("li");
    li.innerText = `${mynick}: ${input.value}`
    messageList.append(li);
    input.value = "";
}
messageform.addEventListener("submit", handleMessage);

function handleNick(event) {
    event.preventDefault();
    const input = nickform.querySelector("input");
    mynick = input.value;
    socket.send(makeMessage("nickname", input.value));
}
nickform.addEventListener("submit", handleNick);
