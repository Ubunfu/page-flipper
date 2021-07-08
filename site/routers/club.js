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

router.get('/create', (req, res) => {
    return res.render('clubCreate', {
        isLoggedIn: true
    })
})

router.post('/create', async (req, res) => {
    let clubDetails = req.body
    const decodedToken = await session.decodeToken(req.session.token)
    const userId = decodedToken.subject
    const clubId = await dbService.saveClub(clubDetails)
    await dbService.saveClubMember(clubId, userId, 'ADMIN')
    return res.redirect('/dashboard')
})

router.get('/:clubId', async (req, res) => {
    const clubId = req.params.clubId
    const club = await dbService.getClubById(clubId)
    
    // Get list of club admins
    const clubAdmins = await dbService.getClubMembersWithRole(clubId, 'ADMIN')
    
    // Check if current user is a club admin
    const decodedToken = await session.decodeToken(req.session.token)
    const userId = decodedToken.subject
    let isRequesterAdmin = await userHasClubRole(userId, clubId, 'ADMIN')

    // Get list of club meetings
    const meetings = await dbService.getClubMeetings(clubId)

    // Get count of club members
    const memberCount = await dbService.getClubMemberCount(clubId)

    return res.render('club', {
        club,
        isRequesterAdmin,
        clubAdmins,
        memberCount,
        meetings,
        isLoggedIn: true
    })
})

router.get('/:clubId/edit', async (req, res) => {
    const decodedToken = await session.decodeToken(req.session.token)
    const userId = decodedToken.subject
    if (! await userHasClubRole(userId, req.params.clubId, 'ADMIN')) {
        return res.redirect('/error/forbidden')
    }
    const club = await dbService.getClubById(req.params.clubId)
    return res.render('clubEdit', { 
        club,
        isLoggedIn: true
    })
})

router.post('/:clubId/update', async (req, res) => {
    const clubId = req.params.clubId
    const decodedToken = await session.decodeToken(req.session.token)
    const userId = decodedToken.subject
    if (! await userHasClubRole(userId, req.params.clubId, 'ADMIN')) {
        return res.redirect('/error/forbidden')
    }
    let clubDetails = req.body
    clubDetails.clubId = clubId

    await dbService.updateClub(clubDetails)

    return res.redirect(`/club/${clubId}`)
})

router.post('/:clubId/meeting/:meetingId/comment', async (req, res) => {
    const clubId = req.params.clubId
    const meetingId = req.params.meetingId
    const comment = req.body.comment
    const commentUserId = req.body.userId

    await dbService.saveClubMeetingComment(meetingId, commentUserId, comment)

    return res.redirect(`/club/${clubId}/meeting/${meetingId}`)
})

router.get('/:clubId/meeting/:meetingId', async (req, res) => {
    const clubId = req.params.clubId
    const meetingId = req.params.meetingId

    // Get Club
    const club = await dbService.getClubById(clubId)

    // Get list of club meetings
    const meeting = await dbService.getClubMeetingById(meetingId)

    const meetingComments = await dbService.getClubMeetingComments(meeting.meetingId)

    // Get list of club admins
    const clubAdmins = await dbService.getClubMembersWithRole(clubId, 'ADMIN')
    
    // Check if current user is a club admin
    const decodedToken = await session.decodeToken(req.session.token)
    const userId = decodedToken.subject
    let isRequesterAdmin = await userHasClubRole(userId, clubId, 'ADMIN')

    // Get count of club members
    const memberCount = await dbService.getClubMemberCount(clubId)

    return res.render('clubMeeting', {
        userId,
        meeting,
        meetingComments,
        club,
        isRequesterAdmin,
        clubAdmins,
        memberCount,
        isLoggedIn: true
    })
})

async function userHasClubRole(userId, clubId, clubRole) {
    const membersWithRole = await dbService.getClubMembersWithRole(clubId, clubRole)
    let hasRole = false
    membersWithRole.forEach(member => {
        if (member.userId == userId) {
            hasRole = true
        }
    })
    return hasRole
}

module.exports = router