const { encoders } = require('../util')

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
    return decodedMeeting
}

module.exports = {
    getClubMeetings
}