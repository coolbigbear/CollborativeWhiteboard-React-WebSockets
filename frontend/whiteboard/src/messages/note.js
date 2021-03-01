import { addToMemory } from '../components/Canvas/Memory'

const NOTE_HEIGHT = 200
const NOTE_WIDTH = 200

export function promptForNote(context, coordinates) {
    let text = prompt("Please type in the text of your note:")
    if (text === null) return;
    addNote(text, context, coordinates)
}

export function addNote(text, context, coordinates, addToMemoryToo = true) {
    context.font = "20px Arial";
    context.fillStyle = "white";
    context.fillRect(coordinates.x, coordinates.y, NOTE_WIDTH, NOTE_HEIGHT);
    context.strokeRect(coordinates.x, coordinates.y, NOTE_WIDTH, NOTE_HEIGHT);
    context.fillStyle = "black";

    let textDimensions = context.measureText(text)
    let height = textDimensions.actualBoundingBoxAscent
    let width = textDimensions.width

    // Currently broken
    if (width > NOTE_WIDTH) { // Text too long, need multiple fillText calls
        console.log("Splitting text")
        let calls = Math.ceil(width / NOTE_WIDTH)
        console.log(calls)
        let textArray = text.match(/.{1,calls}/g || [])
        console.log(textArray)
        for (;calls > 0; calls--) {
            context.fillText(textArray[calls], coordinates.x + 5, coordinates.y + height + 5)
        }
    } else {
        console.log("Adding note text")
        context.fillText(text, coordinates.x + 5, coordinates.y + height + 5);
    }

    if (addToMemoryToo) {
        let obj = {
            type: "note",
            text: text,
            font: 100,
            height: NOTE_HEIGHT,
            width: NOTE_WIDTH,
            coordinates: coordinates,
            selected: false
        }
        addToMemory(obj)
    }
}