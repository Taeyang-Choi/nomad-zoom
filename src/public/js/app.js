const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName = "";
function addMessage(msg) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = msg;
    ul.appendChild(li);
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value = "";
}

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;

    const msgForm = room.querySelector("#msg");
    msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const roomname = form.querySelector("#roomName");
    const nickname = form.querySelector("#nickname");

    socket.emit("enter_room", {roomname: roomname.value, nickname: nickname.value}, showRoom);
    roomName = roomname.value;
}
form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user) => {
    addMessage(`${user} joined!`);
});

socket.on("bye", (user) => {
    addMessage(`${user} left :(`);
});

socket.on("new_message", addMessage);