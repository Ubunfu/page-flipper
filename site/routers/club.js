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
    const userId = decodedToken.subject
    const clubId = await dbService.saveClub(clubDetails)
    await dbService.saveClubMember(clubId, userId, 'ADMIN')
    return res.redirect('/dashboard')
})

router.get('/club/:clubId', async (req, res) => {
    const clubId = req.params.clubId
    const club = await dbService.getClubById(clubId)
    
    // Get list of club admins
    const clubAdmins = await dbService.getClubMembersWithRole(clubId, 'ADMIN')
    
    // Check if current user is a club admin
    const decodedToken = await session.decodeToken(req.session.token)
    const userId = decodedToken.subject
    let isRequesterAdmin = false
    clubAdmins.forEach(clubAdmin => {
        if (clubAdmin.userId == userId) {
            isRequesterAdmin = true
        }
    })

    // Get list of club meetings
    const meetings = await dbService.getClubMeetings(clubId)

    // Get count of club members
    const memberCount = await dbService.getClubMemberCount(clubId)

    return res.render('club', {
        club,
        isRequesterAdmin,
        clubAdmins,
        memberCount,
        meetings
    })
})

router.get('/club/:clubId/edit', async (req, res) => {
    const club = await dbService.getClubById(req.params.clubId)
    return res.render('clubEdit', { club })
})

router.post('/club/:clubId/update', async (req, res) => {
    const clubId = req.params.clubId
    let clubDetails = req.body
    clubDetails.clubId = clubId

    await dbService.updateClub(clubDetails)

    return res.redirect(`/club/${clubId}`)
})

module.exports = router