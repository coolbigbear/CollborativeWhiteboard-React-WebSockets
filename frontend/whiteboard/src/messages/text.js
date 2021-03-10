import {addToMemory, getElementAt, getLengthOfMemory, replaceElementAt} from '../components/Canvas/Memory'

export function promptForText(context, coordinates) {
    let text = prompt("Please type in your text:")
    if (text === null) return;
    console.log(text)
    let temp = {
        text: text,
        coordinates: coordinates
    }
    addText(context, temp)    
}

export function changeTextValues(id, key, value) {
    let obj = getElementAt(id)
    let objOld = obj
    obj[key] = value
    replaceElementAt(id, obj, objOld)
}

export function changeTextPosition(id, key, value) {
    let obj = getElementAt(id)
    let objOld = obj
    obj["coordinates"][key] = value
    replaceElementAt(id, obj, objOld)
}

export function addText(context, element, addToMemoryToo = true) {

    let FONT_COLOR = "#000000"
    let FONT_SIZE = "80"

    if (element.hasOwnProperty('fontColor')) {
        FONT_COLOR = element.fontColor
    } else {
        FONT_COLOR = "#000000"
    }

    if (element.hasOwnProperty('fontSize')) {
        FONT_SIZE = element.fontSize
    } else {
        FONT_SIZE = "80"
    }

    context.font = `${FONT_SIZE}px Arial`;
    context.fillStyle = FONT_COLOR;
    context.fillText(element.text, element.coordinates.x, element.coordinates.y);

    let obj = calculateTextWidth(context, element)
    if (element !== obj) {
        // Recalc width and height of text
        replaceElementAt(element.id, obj, element)

    }

    if (addToMemoryToo) {
        let obj = {
            id: getLengthOfMemory() + 1,
            type: "text",
            text: element.text,
            fontSize: FONT_SIZE,
            fontColor: FONT_COLOR,
            coordinates: element.coordinates,
            selected: false
        }
        obj = calculateTextWidth(context, obj)
        addToMemory(obj)
    }
}

function calculateTextWidth(context, obj) {
    let dimensions = context.measureText(obj.text);
    obj.width = dimensions.width;
    obj.height = dimensions.actualBoundingBoxAscent
    return obj
}