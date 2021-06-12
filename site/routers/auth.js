const express = require('express')
const { dbService } = require('../db')
const { validators, auth, session } = require('../security')
const router = express.Router()

router.get('/signup', async (req, res) => {
    if (req.query.errors) {
        const errors = req.query.errors.split(',')
        return res.render('signup', { 
            invalidFirstName: errors.includes('firstName'),
            invalidLastName: errors.includes('lastName'),
            invalidEmail: errors.includes('email'),
            invalidPassword: errors.includes('password'),
            idRegistered: errors.includes('id_registered')
        })
    }
    if (req.session.token) {
        return res.redirect('/dashboard')
    }
    return res.render('signup', {})
})

router.post('/signup', async (req, res) => {
    const invalidFields = await validators.findInvalidSignupFields(req)
    if (invalidFields.length != 0) {
        return res.redirect(`/signup?errors=${invalidFields}`)
    }
    try {
        // user already registered
        await dbService.getUserByEmail(req.body.email)
        console.log(`[RTR] [POST /signup] Error: user is already registered`);
        return res.redirect(`/signup?errors=id_registered`)
    } catch (error) {
        if (error.message === 'user_not_found') {
            // user not registered
            await auth.registerUser(req)
            return res.redirect('/')
        }
        console.log(`[RTR] [POST /signup] Error: ${error.message}`);
        return res.status(500).send('error registering user')
    }
})

router.get('/login', async (req, res) => {
    try {
        await session.validateSession(req)
        return res.redirect('/dashboard')
    } catch (error) {
        console.error(`[RTR] [GET /login] Login Error: ${error.message}`);
        return res.render('login', {
            invalidCredentials: (req.query.error && req.query.error === 'invalid_credentials'),
            sessionExpired: (req.session.token ? true : false)
        })
    }
})

router.post('/login', async (req, res) => {
    try {
        await auth.authenticateUser(req)
    } catch (error) {
        return res.redirect('/login?error=invalid_credentials')
    }
    return res.redirect('/')
})

router.get('/logout', async (req, res) => {
    return res.clearCookie('connect.sid').redirect('/login')
})

module.exports = router