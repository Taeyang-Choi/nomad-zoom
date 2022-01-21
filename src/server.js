import express from "express";
import http from "http";
import Server from "socket.io";

const app = express();
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));


app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res)=> res.redirect("/"))

const handleListen = () => console.log(`listening on http://localhost:3000, ws://localhost:3000`);

const httpServer = http.createServer(app);
const wsServer = Server(httpServer);

wsServer.on("connection", socket => {
    socket.on("join_room", (roomName) => {
        socket.join(roomName);
        socket.to(roomName).emit("welcome");
    })

    socket.on("offer", (offer, roomName) => {
        socket.to(roomName).emit("offer", offer);
    });

    socket.on("answer", (answer, roomName) => {
        socket.to(roomName).emit("answer", roomName);
    })
})

httpServer.listen(3000, handleListen);