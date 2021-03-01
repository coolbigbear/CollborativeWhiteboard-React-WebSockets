import { checkIfMouseOnObject, getElementAt, getMemory, replaceElementAt } from "../components/Canvas/Memory";

let mouseState = 'mouse';

export function handleMouse(context, coordinates) {
    return checkIfMouseOnObject(coordinates)
}

export function setMouseState(state) {
    mouseState = state;
}

export function getMouseState() {
    return mouseState
}

export function movingObject(selectedObject, mouseCoordinates) {
    if (selectedObject == null) {
        // console.log("No object under mouse")
        return
    } else {
        var obj = getElementAt(selectedObject);
        obj.coordinates.x += mouseCoordinates.end.x - mouseCoordinates.start.x;
        obj.coordinates.y += mouseCoordinates.end.y - mouseCoordinates.start.y;
        replaceElementAt(selectedObject, obj)
        console.log(getMemory())
    }
}