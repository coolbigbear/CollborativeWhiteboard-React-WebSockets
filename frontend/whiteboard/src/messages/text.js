import {addToMemory} from '../components/Canvas/Memory'

export function promptForText(context, coordinates) {
    let text = prompt("Please type in your text:")
    if (text === null) return;
    console.log(text)
    addText(text, context, coordinates)    
}

export function addText(text, context, coordinates, addToMemoryToo = true) {
    context.font = "100px Arial";
    context.fillStyle = "red";
    context.fillText(text, coordinates.x, coordinates.y);

    if (addToMemoryToo) {
        let obj = {
            type: "text",
            text: text,
            font: 100,
            coordinates: coordinates,
            selected: false
        }
        obj = calculateTextWidth(context, obj)
        addToMemory(obj)
    }
}


function calculateTextWidth(context, obj) {
    obj.width = context.measureText(obj.text).width;
    obj.height = obj.font;
    return obj
}