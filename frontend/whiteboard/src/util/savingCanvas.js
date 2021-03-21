const { getMemory } = require("../components/Canvas/Memory");
const { addImage } = require("../messages/image");
const { addNote } = require("../messages/note");
const { addText } = require("../messages/text");
const { drawLine } = require("../messages/draw");


export function saveCanvasAsImage(imageType) {
    let tempCanvas = null;
    // If JPEG, create a in memory canvas, draw a white square and redraw everything on it
    // Since the current "white" background is actually transparent and not what you'd want with JPEG
    if (imageType == "jpeg") {
        tempCanvas = document.createElement('CANVAS')
        let context = tempCanvas.getContext('2d');
        tempCanvas.height = 800;
        tempCanvas.width = 1500;
        context.fillStyle = "#FFFFFF";
        context.fillRect(0, 0, tempCanvas.width, tempCanvas.height)

        let memory = getMemory()
        memory.forEach(element => {
            if (element != null) {
                if (element.type === "text") {
                    addText(context, element, false)
                }
                if (element.type === "line") {
                    drawLine(context, element.coordinates, false)
                }
                if (element.type === "note") {
                    addNote(context, element, false)
                }
                if (element.type === "image") {
                    addImage(context, element, false)
                }
            }
        });
        
    } else {
        tempCanvas = document.getElementById("canvas");
    }

    let link = document.getElementById('link');
    link.setAttribute('download', `Canvas.${imageType}`);
    link.setAttribute('href', tempCanvas.toDataURL(`image/${imageType}`).replace(`image/${imageType}`, "image/octet-stream"));
    link.click();
    tempCanvas = null;
}