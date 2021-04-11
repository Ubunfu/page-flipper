const express = require('express')
const { user, club } = require('../model')
const router = express.Router()
const { session } = require('../security')

router.use(async (req, res, next) => {
    try {
        await session.validateSession(req)
        next()
    } catch (error) {
        return res.redirect('/login')
    }
})

router.get('/club/create', (req, res) => {
    return res.render('clubCreate', {})
})

router.post('/club/create', async (req, res) => {
    let clubDetails = req.body
    const decodedToken = await session.decodeToken(req.session.token)
    const userId = decodedToken.subject
    clubDetails.admins = new Array(userId)
    const clubId = await club.saveClub(clubDetails)
    await user.addClubToUser(userId, clubId)
    return res.redirect('/dashboard')
})

module.exports = router