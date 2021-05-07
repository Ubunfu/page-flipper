const express = require('express')
const { dbService } = require('../db')
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
    const user_id = decodedToken.subject
    const club_id = await dbService.saveClub(clubDetails)
    await dbService.saveClubMember(club_id, user_id, 'ADMIN')
    return res.redirect('/dashboard')
})

module.exports = router