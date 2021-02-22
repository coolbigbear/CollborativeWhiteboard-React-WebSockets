const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
} = require("./users");
// const { addRoom, getRoom } = require("./room");
const router = require("./router");


const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set used transport technologies here
io.set("transports", ["websocket"]);

io.on("connection", (socket) => {

  socket.on("join", (data) => {

  });

  socket.on("canvas_mouse_co-ordinates", (coordinates) => {
    console.log("Received mouse coordinates: ",coordinates)
  });

  socket.on("canvas_clear", () => {
    console.log("Received canvas clear command")
  });

  socket.on("disconnect", () => {
    console.log("we have lost conenction!!");
  });
});

app.use(router);

server.listen(PORT, () =>
  console.log(`Server has already started on port ${PORT}`)
);
