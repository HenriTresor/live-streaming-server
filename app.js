import express from "express";
import dbConfig from "./configs/db.config.js";
import errorHandler from "./middlewares/errorHandler.js";
import errorResponse from "./utils/errorResponse.js";
import UserRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import FriendRouter from "./routes/Friends.route.js";
import MessageRouter from "./routes/message.route.js";
import { app, server, io } from "./configs/app.config.js";
const port = process.env.PORT || 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dbConfig()
    .then(() => {
    console.log("connected to mongoose successfully");
})
    .then(() => {
    server.listen(port || 8080, () => {
        console.log(`server is fire on ${port}`);
    });
});
const root = "/api/v1";
app.use(`${root}/users`, UserRouter);
app.use(`${root}/auth`, authRouter);
app.use(`${root}/friends`, FriendRouter);
app.use(`${root}/messages`, MessageRouter);
app.all("*", (req, res, next) => {
    next(errorResponse("route was not found", 404));
});
app.use(errorHandler);
let onlineUsers;
onlineUsers = [];
io.on("connection", (socket) => {
    console.log("new socket connected:", socket.id);
    socket.on("new user", (user) => {
        onlineUsers = [...onlineUsers, Object.assign(Object.assign({}, user), { socketId: socket.id })];
        console.log(onlineUsers);
    });
    socket.on("new message", (message) => {
        const receiver = onlineUsers.find((user) => user._id === message.receiver);
        if (receiver) {
            socket.to(receiver.socketId).emit("message", message);
        }
    });
    socket.emit("online users", onlineUsers);
    socket.on("disconnect", () => {
        console.log("socket left: ", socket.id);
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    });
});
