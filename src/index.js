import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import route from "./routers/index.js";
import db from "./config/database/index.js";
import { addUser, removeUser, getUser, users } from "./utils/socketUtils.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://pesterin.vercel.app",
    methods: ["GET", "POST"],
  },
});
const PORT = process.env.PORT || 5000;

//Config dotenv
dotenv.config();

//CORS
app.use(cors());

//Connect to DB
await db.connect();

//HTTP logger
// app.use(morgan("combined"));

//Body parser
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

io.on("connection", (socket) => {
  // console.log(`A user connected`);

  ///Take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //Send message
  socket.on("sendMessage", ({ senderId, receiverId, type, message }) => {
    const user = getUser(receiverId);
    if (user && user.socketId) {
      io.to(user.socketId).emit("getMessage", {
        senderId,
        message,
        type,
      });
    }
  });

  socket.on("disconnect", () => {
    // console.log(`User disconnected`);
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

//Route
route(app);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Link: https://localhost:${PORT}`);
  // Fix server 12
});
