import { convertJSONToBuffer } from "../../util/bufferUtils";
import socket from "../socket";

let memory = [];

export function addToMemory(obj) {
    socket.emit("message", convertJSONToBuffer(obj), "create")
}

export function getMemory() {
    return memory
}

export function getElementAt(id) {
    return memory.find(element => element.id === id)
}

export function replaceElementAt(id, obj, objOld) {
    let index = memory.indexOf(objOld)
    memory[index] = obj
}

export function clearMemory() {
    memory = []
}

export function removeElementAt(id) {
    if (id != null) {
        let objOld = getElementAt(id)
        let index = memory.indexOf(objOld)
        memory.splice(index, 1)
    }
    console.log(memory)
}

export function getLengthOfMemory() {
    return memory.length
}