const bcrypt = require('bcrypt')

async function hashData(data) {
    return await bcrypt.hash(data, 8)
}

async function checkHash(enteredData, hashedData) {
    if (!await bcrypt.compare(enteredData, hashedData)) {
        console.error('hash check failed');
        throw new Error('invalid_credentials')
    }
}

module.exports = {
    hashData,
    checkHash
}