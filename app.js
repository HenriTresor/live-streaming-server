import express from "express";
import { Server } from "socket.io";
import http from "http";
import dbConfig from "./configs/db.config.js";
const app = express();
const port = process.env.PORT || 8080;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: true,
    },
});
dbConfig().then(() => {
    server.listen(port || 8080, () => {
        console.log(`server is fire on ${port}`);
    });
});
