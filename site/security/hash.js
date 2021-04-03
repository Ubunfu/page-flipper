const bcrypt = require('bcrypt')

async function hashData(data) {
    return await bcrypt.hash(data, 8)
}

module.exports = {
    hashData
}