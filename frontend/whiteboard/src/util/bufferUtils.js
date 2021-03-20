export function convertJSONToBuffer(json) {
    return Buffer.from(JSON.stringify(json))
}

export function convertBufferToJSON(buf) {
    return JSON.parse(String.fromCharCode.apply(null, new Uint8Array(buf)))
}