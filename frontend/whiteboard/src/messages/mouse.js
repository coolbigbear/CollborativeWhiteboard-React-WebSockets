import { checkIfMouseOnObject, handleMessage } from "../components/Canvas/Memory";

let mouseState = 'mouse';

export function setMouseState(state) {
    mouseState = state;
}

export function getMouseState() {
    return mouseState
}

export function handleMouse(mouseData, action, callback, socket) {
    // console.log("action is", action)
    // console.log(mouseData)
    if (action == 'moveObject') {
        let obj = checkIfMouseOnObject(mouseData.coordinates.start)
        if (obj != null) {
            obj.coordinates.x += mouseData.coordinates.end.x - mouseData.coordinates.start.x;
            obj.coordinates.y += mouseData.coordinates.end.y - mouseData.coordinates.start.y;
            handleMessage(obj, "edit")
        }
    } else if (action == 'delete') {
        let obj = checkIfMouseOnObject(mouseData.coordinates.start)
        if (obj != null) {
            handleMessage(obj, "delete")
        }
    } else {
        console.log("--- Warning ---")
        console.log("Received unknown action")
    }
}