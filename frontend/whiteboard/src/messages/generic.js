import { handleMessage } from "../components/Canvas/Memory"

export function changeObjectValues(objOld, key, value) {
    let obj = JSON.parse(JSON.stringify(objOld))    //Creates a deep copy of object
    obj[key] = value
    handleMessage(objOld, obj, "edit")
}

export function changeObjectPosition(objOld, key, value) {
    let obj = JSON.parse(JSON.stringify(objOld))    //Creates a deep copy of object
    obj["coordinates"][key] = value
    handleMessage(objOld, obj, "edit")
}

export function deleteObj(objOld) {
    let obj = JSON.parse(JSON.stringify(objOld))    //Creates a deep copy of object
    handleMessage(objOld, obj, "delete")
}