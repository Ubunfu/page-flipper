const express = require('express')
const router = express.Router()
const { session } = require('../security')

router.get('/', async (req, res) => {
    if (req.session.token) {
        return res.redirect('/dashboard')
    }
    return res.render('index', {})
})

router.get('/dashboard', async (req, res) => {
    // return res.render('dashboard', {})
    try {
        await session.validateSession(req)
        return res.render('dashboard', {})
    } catch (error) {
        return res.redirect('/login')
    }
})

module.exports = router