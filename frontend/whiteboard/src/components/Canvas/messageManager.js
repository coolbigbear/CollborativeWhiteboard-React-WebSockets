import socket from "../socket";
const { convertBufferToJSON } = require("../../util/bufferUtils");
const { handleMessage } = require("./Memory");

test()

export function test() {
    socket.emit("poke")
}

socket.on("poke", () => {
    console.log("FUCK me")
})

socket.on("wow", () => {
    console.log("why")
})

socket.on("message", (data, action) => {

    // console.log(data, action, callback)
    // console.log(action)
    data = convertBufferToJSON(data)
    switch (data.type) {

        case 'note':
            // console.log("Handling note")
            handleMessage(data, action, false);
            // socket.broadcast.emit("redraw")
            // callback()
            // const activeNotes = note.notes.filter(/* take the active texts */);
            break;

        case 'text':
            // console.log("handling text")
            handleMessage(data, action, false);
            // socket.broadcast.emit("redraw")
            // callback()
            // const activeTexts = text.texts.filter(/* take the active texts */);
            break;

        case 'image':
            handleMessage(data, action, false);
            // socket.broadcast.emit("redraw")
            // callback()
            // const activeImages = image.images.filter(/* take the active texts */);
            break;

        case 'line':
            handleMessage(data, action, false);
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