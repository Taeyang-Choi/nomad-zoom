import express from "express";
import http from "http";
import {WebSocket} from "ws";

const app = express();
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res)=> res.redirect("/"))

const handleListen = () => console.log(`listening on http://localhost:3000, ws://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({server});

const sockets = [];

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
});


server.listen(3000, handleListen);

function makeMessage(type, payload) {
    const msg = {type, payload};
    return JSON.stringify(msg);
}