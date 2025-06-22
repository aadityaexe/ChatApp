import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connect } from "http2";
import { connectDB } from "./Lib/db.js";
import userRouter from "./routes/userRouts.js";
import massageRouter from "./routes/massageRouts.js";
import { Server, server } from "socket.io";
// create express app and http server
const app = express();
const server = http.createServer(app);

// initialize socket.io server

export const io = new Server(server, { cors: { origin: "*" } });

//  store online users

export const userSocketMap = {}; //{userId: socketId  }

// handle socket.io connections

io.on("connection", (socket) => {
  const { userId } = socket.handshake.query;

  console.log("user connection: " + userId);
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  //  Emit online users to all connected clients
  io.emit("online-users", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("user disconnected: " + userId);
    delete userSocketMap[userId];
    // Emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// middleware setup

app.use(express.json({ limit: "4mb" }));
app.use(cors());

app.use("/api/status", (req, res) => {
  res.send("server is live");
});

app.use("/api/auth", userRouter);

app.use("/api/messages", massageRouter);
//  connect to the MongoDB database

await connectDB();

const PORT = process.env.PORT || 5000;

// start the server
server.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
});
