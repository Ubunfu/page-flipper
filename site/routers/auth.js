const express = require('express')
const { validators, auth } = require('../security')
const router = express.Router()

router.get('/signup', (req, res) => {
    if (req.query.errors) {
        const invalidFields = req.query.errors.split(',')
        return res.render('signup', { 
            invalidFirstName: invalidFields.includes('firstName'),
            invalidLastName: invalidFields.includes('lastName'),
            invalidEmail: invalidFields.includes('email'),
            invalidPassword: invalidFields.includes('password')
         })
    }
    return res.render('signup', {})
})

router.post('/signup', async (req, res) => {
    const invalidFields = await validators.findInvalidSignupFields(req)
    if (invalidFields.length != 0) {
        return res.redirect(`/signup?errors=${invalidFields}`)
    }
    await auth.registerUser(req)
    return res.redirect('/')
})

router.get('/login', (req, res) => {
    return res.render('login', {})
})

router.post('/login', (req, res) => {
    // TODO
})

module.exports = router