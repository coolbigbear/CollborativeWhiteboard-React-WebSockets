
const { getLines, clearLines } = require("./draw");
const draw = require("./draw");
const { clearImages, getImages, handleImage } = require("./image");
const image = require("./image");
const { clearNotes, handleNote, getNotes } = require("./note");
const { handleText, clearTexts, getTexts } = require("./text");
const text = require("./text")

function addToMemory(obj) {
    switchCaseForElements(obj, "create")
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

            else if (memory[i].type === "note" || memory[i].type === "image") {
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
    const activeImages = getImages()/*.filter(/* take the active texts );*/
    const activeLines = getLines()/*.filter(/* take the active texts );*/
    everythingArray = everythingArray.concat(activeNotes)
    everythingArray = everythingArray.concat(activeTexts)
    everythingArray = everythingArray.concat(activeImages)
    everythingArray = everythingArray.concat(activeLines)

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
    switchCaseForElements(obj, "edit")
}

function clearMemory() {
    clearNotes()
    clearTexts()
    clearImages()
    clearLines()
}

function removeElementAt(id) {

    let obj = getElementAt(id)
    switchCaseForElements(obj, "delete")
}

function switchCaseForElements(obj, action) {
    switch (obj.type) {
        case ("note"):
            handleNote(obj, action)
            break;
        case ("text"):
            handleText(obj, action)
            break;
        case ("image"):
            handleImage(obj, action)
            break;
        case ("draw"):
            handleDraw(obj, action)
            break;

        default:

    }
}

module.exports = { removeElementAt, clearMemory, replaceElementAt, getElementAt, addToMemory, checkIfMouseOnObject, getMemory }