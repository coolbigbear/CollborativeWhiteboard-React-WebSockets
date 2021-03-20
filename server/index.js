const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const router = require("./router");
const { addUser, getUser, getUsersInRoom, getAdminInRoom, removeUser } = require("./users");
const { getMemory, clearMemory, checkIfMouseOnObject, getElementAt } = require("./messages/messagesManager");
const { handleNote } = require("./messages/note.js");
const { handleMouse } = require("./messages/mouse");
const { handleText } = require("./messages/text.js");
const { converJSONToBuffer, convertBufferToJSON } = require("./util/bufferUtils");
const { handleImage } = require("./messages/image.js");
const { handleDraw } = require("./messages/draw.js");

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set used transport technologies here
io.set("transports", ["websocket"]);

io.on("connection", (socket) => {

	console.log("connection")

	socket.on("poke", () => {
		console.log("youve been poked")
	});

	socket.on("join", ({ name, room }, callback) => {

		console.log("User", name, " joining");

		const { error, approval, user } = addUser(socket.id, name, room)

		if (error) {
			return callback({ error: error });
		}

		if (approval) {
			let admin = getAdminInRoom(room)
			let adminID = admin.id
			console.log(adminID)
			io.to(adminID).emit("userApprove", user)
			let error = { error: "Waiting for host to approve" }
			return callback(error)
		} else {
			// Send back current whiteboard data
			let memory = getMemory()
			return callback({ data: memory })
		}
	});

	socket.on("message", (data, action, callback = (() => { })) => {

		// console.log(data, action, callback)
		// console.log(action)
		data = convertBufferToJSON(data)

		switch (data.type) {

			case 'note':
				// console.log("Handling note")
				handleNote(data, action);
				socket.broadcast.emit("redraw")
				callback()
				// const activeNotes = note.notes.filter(/* take the active texts */);
				break;

			case 'text':
				// console.log("handling text")
				handleText(data, action);
				socket.broadcast.emit("redraw")
				callback()
				// const activeTexts = text.texts.filter(/* take the active texts */);
				break;

			case 'image':
				handleImage(data, action);
				socket.broadcast.emit("redraw")
				callback()
				// const activeImages = image.images.filter(/* take the active texts */);
				break;

			case 'line':
				handleDraw(data, action);
				socket.broadcast.emit("redraw")
				callback()
				// const activeDrawings = draw.drawings.filter(/* take the active texts */);
				break;

			case 'mouse':
				// console.log("handling mouse", data, action, callback)
				handleMouse(data, action, callback)
				socket.broadcast.emit("redraw")
				// const activeDrawings = draw.drawings.filter(/* take the active texts */);
				break;

			case 'canvas':
				// console.log("Canvas called")
				let mem = getMemory()
				callback(converJSONToBuffer(mem))
				// const activeDrawings = draw.drawings.filter(/* take the active texts */);
				break;

			case 'user':
				console.log("user called", data, action)
				let userID = getUser(data.user.id).id
				if (action == "approved") {
					console.log("Approving user")
					io.to(userID).emit("approved", data.user)
				}
				else if (action == "denied") {
					console.log("Denying user")
					io.to(userID).emit("denied", data.user)
					removeUser(userID)
				}
				// const activeDrawings = draw.drawings.filter(/* take the active texts */);
				break;

			default:
			//
		}

	});

	socket.on("sendClearCanvas", (clearMemoryToo) => {
		console.log("Received clear canvas, broadcasting back")
		socket.broadcast.emit("clearCanvas", clearMemoryToo)
	});

	socket.on("clearMemory", () => {
		console.log("Clearing memory")
		clearMemory()
	})

	socket.on("disconnect", () => {
		removeUser(socket.id)
		console.log("we have lost conenction!!");
	});
});

app.use(router);

server.listen(PORT, () =>
	console.log(`Server has already started on port ${PORT}`)
);

// module.exports = ({whiteboardItems})