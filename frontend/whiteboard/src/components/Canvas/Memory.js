import { convertJSONToBuffer } from "../../util/bufferUtils";
import socket from "../socket";
import { test } from "./messageManager";

let memory = new Map()
let undoCache = []

export function addToMemory(obj) {
    handleMessage(obj, "create")
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

export function replaceElementAt(obj) {
    handleMessage(obj, "edit")
}

export function clearMemory() {
    memory.clear()
}

export function removeElementAt(id, obj = null) {
    // console.log("here1", obj)
    if (obj != null) {
        obj = getElementAt(id)
    }
    handleMessage(obj, "delete")
}

export function handleMessage(data, action, sendToServer=true) {
    if (sendToServer) {
        let temp = convertJSONToBuffer(data)
        undoCache.push(data)
        socket.emit("message", temp, action)
    }
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