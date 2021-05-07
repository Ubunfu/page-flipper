const session = require('./session')
const hash = require('./hash')
const { dbService } = require('../db')

async function authenticateUser(req) {
    const email = req.body.email
    const enteredPassword = req.body.password
    console.log(`looking for a user with email: ${email}`);
    const user = await dbService.getUserByEmail(email) // throws 'user_not_found'
    console.log('checking hash...');
    await hash.checkHash(enteredPassword, user.pass_hash)
    console.log('creating session...');
    await session.createSession(req, user)
    console.log('created session!');
}

async function registerUser(req) {
    const user = await dbService.saveUser(req.body)
    await session.createSession(user)
}

module.exports = {
    authenticateUser,
    registerUser,
}