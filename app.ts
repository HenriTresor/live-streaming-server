import express, { Request, Response, Application } from "express";
import { Server } from "socket.io";
import http from "http";
import dbConfig from "./configs/db.config.js";
import errorHandler from "./middlewares/errorHandler.js";

const app: Application = express();
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

app.use(errorHandler);
