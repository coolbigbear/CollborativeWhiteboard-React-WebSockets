const { getUser, getUsersInRoom } = require("../users");

let memory = new Map()

function addToMemory(obj) {
    handleMessage(obj, "create")
}

function checkIfMouseOnObject(coordinates) {

    for (let i = memory.size; i > 0; i--) {
        let value = memory.get(i-1)
        if (value != null) {
            if (value.type === "line") {
                if (coordinates.x >= value.coordinates.start.x && coordinates.x <= value.coordinates.start.x + value.width && coordinates.y >= value.coordinates.start.y - value.height && coordinates.y <= value.coordinates.start.y + value.height) {
                    return value;
                }
            }
            else if (value.type === "note" || value.type === "image") {
                if (coordinates.x >= value.coordinates.x && coordinates.x <= value.coordinates.x + value.width && coordinates.y <= value.coordinates.y + value.height && coordinates.y >= value.coordinates.y) {
                    return value;
                }
            }

            else {
                if (coordinates.x >= value.coordinates.x && coordinates.x <= value.coordinates.x + value.width && coordinates.y >= value.coordinates.y - value.height && coordinates.y <= value.coordinates.y) {
                    return value;
                }
            }
        }
    }
}

function getMemory() {
    return memory
}

function getElementAt(id) {
    return memory.get(id)
}

function replaceElementAt(obj) {
    handleMessage(obj, "edit")
}

function clearMemory() {
    memory.clear()
}

function removeElementAt(id, obj=null) {
    // console.log("here1", obj)
    if (obj != null) {
        obj = getElementAt(id)
    }
    handleMessage(obj, "delete")
}

function handleMessage(data, action) {
    if (action === 'create') {
        console.log("creating ", data.type)
        data.id = memory.size;
        memory.set(data.id, data)
        // console.log(memory)
    } else if (action == 'edit') {
        memory.set(data.id, data)
    } else if (action == 'delete') {
        console.log("Deleting ", data.type)
        memory.delete(data.id)
    } else {
        console.log("--- Warning ---")
        console.log("Received unknown action")
    }
}

module.exports = { removeElementAt, clearMemory, replaceElementAt, getElementAt, addToMemory, checkIfMouseOnObject, getMemory, handleMessage }