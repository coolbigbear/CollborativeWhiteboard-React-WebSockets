import { checkIfMouseOnObject, handleMessage } from "../components/Canvas/Memory";

let mouseState = 'mouse';

export function setMouseState(state) {
    mouseState = state;
}

export function getMouseState() {
    return mouseState
}

export function handleMouse(mouseData, action, callback, socket) {
    if (action == 'moveObject') {
        let objOld = checkIfMouseOnObject(mouseData.coordinates.start)
        if (objOld != null) {
            let obj = JSON.parse(JSON.stringify(objOld))
            obj.coordinates.x += mouseData.coordinates.end.x - mouseData.coordinates.start.x;
            obj.coordinates.y += mouseData.coordinates.end.y - mouseData.coordinates.start.y;
            handleMessage(objOld, obj, "edit")
        }
    } else if (action == 'delete') {
        let obj = checkIfMouseOnObject(mouseData.coordinates.start)
        if (obj != null) {
            handleMessage(obj, obj, "delete")
        }
    } else {
        console.log("--- Warning ---")
        console.log("Received unknown action")
    }
}