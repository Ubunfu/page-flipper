const express = require('express')
const { user } = require('../model')
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
    if (await user.getUserByEmail(req.body.email)) {
        return res.redirect(`/signup?errors=id_registered`)
    }
    await auth.registerUser(req)
    return res.redirect('/')
})

router.get('/login', async (req, res) => {
    try {
        await session.validateSession(req)
        return res.redirect('/dashboard')
    } catch (error) {
        console.error(error);
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

module.exports = router