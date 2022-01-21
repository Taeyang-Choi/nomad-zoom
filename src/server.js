import express from "express";
import http from "http";
import SocketIO from "socket.io";

const app = express();
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res)=> res.redirect("/"))

const handleListen = () => console.log(`listening on http://localhost:3000, ws://localhost:3000`);

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", socket => {
    socket.onAny((event) => {
        // console.log(`socket event: ${event}`);
    })
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName.payload);
        done();
        socket.to(roomName.payload).emit("welcome");
    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach(room => socket.to(room).emit("bye"));
    });
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", msg);
        done();
    })
})

/*const sockets = [];
wss.on("connection", (socket) => { // 연결된 브라우저 socket
    sockets.push(socket);
    socket["nickname"] = "anon-" + Math.floor(Math.random() * 100000);
    console.log("connected to browser");
    socket.send(makeMessage("nick", socket.nickname));

    socket.on("close", () => console.log("disconnected from the browser"))
    socket.on("message", (data) => {
        const message = JSON.parse(data);
        switch (message.type) {
            case "new_message":
                sockets.filter(soc => soc.nickname !== socket.nickname).forEach(soc => {
                    soc.send(makeMessage("new_message", `${socket.nickname}: ${message.payload}`));
                })
                break;
            case "nickname":
                socket["nickname"] = message.payload;
                break;
        }
    });
});*/


httpServer.listen(3000, handleListen);

function makeMessage(type, payload) {
    const msg = {type, payload};
    return JSON.stringify(msg);
}