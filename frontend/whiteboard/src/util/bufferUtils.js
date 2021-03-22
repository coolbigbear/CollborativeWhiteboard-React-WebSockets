import CryptoJS from "crypto-js"

export function convertJSONToBuffer(json) {
    return Buffer.from(encrypt(JSON.stringify(json)).toString())
}

export function convertBufferToJSON(buf) {
    let string = new TextDecoder().decode(new Uint8Array(buf))
    string = decrypt(string).toString(CryptoJS.enc.Utf8)
    return JSON.parse(string)
}

export function convertBufferToMap(buf) {
    let map = new TextDecoder().decode(new Uint8Array(buf))
    map = decrypt(map).toString(CryptoJS.enc.Utf8)
    return JSON.parse(map)
}

function encrypt(message) {
    return CryptoJS.Rabbit.encrypt(message, "password")
}

function decrypt(message) {
    return CryptoJS.Rabbit.decrypt(message, "password")
}