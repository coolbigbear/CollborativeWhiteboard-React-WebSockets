export function convertJSONToBuffer(json) {
    return Buffer.from(JSON.stringify(json))
}

export function convertBufferToJSON(buf) {
    let string = new TextDecoder().decode(new Uint8Array(buf))
    return JSON.parse(string)
}

export function convertBufferToMap(buf) {
    // console.log(buf)
    let map = new TextDecoder().decode(new Uint8Array(buf))
    return JSON.parse(map)
}