import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./Lib/db.js";
import userRouter from "./routes/userRouts.js";
import massageRouter from "./routes/massageRouts.js";
import groupRouter from "./routes/groupRouts.js";
import { Server } from "socket.io";
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
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // --- WebRTC Video/Audio Call Signaling ---
  socket.on("callUser", ({ userToCall, signalData, from, name, profilePic }) => {
    const receiverSocketId = userSocketMap[userToCall];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("callUser", { signal: signalData, from, name, profilePic });
    }
  });

  socket.on("answerCall", (data) => {
    const callerSocketId = userSocketMap[data.to];
    if (callerSocketId) {
      io.to(callerSocketId).emit("callAccepted", data.signal);
    }
  });

  socket.on("ice-candidate", (data) => {
    const targetSocketId = userSocketMap[data.to];
    if (targetSocketId) {
      io.to(targetSocketId).emit("ice-candidate", data.candidate);
    }
  });

  socket.on("endCall", ({ to }) => {
    const targetSocketId = userSocketMap[to];
    if (targetSocketId) {
      io.to(targetSocketId).emit("callEnded");
    }
  });

  socket.on("typing", ({ senderId, receiverId }) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userTyping", { senderId });
    }
  });

  socket.on("stopTyping", ({ senderId, receiverId }) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userStopTyping", { senderId });
    }
  });
  // -----------------------------------------

  socket.on("disconnect", () => {
    console.log("user disconnected: " + userId);
    delete userSocketMap[userId];
    // Emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// middleware setup

app.use(express.json({ limit: "10mb" }));
app.use(cors());

app.use("/api/status", (req, res) => {
  res.send("server is live");
});

app.use("/api/auth", userRouter);

app.use("/api/messages", massageRouter);
app.use("/api/groups", groupRouter);
//  connect to the MongoDB database

await connectDB();

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;

  // start the server
  server.listen(PORT, () => {
    console.log("Server is running on port: " + PORT);
  });
}

// export the server for versel
export default server;
