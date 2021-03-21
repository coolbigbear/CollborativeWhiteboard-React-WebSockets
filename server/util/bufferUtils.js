function convertJSONToBuffer(json) {
    // console.log(JSON.stringify(json))
    return Buffer.from(JSON.stringify(json))
}

function convertMapToBuffer(map) {
    let array = Array.from(map.values())
    return Buffer.from(JSON.stringify(array))
}

function convertBufferToJSON(buf) {
    let string = new TextDecoder().decode(new Uint8Array(buf))
    return JSON.parse(string)
}

module.exports = {convertJSONToBuffer, convertMapToBuffer, convertBufferToJSON}