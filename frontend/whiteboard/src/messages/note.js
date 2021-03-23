import { addToMemory } from '../components/Canvas/Memory'

export function promptForNote(context, coordinates) {
    let text = prompt("Please type in the text of your note:")
    if (text === null) return;
    let element = {
        text: text,
        coordinates: coordinates
    }
    addNote(context, element)
}

export function addNote(context, element, addToMemoryToo = true) {
    let NOTE_HEIGHT = 200
    let NOTE_WIDTH = 200
    let FONT_SIZE = 20
    let FONT_COLOR = "#000000"
    let FILL_COLOR = "#ffffff"
    
    if (element.hasOwnProperty('width')) {
        NOTE_WIDTH = element.width
    } else {
        NOTE_HEIGHT = 200;
    }

    if (element.hasOwnProperty('height')) {
        NOTE_HEIGHT = element.height
    } else {
        NOTE_WIDTH = 200
    }
    
    if (element.hasOwnProperty('fontSize')) {
        FONT_SIZE = element.fontSize
    } else {
        FONT_SIZE = 20
    }
    
    if (element.hasOwnProperty('fillColor')) {
        FILL_COLOR = element.fillColor
    } else {
        FILL_COLOR = "#ffffff"
    }
    
    if (element.hasOwnProperty('fontColor')) {
        FONT_COLOR = element.fontColor
    } else {
        FONT_COLOR = "#000000"
    }
    
    context.font = `${FONT_SIZE}px Arial`;
    context.fillStyle = FILL_COLOR;
    context.fillRect(element.coordinates.x, element.coordinates.y, NOTE_WIDTH, NOTE_HEIGHT);
    context.strokeRect(element.coordinates.x, element.coordinates.y, NOTE_WIDTH, NOTE_HEIGHT);
    context.fillStyle = FONT_COLOR;

    let textDimensions = context.measureText(element.text)
    let height = textDimensions.actualBoundingBoxAscent
    let width = textDimensions.width

    // TODO: Currently BROKEN
    if (width > NOTE_WIDTH) { // Text too long, need multiple fillText calls
        // console.log("Splitting text by space")
        // let calls = Math.ceil(width / NOTE_WIDTH)
        // console.log(calls)
        // let textArray = element.text.match(/.{1,calls}/g || [])
        // console.log(textArray)
        // for (;calls > 0; calls--) {
        //     context.fillText(textArray[calls], element.coordinates.x + 5, element.coordinates.y + height + 5)
        // }
    } else {
        // console.log("Adding note text")
        context.fillText(element.text, element.coordinates.x + 5, element.coordinates.y + height + 5);
    }

    if (addToMemoryToo) {
        let obj = {
            type: "note",
            text: element.text,
            fontSize: FONT_SIZE,
            fontColor: FONT_COLOR,
            fillColor: FILL_COLOR,
            height: NOTE_HEIGHT,
            width: NOTE_WIDTH,
            coordinates: element.coordinates,
            selected: false
        }
        addToMemory(obj)
    }
}