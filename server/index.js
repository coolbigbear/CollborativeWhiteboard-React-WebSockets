const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const router = require("./router");
const { addUser, getUser, getAdminInRoom, removeUser, clearUsers } = require("./users");
const { getMemory, clearMemory, handleMessage } = require("./messages/messagesManager");
const { convertBufferToJSON, convertMapToBuffer, convertJSONToBuffer } = require("./util/bufferUtils");

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
			return callback(convertJSONToBuffer({ error: error }));
		}

		if (approval) {
			let admin = getAdminInRoom(room)
			if (admin != null) {
				let adminID = admin.id
				console.log(adminID)
				io.to(adminID).emit("userApprove", convertJSONToBuffer(user))
				let error = { error: "Waiting for host to approve" }
				return callback(convertJSONToBuffer(error))
			}
		} else {
			callback()
		}
	});

	socket.on("message", (data, action) => {

		dataJSON = convertBufferToJSON(data)
		switch (dataJSON.type) {
			case 'note':
				handleMessage(dataJSON, action)
				socket.broadcast.emit("message", data, action)
				break;

			case 'text':
				handleMessage(dataJSON, action)
				socket.broadcast.emit("message", data, action)
				break;

			case 'image':
				handleMessage(dataJSON, action)
				socket.broadcast.emit("message", data, action)
				break;

			case 'line':
				handleMessage(dataJSON, action)
				socket.broadcast.emit("message", data, action)
				break;

			case 'canvas':
				// console.log("Canvas called")
				let mem = getMemory()
				callback(convertMapToBuffer(mem))
				// const activeDrawings = draw.drawings.filter(/* take the active texts */);
				break;

			case 'user':
				console.log("user called", dataJSON, action)
				let user = getUser(dataJSON.user.id)
				let userID = user.id
				if (action == "approved") {
					console.log("Approving user")
					io.to(userID).emit("approved", dataJSON.user)
					io.to(userID).emit("redraw")
				}
				else if (action == "denied") {
					console.log("Denying user")
					io.to(userID).emit("denied", dataJSON.user)
					console.log("Removing user")
					removeUser(userID)
				}
				// const activeDrawings = draw.drawings.filter(/* take the active texts */);
				break;

			default:
			//
		}

	});

	socket.on("initCanvas", () => {
		console.log("Initilising canvas for new user")
		console.log("Socket ID", socket.id)
		let user = getUser(socket.id)
		console.log("USER", user)
		if (user != null) {
			let admin = getAdminInRoom(user.room)
			if (admin != null) {
				// Send back current whiteboard data
				io.to(socket.id).emit("initCanvas", convertMapToBuffer(getMemory()))
			}
		}
	})

	socket.on("sendClearCanvas", () => {
		console.log("Received clear canvas, broadcasting back")
		clearMemory()
		socket.broadcast.emit("clearCanvas")
	});

	socket.on("disconnect", () => {
		// Remove disconnected user
		let user = getUser(socket.id)
		if (user != null) {
			if (user.admin) {
				console.log("ADMIN LEFT, clearing board and kicking everyone out")
				clearMemory()
				socket.broadcast.emit("clearCanvas")
				console.log("Kicking users")
				socket.broadcast.emit("kickUser")
				clearUsers()
			}
			removeUser(socket.id)
		}
		console.log("we have lost conenction!!");
	});
});

app.use(router);

server.listen(PORT, () =>
	console.log(`Server has already started on port ${PORT}`)
);