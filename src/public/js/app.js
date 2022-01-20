
const socket = new WebSocket(`ws://${window.location.host}`); // 서버로의 연
socket.addEventListener("open", () => {
    console.log("connected to server");
});

socket.addEventListener("message", (message) => {
    console.log(`new msg: ${message.data}`);
});

setTimeout(() => {
    socket.send("hello from browser!");
}, 10000)

socket.addEventListener("close", () => {
    console.log("disconnected from server");
});