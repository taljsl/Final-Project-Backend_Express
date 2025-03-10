// const express = require("express");
// const app = express();
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");
// const routes = require("./routes");
// app.use(cors());

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: "*", methods: ["GET", "POST"] },
// });

// io.on("connection", (socket) => {
//   console.log(`a user connected ${socket.id}`);
  
//   socket.on("chat_message", (data) => {
//     socket.broadcast.emit("receive_message", data);
//   });
// });

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use("/api", routes);


// server.listen(5001, () => {
//   console.log("listening on 5001");
// });

// EVERYTHING ABOVE THIS LINE IS TRIAL
const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const routes = require("./routes");
const eiows = require("eiows");

// Load environment variables
dotenv.config();

// Create the app and server
const app = express();
const server = http.createServer(app);
// Middleware
app.use(cors());
app.use(express.json());
app.use("/api", routes);

// Initialize Socket.IO
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });

const io = new Server(server, {
    cors: {
      origin: "*", methods: ["GET", "POST"]
    },
  });


// io.on("connection", (socket) => {
//   console.log(`a user connected ${socket.id}`);
  
//   socket.on("chat_message", (data) => {
//     socket.broadcast.emit("receive_message", data);
//   });
// });
// server.listen(5001, () => {
//   console.log("listening on 5001");
// });
// Socket.IO logic
io.on("connection", (socket) => {
  console.log(`a user connected ${socket.id}`);

//   socket.on("join", (username) => {
//     io.emit("user-joined", username);
//   });
// // original here
//   socket.on("chat-message", (data) => {
//     socket.broadcast.emit("chat-message", `${data.username}: ${data.message}`);
//   });

  socket.on("chat-message", (data) => {
    io.emit("chat-message", data);
    // io.emit("chat-message", `${data.username}: ${data.message}`);
    // console.log(data)
  });
//   socket.on("leave", (username) => {
//     io.emit("user-left", username);
//   });

//   socket.on("disconnect", (reason) => {
//     console.log(`A user disconnected: ${socket.id}`, reason);
//   });
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


// // This is added be prepped to remove
// server.listen(5001, () => {
//   console.log("listening on 5001");
// });