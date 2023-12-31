import express, { Request, Response, Application, NextFunction } from "express";
import { Server } from "socket.io";
import http from "http";
import dbConfig from "./configs/database.config.js";
import errorHandler from "./middlewares/errorHandler.js";
import errorResponse from "./utils/errorResponse.js";
import UserRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import FriendRouter from "./routes/Friends.route.js";
import StripeRouter from "./routes/Stripe.route.js";
import MessageRouter from "./routes/message.route.js";
import VideoRouter from "./routes/Video.route.js";
import CoinRouter from "./routes/Coin.route.js";
import GiftRouter from "./routes/Gift.route.js";
import { app, server, io } from "./configs/app.config.js";
import NodeMediaServer from "node-media-server";
import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
import cors from "cors";

config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const port = process.env.PORT || 8080;

app.use(cors());
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
app.use(`${root}/stripe`, StripeRouter);
app.use(`${root}/coins`, CoinRouter);
app.use(`${root}/gifts`, GiftRouter);

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
    socket.broadcast.emit("offer", data);
  });

  socket.on("answer", (data) => {
    socket.broadcast.emit("answer", data);
  });

  socket.on("ice-candidate", (data) => {
    socket.broadcast.emit("ice-candidate", data);
  });
  socket.on("stream", (data) => {
    // Broadcast the received video stream to all other connected clients
    console.log("data received", data);
    socket.emit("stream", data);
  });
});

const nms = new NodeMediaServer({
  rtmp: {
    port: 1935, // RTMP server port
    chunk_size: 60000, // Chunk size for video segments
    gop_cache: true, // Enable GOP cache
    ping: 60, // Ping interval in seconds
    ping_timeout: 30, // Timeout for ping requests in seconds
  },
  http: {
    port: 8000, // HTTP server port
    mediaroot: "./media", // Directory where recorded media files are stored
    allow_origin: "*", // Allow all domains to access the HLS stream
  },
  trans: {
    ffmpeg: "C:\\ffmpeg-6.0-essentials_build\\bin\\ffmpeg.exe", // Path to the ffmpeg executable
    tasks: [
      {
        app: "live", // Application name
        hls: true, // Enable HLS
        hlsFlags: "[hls_time=2:hls_list_size=3:hls_flags=delete_segments]",
        dash: true, // Enable DASH
        dashFlags: "[f=dash:window_size=3:extra_window_size=5]",
      },
    ],
  },
});

nms.run();
