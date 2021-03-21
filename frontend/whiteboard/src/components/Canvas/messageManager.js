import socket from "../socket";
const { convertBufferToJSON } = require("../../util/bufferUtils");
const { handleMessage } = require("./Memory");

test()

export function test() {
    socket.emit("poke")
}

socket.on("poke", () => {
    console.log("I've been poked")
})

socket.on("message", (data, action) => {

    // console.log("Receiving", data, action)
    // console.log(action)
    data = convertBufferToJSON(data)
    switch (data.type) {

        case 'note':
            // console.log("Handling note")
            handleMessage(null, data, action, false, false)
            // socket.broadcast.emit("redraw")
            // callback()
            // const activeNotes = note.notes.filter(/* take the active texts */);
            break;

        case 'text':
            // console.log("handling text")
            handleMessage(null, data, action, false, false)
            // socket.broadcast.emit("redraw")
            // callback()
            // const activeTexts = text.texts.filter(/* take the active texts */);
            break;

        case 'image':
            handleMessage(null, data, action, false, false)
            // socket.broadcast.emit("redraw")
            // callback()
            // const activeImages = image.images.filter(/* take the active texts */);
            break;

        case 'line':
            handleMessage(null, data, action, false, false)
            // socket.broadcast.emit("redraw")
            // callback()
            // const activeDrawings = draw.drawings.filter(/* take the active texts */);
            break;

        case 'canvas':
            // console.log("Canvas called")
            // let mem = getMemory()
            // callback(convertMapToBuffer(mem))
            // const activeDrawings = draw.drawings.filter(/* take the active texts */);
            break;
        default:
        //
    }

});