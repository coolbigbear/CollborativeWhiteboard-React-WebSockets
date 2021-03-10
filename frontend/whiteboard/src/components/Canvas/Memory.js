
let memory = [];

export function addToMemory(obj) {
    memory.push(obj)
}

export function checkIfMouseOnObject(coordinates) {

    for (let i = 0; i < memory.length; i++) {
        if (memory[i].type === "line") {
            if (coordinates.x >= memory[i].coordinates.start.x && coordinates.x <= memory[i].coordinates.start.x + memory[i].width && coordinates.y >= memory[i].coordinates.start.y - memory[i].height && coordinates.y <= memory[i].coordinates.start.y + memory[i].height) {
                return memory[i];
            }
        }
        
        else if (memory[i].type === "note") {
            if (coordinates.x >= memory[i].coordinates.x && coordinates.x <= memory[i].coordinates.x + memory[i].width && coordinates.y <= memory[i].coordinates.y + memory[i].height && coordinates.y >= memory[i].coordinates.y) {
                return memory[i];
            }
        }
        
        else {
            if (coordinates.x >= memory[i].coordinates.x && coordinates.x <= memory[i].coordinates.x + memory[i].width && coordinates.y >= memory[i].coordinates.y - memory[i].height && coordinates.y <= memory[i].coordinates.y) {
                return memory[i];
            }
        }
    }
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