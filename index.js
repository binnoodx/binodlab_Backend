const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Track number of connected sockets
let connectedSockets = 0;

io.on("connection", (socket) => {
  connectedSockets++;

  console.log("Online users:", connectedSockets);

  // ✅ Send immediately to new client
  socket.emit("online_count", connectedSockets);

  // ✅ Update everyone else
  socket.broadcast.emit("online_count", connectedSockets);

  socket.on("send_message", ({ name, text }) => {
    io.emit("receive_message", { name, text });
  });

  socket.on("disconnect", () => {
    connectedSockets--;
    console.log("Online users:", connectedSockets);
    io.emit("online_count", connectedSockets);
  });
});


const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
