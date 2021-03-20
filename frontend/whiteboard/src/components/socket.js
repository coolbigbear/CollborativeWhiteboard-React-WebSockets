const io = require("socket.io-client")

const ENDPOINT = 'localhost:5000';

const socket = io(ENDPOINT, { transports: ['websocket'] });

export default socket;