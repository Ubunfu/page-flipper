const argon2 = require('argon2')

async function hashData(data) {
    return await argon2.hash(data, {
        type: argon2.argon2id,
        memoryCost: 2 ** 14,
        timeCost: 2,
        parallelism: 1
    })
}

async function checkHash(enteredData, hashedData) {
    if (!await argon2.verify(hashedData, enteredData)) {
        console.error('hash check failed');
        throw new Error('hash_check_failed')
    }
}

module.exports = {
    hashData,
    checkHash,
}