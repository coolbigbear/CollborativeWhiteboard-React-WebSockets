
let memory = [];

export function addToMemory(obj) {
    memory.push(obj)
}

export function checkIfMouseOnObject(coordinates) {

    for (let i = 0; i < memory.length; i++) {
        if (memory[i].type === "line") {
            if (coordinates.x >= memory[i].coordinates.start.x && coordinates.x <= memory[i].coordinates.start.x + memory[i].width && coordinates.y >= memory[i].coordinates.start.y - memory[i].height && coordinates.y <= memory[i].coordinates.start.y + memory[i].height) {
                return i;
            }
        } else {
            console.log("NO")
            if (coordinates.x >= memory[i].coordinates.x && coordinates.x <= memory[i].coordinates.x + memory[i].width && coordinates.y >= memory[i].coordinates.y - memory[i].height && coordinates.y <= memory[i].coordinates.y) {
                return i;
            }
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

export function removeElementAt(i) {
    if (i != null) {
        memory.splice(i, 1)
    }
}