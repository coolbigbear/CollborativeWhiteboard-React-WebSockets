import {addToMemory, getLengthOfMemory, handleMessage } from '../components/Canvas/Memory'
import socket from '../components/socket';
import { convertJSONToBuffer } from '../util/bufferUtils';

export function promptForText(context, coordinates) {
    let text = prompt("Please type in your text:")
    if (text === null) return;
    console.log(text)
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let author = urlParams.get('name')
    let temp = {
        text: text,
        coordinates: coordinates,
        author: author
    }
    addText(context, temp)    
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
    context.fillStyle = FONT_COLOR
    context.fillText(element.text, element.coordinates.x, element.coordinates.y);

    // console.log("element", element)
    if (element.hasOwnProperty('width') || element.hasOwnProperty('height')) {
        let width = calculateTextWidth(context, element).width
        let height = calculateTextWidth(context, element).actualBoundingBoxAscent
        if (element.width !== width || element.height !== height) {
            // Recalc width and height of text
            console.log("resizing text")
            element.height = height
            element.width = width
            handleMessage(element, element, "edit", false, false)
        }
    }

    if (addToMemoryToo) {
        console.log("adding text to memory ", element)
        let obj = {
            type: "text",
            author: element.author,
            text: element.text,
            fontSize: FONT_SIZE,
            fontColor: FONT_COLOR,
            coordinates: element.coordinates,
            selected: false,
            width: 0,
            height: 0
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