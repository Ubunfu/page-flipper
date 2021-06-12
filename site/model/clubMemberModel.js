const { query } = require('express')
const { encoders } = require('../util')

/**
 * Returns a single club member
 * @param {string} clubId ID of the club the user is a member of
 * @param {string} userId The ID of the user
 * @returns {object} An object containing club membership details
 */
async function getClubMember(pool, schemaName, clubId, userId) {
    const queryString = 
        `select * from ${schemaName}.club_member `
        + `where "clubId" = '${clubId}' and "userId" = '${userId}'`
    const dbResponse = await pool.query(queryString)
    return dbResponse.rows[0]
}

/**
 * Returns the set of user objects for club members with a given role
 * @param {string} clubId 
 * @param {string} clubRole 
 * @returns {object[]} A set of user objects corresponding to members of 
 *      the given club with the given role 
 */
async function getClubMembersWithRole(pool, schemaName, clubId, clubRole) {
    const queryString = 
        `select u."userId", u."firstName", u."lastName", u."email" from ${schemaName}.user as u ` +
        `inner join ${schemaName}.club_member as m on u."userId"=m."userId" ` + 
        `where "clubId" = '${clubId}' and "clubRole" = '${clubRole}'`
    const dbResponse = await pool.query(queryString)
    return decodeUserArray(dbResponse.rows)
}

/**
 * Returns the number of members in a given club
 * @param {*} clubId 
 */
async function getClubMemberCount(pool, schemaName, clubId) {
    const queryString = 
        `select count(*) from ${schemaName}.club_member ` +
        `where "clubId" = '${clubId}'`
    const dbResponse = await pool.query(queryString)
    return dbResponse.rows[0].count
}

function decodeUserArray(encodedUsers) {
    let decodedUsers = []
    encodedUsers.forEach(encodedUser => {
        decodedUsers.push(decodeUserObject(encodedUser))
    });
    return decodedUsers
}

function decodeUserObject(user) {
    const decodedUser = user
    decodedUser.email = encoders.base64Decode(user.email)
    decodedUser.firstName = encoders.base64Decode(user.firstName)
    decodedUser.lastName = encoders.base64Decode(user.lastName)
    return decodedUser
}

module.exports = {
    getClubMember,
    getClubMembersWithRole,
    getClubMemberCount
}