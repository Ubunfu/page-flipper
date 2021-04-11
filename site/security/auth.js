const session = require('./session')
const hash = require('./hash')
const { user } = require('../model')

async function authenticateUser(req) {
    const email = req.body.email
    const enteredPassword = req.body.password
    console.log(`looking for a user with email: ${email}`);
    const foundUser = await user.getUserByEmail(email) // throws 'user_not_found'
    console.log('checking hash...');
    await hash.checkHash(enteredPassword, foundUser.passHash)
    console.log('creating session...');
    await session.createSession(req)
    console.log('created session!');
}

async function registerUser(req) {
    await user.saveNewUser(req.body)
    await session.createSession(req)
}

module.exports = {
    authenticateUser,
    registerUser,
}