const messageList = document.querySelector("ul");
const nickform = document.querySelector("#nick");
const messageform = document.querySelector("#message");
const socket = new WebSocket(`ws://${window.location.host}`); // 서버로의 연

function makeMessage(type, payload) {
    const msg = {type, payload};
    return JSON.stringify(msg);
}

socket.addEventListener("open", () => {
    console.log("connected to server");
});

socket.addEventListener("message", (message) => {
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
});

function handleMessage(event) {
    event.preventDefault();
    const input = messageform.querySelector("input");
    socket.send(makeMessage("new_message", input.value));
    input.value = "";
}
messageform.addEventListener("submit", handleMessage);

function handleNick(event) {
    event.preventDefault();
    const input = nickform.querySelector("input");
    socket.send(makeMessage("nickname", input.value));
}
nickform.addEventListener("submit", handleNick);
