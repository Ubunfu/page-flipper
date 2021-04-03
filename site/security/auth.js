const session = require('./session')
const { user } = require('../model')

async function authenticateUser() {
    
}

async function registerUser(req) {
    await user.saveUser(req.body)
    await session.createSession(req)
}

module.exports = {
    authenticateUser,
    registerUser
}