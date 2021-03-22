import { convertJSONToBuffer } from "../../util/bufferUtils";
import socket from "../socket";

let memory = new Map()
let undoCache = []

export function addToMemory(obj) {
    handleMessage(null, obj, "create")
}

export function checkIfMouseOnObject(coordinates) {
    let array = Array.from(memory, ([key, value]) => value);
    for (let i = array.length; i > 0; i--) {
        let value = array[i - 1]
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

export function getUndoCache() {
    return undoCache
}

export function getMemory() {
    return memory
}

export function setMemory(array) {
    memory = new Map(array.map(obj => [obj.id, obj]));
}

export function getElementAt(id) {
    return memory.get(id)
}

export function clearMemory() {
    memory.clear()
    undoCache.length = 0
}

export function removeElementAt(id, obj = null) {
    // console.log("here1", obj)
    if (obj != null) {
        obj = getElementAt(id)
    }
    handleMessage(obj, obj, "delete")
}

export function pushToUndoCache(dataOld, dataNew, action) {
    dataNew = JSON.parse(JSON.stringify(dataNew)) // Create deep copy
    dataNew.action = action
    dataNew.previousData = dataOld
    // console.log("Pushing", dataNew)
    undoCache.push(dataNew)
}

export function undoAction() {
    if (undoCache.length !== 0) {
        let data = undoCache.pop()
        // console.log(data)
        let action = data.action
        // console.log(action)
        let previousData = data.previousData
        // Sanatize so it looks identical as normal data
        delete data.previousData
        delete data.action

        if (action == "create") {
            handleMessage(data, data, "delete", true, false)
        }
        else if (action == "edit") {
            handleMessage(previousData, previousData, "edit", true, false)
        }
        else if (action == "delete") {
            handleMessage(previousData, previousData, "create", true, false)
        }
        else {
            console.log("Error, action for undoing unknown")
        }
    }
}

export function handleMessage(dataOld, data, action, sendToServer = true, pushToCache = true) {
    // console.log("messageHandler", dataOld, data, action, sendToServer, pushToCache)
    // console.log(memory)
    if (action === 'create') {
        console.log("creating ", data.type)
        if (!data.hasOwnProperty("id")) { // Check if data already has ID, if not set it.
            data.id = Math.floor(Math.random() * 1000000000);
        }
        memory.set(data.id, data)
    } else if (action == 'edit') {
        memory.set(data.id, data)
    } else if (action == 'delete') {
        console.log("Deleting ", data.type)
        memory.delete(data.id)
        // console.log(memory)
    } else {
        console.log("--- Warning ---")
        console.log("Received unknown action")
        // console.log(dataOld, data, action, sendToServer, pushToCache)
    }
    if (sendToServer) {
        let temp = convertJSONToBuffer(data)
        socket.emit("message", temp, action)
        if (pushToCache) {
            pushToUndoCache(dataOld, data, action)
        }
    }
}