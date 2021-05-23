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
    `select * from ${schemaName}.club where club_id = '${id}'`
    const dbResponse = await pool.query(queryString)
    const dbRow = dbResponse.rows[0]
    const decodedResponse = {
        clubId: dbRow.club_id,
        clubName: encoders.base64Decode(dbRow.club_name),
        clubDesc: encoders.base64Decode(dbRow.club_desc),
        iconUrl: encoders.base64Decode(dbRow.club_icon_url)
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
        `select c.club_id, c.club_name, c.club_desc, c.club_icon_url, m.user_id, m.club_role from ${schemaName}.club as c ` +
        `inner join ${schemaName}.club_member as m on c.club_id=m.club_id where m.user_id = '${userId}'`
    const dbResponse = await pool.query(queryString)
    const clubs = dbResponse.rows
    return decodeClubsByUserIdResp(clubs)
}

function decodeClubsByUserIdResp(clubs) {
    clubs.forEach(club => {
        club.club_name = encoders.base64Decode(club.club_name)
        club.club_desc = encoders.base64Decode(club.club_desc)
        club.club_icon_url = encoders.base64Decode(club.club_icon_url)
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
    const club_id = nanoid.nanoid()
    const encodedClubName = encoders.base64Encode(clubDetails.club_name)
    const encodedClubDesc = encoders.base64Encode(clubDetails.club_desc)
    const encodedClubIconUrl = encoders.base64Encode(clubDetails.club_icon_url)
    const queryString = 
        `insert into ${schemaName}.club (club_id, club_name, club_desc, club_icon_url) ` + 
        `values ('${club_id}', '${encodedClubName}', '${encodedClubDesc}', '${encodedClubIconUrl}')`
    await pool.query(queryString)
    return club_id
}

/**
 * Save a club member to the database, effectively adding the 
 * user to the club
 * @param {Pool} pool database connection pool
 * @param {string} schemaName name of the database schema
 * @param {object} clubDetails 
 * @returns {string} ID of the created club
 */
async function saveClubMember(pool, schemaName, club_id, user_id, club_role) {
    const queryString = 
        `insert into ${schemaName}.club_member (club_id, user_id, club_role) ` + 
        `values ('${club_id}', '${user_id}', '${club_role}')`
    await pool.query(queryString)
}

module.exports = {
    getClubById,
    getClubsByUserId,
    saveClub,
    saveClubMember,
}