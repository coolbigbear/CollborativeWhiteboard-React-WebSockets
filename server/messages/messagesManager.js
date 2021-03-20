
const draw = require("./draw");
const image = require("./image");
const { clearNotes, handleNote, getNotes } = require("./note");
const { handleText, clearTexts, getTexts } = require("./text");
const text = require("./text")

function addToMemory(obj) {
    switch (obj.type) {
        case ("note"):
            note.handleNote(obj, "create")
            break;
        case ("text"):
            text.handleText(obj, "create")
            break;
        case ("image"):

            break;
        case ("draw"):

            break;

        default:

    }
}

function checkIfMouseOnObject(coordinates) {

    let memory = getMemory()

    for (let i = 0; i < memory.length; i++) {
        if (memory[i] != null) {
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
}

function getMemory() {

    let everythingArray = []

    let activeNotes = getNotes()/*.filter( take the active texts );*/
    const activeTexts = getTexts()/*.filter(/* take the active texts );*/
    // const activeImages = images/*.filter(/* take the active texts );*/
    // const activeDrawings = drawings/*.filter(/* take the active texts );*/
    everythingArray = everythingArray.concat(activeNotes)
    everythingArray = everythingArray.concat(activeTexts)
    // everythingArray.concat(activeTexts)
    // everythingArray.concat(activeImages)
    // everythingArray.concat(activeDrawings)

    return everythingArray;
}

function getElementAt(id) {

    let memory = getMemory();

    return memory.find(element => {
        if (element != null) {
            element.id === id
        }
    })
}

function replaceElementAt(obj) {

    switch (obj.type) {
        case ("note"):
            handleNote(obj, "edit")
            break;
        case ("text"):
            handleText(obj, "edit")
            break;
        case ("image"):

            break;
        case ("draw"):

            break;
        
        default:
            
    }
}

function clearMemory() {
    clearNotes()
    clearTexts()
}

function removeElementAt(id) {

    let obj = getElementAt(id)

    switch (obj.type) {
        case ("note"):
            handleNote(obj, "delete")
            break;
        case ("text"):
            handleText(obj, "delete")
            break;
        case ("image"):

            break;
        case ("draw"):

            break;

        default:

    }
}

module.exports = { removeElementAt, clearMemory, replaceElementAt, getElementAt, addToMemory, checkIfMouseOnObject, getMemory}