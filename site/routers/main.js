const express = require('express')
const { user, club } = require('../model')
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

    const userRecord = await user.getUserByToken(req.session.token)

    let clubs = []
    if (userRecord.clubs && userRecord.clubs.length > 0) {
        clubs = await club.getClubsByIds(userRecord.clubs)
    }
    
    return res.render('dashboard', {
        hasClubs: (clubs.length > 0 ? true : false),
        clubs: clubs
    })
})

router.get('/profile', async (req, res) => {
    try {
        await session.validateSession(req)
    } catch (error) {
        return res.redirect('/login')
    }

    const userRecord = await user.getUserByToken(req.session.token)

    return res.render('profile', {
        user: userRecord
    })
})

module.exports = router