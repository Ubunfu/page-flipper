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
    let userRecord
    try {
        userRecord = await dbService.getUserById(decodedToken.subject)
    } catch (error) {
        console.log(`[RTR] [GET /dashboard] Error: ${error.message}`);
        console.log(`[RTR] [GET /dashboard] Clearing session cookie and redirecting to /login...`);
        return res.clearCookie('connect.sid').redirect('/login')
    }

    let clubs = await dbService.getClubsByUserId(userRecord.userId)
    
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