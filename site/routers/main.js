const express = require('express')
const { dbService } = require('../db')
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

    const decodedToken = await session.decodeToken(req.session.token)
    const userRecord = await dbService.getUserById(decodedToken.subject)

    let clubs = await dbService.getClubsByUserId(userRecord.user_id)
    console.log(clubs);
    
    return res.render('dashboard', {
        hasClubs: (clubs.length > 0 ? true : false),
        clubs
    })
})

router.get('/profile', async (req, res) => {
    try {
        await session.validateSession(req)
    } catch (error) {
        return res.redirect('/login')
    }

    const decodedToken = await session.decodeToken(req.session.token)
    const user = await dbService.getUserById(decodedToken.subject)

    return res.render('profile', {
        user
    })
})

module.exports = router