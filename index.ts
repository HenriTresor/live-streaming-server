import express, { Request, Response, Application, NextFunction } from "express";
import { Server } from "socket.io";
import http from "http";
import dbConfig from "./configs/database.config.js";
import errorHandler from "./middlewares/errorHandler.js";
import errorResponse from "./utils/errorResponse.js";
import UserRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import FriendRouter from "./routes/Friends.route.js";
import MessageRouter from "./routes/message.route.js";
import VideoRouter from "./routes/Video.route.js";
import { app, server, io } from "./configs/app.config.js";
import NodeMediaServer from "node-media-server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
app.use(`${root}/videos`, VideoRouter);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(errorResponse("route was not found", 404));
});

app.use(errorHandler);

// socket implementation

interface SocketUser {
  _id: string;
  socketId: string;
}

let onlineUsers: SocketUser[];

onlineUsers = [];

io.on("connection", (socket) => {
  console.log("new socket connected:", socket.id);

  socket.on("new user", (user: any) => {
    onlineUsers = [...onlineUsers, { ...user, socketId: socket.id }];
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

  socket.on("offer", (data) => {
    console.log(data);
    socket.broadcast.emit("offer", data);
  });

  socket.on("answer", (data) => {
    socket.broadcast.emit("answer", data);
  });

  socket.on("ice-candidate", (data) => {
    socket.broadcast.emit("ice-candidate", data);
  });
});

const nms = new NodeMediaServer({
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 60,
    ping_timeout: 30,
  },
  http: {
    port: 5000,
    allow_origin: "*",
    mediaroot: "/uploads",
  },
  relay: {
    ffmpeg: "C:\\ffmpeg-6.0-essentials_build\\bin\\ffmpeg.exe",
    tasks: [
      {
        app: "live",
        mode: "push",
        edge: "rtmp://localhost:1935/live",
      },
    ],
  },
});

nms.run();
