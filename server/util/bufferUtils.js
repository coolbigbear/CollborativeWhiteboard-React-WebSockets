const CryptoJS = require("crypto-js")

function convertJSONToBuffer(json) {
    // console.log(JSON.stringify(json))
    return Buffer.from(encrypt(JSON.stringify(json)).toString())}

function convertMapToBuffer(map) {
    let array = Array.from(map.values())
    return Buffer.from(encrypt(JSON.stringify(array)).toString())
}

function convertBufferToJSON(buf) {
    let string = new TextDecoder().decode(new Uint8Array(buf))
    string = decrypt(string).toString(CryptoJS.enc.Utf8)
    return JSON.parse(string)
}

function encrypt(message) {
    return CryptoJS.Rabbit.encrypt(message, "password")
}

function decrypt(message) {
    return CryptoJS.Rabbit.decrypt(message, "password")
}

module.exports = {convertJSONToBuffer, convertMapToBuffer, convertBufferToJSON}