function converJSONToBuffer(json) {
    return Buffer.from(JSON.stringify(json))
}

function convertBufferToJSON(buf) {
    return JSON.parse(String.fromCharCode.apply(null, new Uint8Array(buf)))
}

module.exports = {converJSONToBuffer, convertBufferToJSON}