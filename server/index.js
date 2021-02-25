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
  console.log("we have a new connection");

  socket.on("join", ({ name, room }) => {
    console.out(name);
  });

  socket.on("message", (data) => {

    function handleNote(noteData) {
      const action = noteData.action;
      if (action === 'create') {
        // create note
      }
      else if (action == 'move') {
        // move note
      } else if (action == 'edit') {
        // edit note
      } else if (action == 'delete') {
        // delete note
      } else {
        // ..
      }

    }

    function handleText(textData) {
      const action = textData.action;
      if (action === 'create') {
        // create text
      }
      else if (action == 'move') {
        // move text
      } else if (action == 'edit') {
        // delete text
      } else if (action == 'delete') {
        // delete text
      } else {
        // ..
      }


    }

    function handleImage(imageData) {
      const action = imageData.action;
      if (action === 'create') {
        // create image
      }
      else if (action == 'move') {
        // move image
      } else if (action == 'delete') {
        // delete image
      } else {
        // ..
      }


    }

    function draw(drawData) {
      const action = drawData.action;
      if (action === 'create') {
        // draw
      } else if (action == 'delete') {
        // erase
      } else {
        // ..
      }


    }

    switch (data.type)     {
      case 'note':
        handleNote(data);
        break;
      case 'text':
        handleText();
        break;
      case 'image':
        handleImage();
        break;
      case 'draw':
        draw();
      default:
        //..
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
