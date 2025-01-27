const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const routes = require("./routes");

// Load environment variables
dotenv.config();

// Create the app and server
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api", routes);

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join", (username) => {
    io.emit("user-joined", username);
  });

  socket.on("chat-message", (data) => {
    socket.broadcast.emit("chat-message", `${data.username}: ${data.message}`);
  });

  socket.on("leave", (username) => {
    io.emit("user-left", username);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Connect to MongoDB and start the server
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    server.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
