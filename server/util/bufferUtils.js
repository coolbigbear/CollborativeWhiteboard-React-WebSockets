function converJSONToBuffer(json) {
    return Buffer.from(JSON.stringify(json))
}

function convertBufferToJSON(buf) {
    let string = new TextDecoder().decode(new Uint8Array(buf))
    return JSON.parse(string)
}

module.exports = {converJSONToBuffer, convertBufferToJSON}