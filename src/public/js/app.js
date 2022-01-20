const messageList = document.querySelector("ul");
const messageform = document.querySelector("form");
const socket = new WebSocket(`ws://${window.location.host}`); // 서버로의 연

socket.addEventListener("open", () => {
    console.log("connected to server");
});

socket.addEventListener("message", (message) => {
    console.log(`new msg: ${message.data}`);
});

function handleSubmit(event) {
    event.preventDefault();
    const input = messageform.querySelector("input");
    socket.send(input.value);
    input.value = "";
}
messageform.addEventListener("submit", handleSubmit);
