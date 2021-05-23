function base64Encode(data) {
    return Buffer.from(data).toString('base64')
}

function base64Decode(data) {
    return Buffer.from(data, 'base64').toString('ascii')
}

module.exports = {
    base64Encode,
    base64Decode,
}