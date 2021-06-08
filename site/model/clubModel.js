const nanoid = require('nanoid')
const { encoders } = require('../util')

/**
 * Returns a club by its ID
 * @param {Pool} pool database connection pool
 * @param {string} schemaName name of the database schema
 * @param {string} id ID of a club
 * @returns {object} a club record
 */
async function getClubById(pool, schemaName, id) {
    const queryString = 
    `select * from ${schemaName}.club where "clubId" = '${id}'`
    const dbResponse = await pool.query(queryString)
    const dbRow = dbResponse.rows[0]
    const decodedResponse = {
        clubId: dbRow.clubId,
        clubName: encoders.base64Decode(dbRow.clubName),
        clubDesc: encoders.base64Decode(dbRow.clubDesc),
        iconUrl: encoders.base64Decode(dbRow.clubIconUrl)
    }
    return decodedResponse
}

/**
 * Returns a collection of clubs a user is a member of
 * @param {Pool} pool database connection pool
 * @param {string} schemaName name of the database schema
 * @param {string} userId ID of a user
 */
async function getClubsByUserId(pool, schemaName, userId) {
    const queryString = 
        `select c."clubId", c."clubName", c."clubDesc", c."clubIconUrl", m."userId", m."clubRole" from ${schemaName}.club as c ` +
        `inner join ${schemaName}.club_member as m on c."clubId"=m."clubId" where m."userId" = '${userId}'`
    const dbResponse = await pool.query(queryString)
    const clubs = dbResponse.rows
    return decodeClubsByUserIdResp(clubs)
}

function decodeClubsByUserIdResp(clubs) {
    clubs.forEach(club => {
        club.clubName = encoders.base64Decode(club.clubName)
        club.clubDesc = encoders.base64Decode(club.clubDesc)
        club.clubIconUrl = encoders.base64Decode(club.clubIconUrl)
    });
    return clubs
}

/**
 * Saves a club to the database
 * @param {Pool} pool database connection pool
 * @param {string} schemaName name of the database schema
 * @param {object} clubDetails 
 * @returns {string} ID of the created club
 */
async function saveClub(pool, schemaName, clubDetails) {
    const clubId = nanoid.nanoid()
    const encodedClubName = encoders.base64Encode(clubDetails.clubName)
    const encodedClubDesc = encoders.base64Encode(clubDetails.clubDesc)
    const encodedClubIconUrl = encoders.base64Encode(clubDetails.clubIconUrl)
    const queryString = 
        `insert into ${schemaName}.club ("clubId", "clubName", "clubDesc", "clubIconUrl") ` + 
        `values ('${clubId}', '${encodedClubName}', '${encodedClubDesc}', '${encodedClubIconUrl}')`
    await pool.query(queryString)
    return clubId
}

/**
 * Save a club member to the database, effectively adding the 
 * user to the club
 * @param {Pool} pool database connection pool
 * @param {string} schemaName name of the database schema
 * @param {object} clubDetails 
 * @returns {string} ID of the created club
 */
async function saveClubMember(pool, schemaName, clubId, userId, clubRole) {
    const queryString = 
        `insert into ${schemaName}.club_member ("clubId", "userId", "clubRole") ` + 
        `values ('${clubId}', '${userId}', '${clubRole}')`
    await pool.query(queryString)
}

module.exports = {
    getClubById,
    getClubsByUserId,
    saveClub,
    saveClubMember,
}