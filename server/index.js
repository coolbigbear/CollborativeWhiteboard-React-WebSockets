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

const note = require('./messages/note.js');
const text = require('./messages/text.js');
const image = require('./messages/image.js');
const draw = require('./messages/draw.js');

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set used transport technologies here
io.set("transports", ["websocket"]);

io.on("connection", (socket) => {
  console.log("we have a new connection");

  socket.on("join", ({ name, room }) => {
    console.out(name);
  });

  socket.on("message", (data) => {

    data.id = whiteboardItems.length();
    whiteboardItems.push(data);

    switch (data.type)     {

      case 'note':
        note.handleNote(data);
        
        break;

      case 'text':
        text.handleText(data);
        break;

      case 'image':
        image.handleImage(data);
        break;

      case 'draw':
        draw.draw(data);

      default:
        //
    }

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

module.exports = ({whiteboardItems})