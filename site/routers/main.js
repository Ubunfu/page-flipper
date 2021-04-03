const express = require('express')
const router = express.Router()
const { session } = require('../security')

router.get('/', async (req, res) => {
    try {
        await session.validateSession(req)
        return res.redirect('/dashboard')
    } catch (error) {
        return res.render('index', {})
    }
})

router.get('/dashboard', async (req, res) => {
    try {
        await session.validateSession(req)
        return res.render('dashboard', {})
    } catch (error) {
        return res.redirect('/')
    }
})

module.exports = router