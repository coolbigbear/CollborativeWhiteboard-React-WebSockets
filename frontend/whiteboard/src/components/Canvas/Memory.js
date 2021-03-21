import { convertJSONToBuffer } from "../../util/bufferUtils";
import socket from "../socket";

let memory = new Map()
let undoCache = []

export function addToMemory(obj) {
    handleMessage(null, obj, "create")
}

export function checkIfMouseOnObject(coordinates) {

    for (let i = memory.size; i > 0; i--) {
        let value = memory.get(i - 1)
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
    undoCache.push(dataNew)
    console.log(undoCache)
}

export function undoAction() {
    if (undoCache.length !== 0) {
        console.log(undoCache)
        let data = undoCache.pop()
        console.log(data)
        console.log(undoCache)
        // Sanatize so it looks identical as normal data
        let action = data.action
        let previousData = data.previousData
        // delete data.previousData
        // delete data.action

        if (action == "create") {
            handleMessage(data, data, "delete", true, false)
        }
        else if (action == "edit") {
            handleMessage(previousData, previousData, "edit", true, false)
        }
        else if (action == "delete") {
            handleMessage(previousData, previousData, true, false)
        }
        else {
            console.log("Error, action for undoing unknown")
        }
    }
}

export function handleMessage(dataOld, data, action, sendToServer = true, pushToCache = true) {
    console.log("messageHandler", dataOld, data, action, sendToServer, pushToCache)
    if (action === 'create') {
        console.log("creating ", data.type)
        data.id = memory.size;
        memory.set(data.id, data)
        // console.log(memory)
    } else if (action == 'edit') {
        memory.set(data.id, data)
    } else if (action == 'delete') {
        console.log("Deleting ", data.type)
        console.log(memory.delete(data.id))
        console.log(memory)
        console.log(data)
    } else {
        console.log("--- Warning ---")
        console.log("Received unknown action")
        console.log(dataOld, data, action, sendToServer, pushToCache)
    }
    if (sendToServer) {
        let temp = convertJSONToBuffer(data)
        socket.emit("message", temp, action)
        if (pushToCache) {
            pushToUndoCache(dataOld, data, action)
        }
    }
}