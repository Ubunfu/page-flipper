const { encoders } = require('../util')
const { format, formatISO9075 } = require('date-fns')
const nanoid = require('nanoid')

/**
 * Returns the set of all meetings scheduled for a given club
 * @param {string} clubId 
 */
async function getClubMeetings(pool, schemaName, clubId) {
    const queryString = 
        `select * from ${schemaName}."club_meeting" ` + 
        `where "clubId" = '${clubId}' ` + 
        `order by "meetingDate" desc`
    const dbResponse = await pool.query(queryString)
    return decodeMeetingArray(dbResponse.rows)
}

/**
 * Returns a meeting scheduled for a given club
 * @param {string} meetingId 
 */
async function getClubMeetingById(pool, schemaName, meetingId) {
    const queryString = 
        `select * from ${schemaName}."club_meeting" ` + 
        `where "meetingId" = '${meetingId}'`
    const dbResponse = await pool.query(queryString)
    return decodeMeetingObject(dbResponse.rows[0])
}

/**
 * Saves a comment associated with a user in a club meeting
 * @param {*} meetingId The ID of the meeting in which the comment is associated
 * @param {*} userId The ID of the comment author
 * @param {*} comment The comment text
 * @returns 
 */
async function saveClubMeetingComment(pool, schemaName, meetingId, userId, comment) {
    const commentId = nanoid.nanoid()
    const commentTimestamp = Math.floor(new Date().getTime() / 1000) // epoch timestamp
    const encodedComment = encoders.base64Encode(comment)
    const queryString = 
        `insert into ${schemaName}."club_meeting_comment" ` +
        `("commentId", "meetingId", "userId", "commentTimestamp", "comment") ` + 
        `values ('${commentId}', '${meetingId}', '${userId}', ${commentTimestamp}, '${encodedComment}')`
    await pool.query(queryString)
    return commentId
}

/**
 * Returns all the discussion comments associated with a club meeting
 * @param {*} meetingId 
 * @returns 
 */
async function getClubMeetingComments(pool, schemaName, meetingId) {
    const queryString = 
        `SELECT c."commentId", c."meetingId", c."userId", c."commentTimestamp", c."comment", u."firstName", u."lastName" ` + 
        `from ${schemaName}."club_meeting_comment" as c ` +
        `inner JOIN ${schemaName}."user" as u on c."userId"=u."userId" ` +
        `where "meetingId" = '${meetingId}' ` +
        `order by "commentTimestamp" desc`
    const dbResponse = await pool.query(queryString)
    return decodeCommentArray(dbResponse.rows)
}

function decodeCommentArray(encodedComments) {
    let decodedComments = []
    encodedComments.forEach(encodedComment => {
        decodedComments.push(decodeCommentObject(encodedComment))
    });
    return decodedComments
}

function decodeCommentObject(comment) {
    const decodedComment = comment
    decodedComment.comment = encoders.base64Decode(comment.comment)
    decodedComment.firstName = encoders.base64Decode(comment.firstName)
    decodedComment.lastName = encoders.base64Decode(comment.lastName)
    decodedComment.commentTimestamp = formatCommentTimestamp(comment.commentTimestamp)
    return decodedComment
}

function formatCommentTimestamp(epochTimestamp) {
    const epochDate = new Date(0).setUTCSeconds(epochTimestamp)
    return formatISO9075(epochDate)
}

function decodeMeetingArray(encodedMeetings) {
    let decodedMeetings = []
    encodedMeetings.forEach(encodedMeeting => {
        decodedMeetings.push(decodeMeetingObject(encodedMeeting))
    });
    return decodedMeetings
}

function decodeMeetingObject(meeting) {
    const decodedMeeting = meeting
    decodedMeeting.bookIconUrl = encoders.base64Decode(meeting.bookIconUrl)
    decodedMeeting.bookTitle = encoders.base64Decode(meeting.bookTitle)
    decodedMeeting.bookAuthor = encoders.base64Decode(meeting.bookAuthor)
    decodedMeeting.meetingDate = format(meeting.meetingDate, 'PPP')
    return decodedMeeting
}

module.exports = {
    getClubMeetings,
    getClubMeetingById,
    saveClubMeetingComment,
    getClubMeetingComments
}