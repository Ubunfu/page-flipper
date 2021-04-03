const jwt = require('jsonwebtoken')

async function createSession(req) {
    const tokenPayload = { subject: req.body.email }
    const token = await createToken(tokenPayload)
    req.session.token = token
}

async function validateSession(req) {
    if (!req.session.token) {
        throw new Error('invalid_session')
    }
    try {
        jwt.verify(req.session.token, process.env.SESSION_SECRET)
    } catch (error) {
        console.log(error);
        throw new Error('invalid_session')
    }
}

async function createToken(tokenPayload) {
    return jwt.sign(tokenPayload, process.env.SESSION_SECRET, {
            expiresIn: process.env.SESSION_EXP_MS
        })
}

module.exports = {
    createSession,
    validateSession
}