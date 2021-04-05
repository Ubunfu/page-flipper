const express = require('express')
const { user } = require('../model')
const router = express.Router()
const { session } = require('../security')

router.get('/', async (req, res) => {
    if (req.session.token) {
        return res.redirect('/dashboard')
    }
    return res.render('index', {})
})

router.get('/dashboard', async (req, res) => {
    try {
        await session.validateSession(req)
    } catch (error) {
        return res.redirect('/login')
    }
    const clubs = await user.getUserByToken(req.session.token).clubs
    
    return res.render('dashboard', {
        hasClubs: (clubs && clubs.length > 0 ? true : false),
        clubs: clubs
    })
})

module.exports = router