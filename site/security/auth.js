const session = require('./session')
const hash = require('./hash')
const { dbService } = require('../db')

async function authenticateUser(req) {
    const email = req.body.email
    const enteredPassword = req.body.password
    console.log(`[SEC AUTH] attempting to authenticate user...`);
    const user = await dbService.getUserByEmail(email) // throws 'user_not_found'
    console.log('[SEC AUTH] checking hash...');
    await hash.checkHash(enteredPassword, user.passHash)
    console.log('[SEC AUTH] creating session...');
    await session.createSession(req, user)
    console.log('[SEC AUTH] created session!');
}

async function registerUser(req) {
    const user = await dbService.saveUser(req.body)
    await session.createSession(req, user)
}

module.exports = {
    authenticateUser,
    registerUser,
}