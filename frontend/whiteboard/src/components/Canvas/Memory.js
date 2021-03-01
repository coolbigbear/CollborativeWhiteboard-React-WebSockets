
let memory = [];

export function addToMemory(obj) {
    memory.push(obj)
}

export function checkIfMouseOnObject(coordinates) {

    for (let i = 0; i < memory.length; i++) {
        if (coordinates.x >= memory[i].x && coordinates.x <= memory[i].x + memory[i].width && coordinates.y >= memory[i].y - memory[i].height && coordinates.y <= memory[i].y) {
            return i;
        }
        
    }
}

export function getMemory() {
    return memory
}

export function getElementAt(i) {
    return memory[i]
}

export function replaceElementAt(i, obj) {
    memory[i] = obj
}

export function clearMemory() {
    memory = []
}