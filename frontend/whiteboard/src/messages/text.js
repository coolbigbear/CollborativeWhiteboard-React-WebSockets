import {addToMemory, getLengthOfMemory } from '../components/Canvas/Memory'
import socket from '../components/socket';
import { convertJSONToBuffer } from '../util/bufferUtils';

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

export function changeTextValues(obj, key, value) {
    obj[key] = value
    socket.emit("message", convertJSONToBuffer(obj), "edit")
}

export function changeTextPosition(obj, key, value) {
    obj["coordinates"][key] = value
    socket.emit("message", convertJSONToBuffer(obj), "edit")
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
        FONT_SIZE = 80
    }

    context.font = `${FONT_SIZE}px Arial`;
    context.fillStyle = FONT_COLOR;
    context.fillText(element.text, element.coordinates.x, element.coordinates.y);

    // console.log("element", element)
    let width =  calculateTextWidth(context, element).width
    let height = calculateTextWidth(context, element).actualBoundingBoxAscent
    if (element.width !== width || element.height !== height) {
        // Recalc width and height of text
        console.log("resizing text")
        element.height = height
        element.width = width
        socket.emit("message", convertJSONToBuffer(element), "edit")

    }

    if (addToMemoryToo) {
        console.log("adding text to memory")
        let obj = {
            id: getLengthOfMemory() + 1,
            type: "text",
            text: element.text,
            fontSize: FONT_SIZE,
            fontColor: FONT_COLOR,
            coordinates: element.coordinates,
            selected: false
        }
        let dimensions = calculateTextWidth(context, obj)
        obj.width = dimensions.width
        obj.height = dimensions.actualBoundingBoxAscent
        addToMemory(obj)
    }
}

function calculateTextWidth(context, obj) {
    let dimensions = context.measureText(obj.text);
    return dimensions
}