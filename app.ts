import express, { Request, Response, Application, NextFunction } from "express";
import { Server } from "socket.io";
import http from "http";
import dbConfig from "./configs/db.config.js";
import errorHandler from "./middlewares/errorHandler.js";
import errorResponse from "./utils/errorResponse.js";
import UserRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import FriendRouter from "./routes/Friends.route.js";

const app: Application = express();
const port = process.env.PORT || 8080;
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

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

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(errorResponse("route was not found", 404));
});

app.use(errorHandler);
