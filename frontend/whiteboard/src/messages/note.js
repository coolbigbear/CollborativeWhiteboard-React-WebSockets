import { addToMemory } from '../components/Canvas/Memory'

const NOTE_HEIGHT = 200
const NOTE_WIDTH = 200

export function promptForNote(context, coordinates) {
    let text = prompt("Please type in the text of your note:")
    if (text === null) return;
    console.log(text)
    addNote(text, context, coordinates)
}

export function addNote(text, context, coordinates, addToMemoryToo = true) {
    context.font = "20px Arial";
    context.fillStyle = "black";
    context.strokeRect(coordinates.x, coordinates.y, NOTE_WIDTH, NOTE_HEIGHT);
    let height = context.measureText(text).actualBoundingBoxAscent
    context.fillText(text, coordinates.x + 5, coordinates.y + height + 5, 200 - 5);


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