const { converJSONToBuffer } = require("../util/bufferUtils");
const { removeElementAt } = require("./messagesManager");
const { checkIfMouseOnObject, getElementAt, replaceElementAt, getMemory } = require("./messagesManager");

function handleMouse(mouseData, action, callback, socket) {
    // console.log("action is", action)
    // console.log(mouseData)
    if (action === 'checkIfMouseOnObject') {
        let obj = checkIfMouseOnObject(mouseData.coordinates)
        if (obj === undefined) {
            obj = {}
        }
        callback(converJSONToBuffer(obj))
    } else if (action == 'moveObject') {
        let obj = checkIfMouseOnObject(mouseData.coordinates.end)
        if (obj != null) {
            obj.coordinates.x += mouseData.coordinates.end.x - mouseData.coordinates.start.x;
            obj.coordinates.y += mouseData.coordinates.end.y - mouseData.coordinates.start.y;
            replaceElementAt(obj)
            callback()
            socket.broadcast.emit("redraw")
        }
    } else if (action == 'edit') {
        for (let index = 0; index < notes.length; index++) {
            const element = notes[index];
            if (element.id == noteData.id) {
                notes[index] = noteData;
                break;
            }
        }
    } else if (action == 'delete') {
        let obj = checkIfMouseOnObject(mouseData.coordinates.start)
        if (obj != null) {
            removeElementAt(obj.id, obj)
            socket.emit("redraw")
        }
    } else {
        console.log("Wow")
    }
}

module.exports = ({ handleMouse });