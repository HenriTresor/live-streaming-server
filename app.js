import express from "express";
import dbConfig from "./configs/db.config.js";
import errorHandler from "./middlewares/errorHandler.js";
import errorResponse from "./utils/errorResponse.js";
import UserRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import FriendRouter from "./routes/Friends.route.js";
import { app, server } from "./configs/app.config.js";
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
app.all("*", (req, res, next) => {
    next(errorResponse("route was not found", 404));
});
app.use(errorHandler);
