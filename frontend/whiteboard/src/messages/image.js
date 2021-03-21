import { addToMemory, getElementAt, getLengthOfMemory, handleMessage, replaceElementAt } from '../components/Canvas/Memory'
import socket from '../components/socket';
import { convertJSONToBuffer } from '../util/bufferUtils';

let img = null;

export function changeImageValues(obj, key, value) {
    obj[key] = value
    handleMessage(obj, "edit")
    // socket.emit("message", convertJSONToBuffer(obj), "edit")
}

export function changeImagePosition(obj, key, value) {
    obj["coordinates"][key] = value
    handleMessage(obj, "edit")
    // socket.emit("message", convertJSONToBuffer(obj), "edit")
}

export function deleteImage(obj) {
    handleMessage(obj, "delete")
    // socket.emit("message", convertJSONToBuffer(obj), "delete")
}

export function setImage(url) {
    console.log("Setting img to be: ", url)
    img = url;
}

export async function addImage(context, element, addToMemoryToo = true) {
    let IMG_HEIGHT = 200
    let IMG_WIDTH = 200

    var image = new Image();
    // context.drawImage(image, element.coordinates.x, element.coordinates.y, element.width, element.height)
    if (element.hasOwnProperty('imageData')) {
        image.src = element.imageData
    } else {
        image.src = img;
    }

    //Both below and above block are needed
    if (element.hasOwnProperty('width')) {
        IMG_WIDTH = element.width
    } else {
        IMG_WIDTH = image.naturalWidth
    }

    if (element.hasOwnProperty('height')) {
        IMG_HEIGHT = element.height
    } else {
        IMG_HEIGHT = image.naturalHeight
    }
    
    context.drawImage(image, element.coordinates.x, element.coordinates.y, IMG_WIDTH, IMG_HEIGHT)
    
    image.addEventListener('load', function () {
        
        //Both below and above block are needed
        if (element.hasOwnProperty('width')) {
            IMG_WIDTH = element.width
        } else {
            IMG_WIDTH = image.naturalWidth
        }
    
        if (element.hasOwnProperty('height')) {
            IMG_HEIGHT = element.height
        } else {
            IMG_HEIGHT = image.naturalHeight
        }
        
        if (addToMemoryToo) {
            let imageData = null
            toDataUrl(image.src, function (base64Img) {
                imageData = base64Img;
                let obj = {
                    id: null,
                    type: "image",
                    imageData: imageData,
                    height: IMG_HEIGHT,
                    width: IMG_WIDTH,
                    coordinates: element.coordinates,
                    selected: false
                }
                console.log(obj)
                addToMemory(obj)
            })
        }

    }, false);
}

function toDataUrl(src, callback, outputFormat) {
    // Create an Image object
    var img = new Image();
    // Add CORS approval to prevent a tainted canvas
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
        // Create an html canvas element
        var canvas = document.createElement('CANVAS');
        // Create a 2d context
        var ctx = canvas.getContext('2d');
        var dataURL;
        // Resize the canavas to the original image dimensions
        canvas.height = this.naturalHeight;
        canvas.width = this.naturalWidth;
        // Draw the image to a canvas
        ctx.drawImage(this, 0, 0);
        // Convert the canvas to a data url
        dataURL = canvas.toDataURL("image/jpeg", 0.2);
        // Return the data url via callback
        callback(dataURL);
        // Mark the canvas to be ready for garbage 
        // collection
        canvas = null;
    };
    // Load the image
    img.src = src;
    // make sure the load event fires for cached images too
    if (img.complete || img.complete === undefined) {
        // Flush cache
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
        // Try again
        img.src = src;
    }
}