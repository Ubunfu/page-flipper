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
    console.log(`[RTR] [GET /club/:clubId] ${JSON.stringify(club)}`);
    return res.render('club', {
        club,
        isRequesterAdmin: true,
        clubAdmins: [
            {
                firstName: "Ryan",
                lastName: "Allen Mcguidwin Miramonti Keel"
            },
            {
                firstName: "Angela",
                lastName: "Goodwin"
            }
        ],
        memberCount: 177,
        meetings: [
            {
                meetingId: "blablahblah",
                bookIconUrl: "https://img1.looper.com/img/gallery/the-director-of-it-wants-to-remake-stephen-kings-pet-sematary/intro-1505827169.jpg",
                bookTitle: "Pet Semetary",
                bookAuthor: "Stephen King",
                meetingDate: "June 1st, 2021"
            },
            {
                meetingId: "blablahblah",
                bookIconUrl: "https://img1.looper.com/img/gallery/the-director-of-it-wants-to-remake-stephen-kings-pet-sematary/intro-1505827169.jpg",
                bookTitle: "Pet Semetary",
                bookAuthor: "Stephen King",
                meetingDate: "June 1st, 2021"
            }
        ]
    })
})

module.exports = router