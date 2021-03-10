import { addToMemory, getLengthOfMemory } from "../components/Canvas/Memory";


export function drawLine(context, coordinates, addToMemoryToo = true) {
    context.beginPath();
    context.moveTo(coordinates.start.x, coordinates.start.y);
    context.lineTo(coordinates.end.x, coordinates.end.y);
    context.strokeStyle = coordinates.color.hex;
    context.lineWidth = 3;
    context.stroke();
    context.closePath();

    if (addToMemoryToo) {
        let obj = {
            id: getLengthOfMemory() + 1,
            type: "line",
            width: 10,
            height: 10,
            selected: false,
            coordinates: coordinates
        }
        addToMemory(obj)
    }
}
