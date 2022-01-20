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
    console.log("connected to browser");
    socket.on("close", () => console.log("disconnected from the browser"))
    socket.on("message", (message) => {
        sockets.forEach(socket => {
            socket.send(message.toString("utf8"));
        })
    });
});


server.listen(3000, handleListen);