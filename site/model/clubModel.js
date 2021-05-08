const nanoid = require('nanoid')

/**
 * Returns a club by its ID
 * @param {Pool} pool database connection pool
 * @param {string} id ID of a club
 * @returns {object} a club record
 */
async function getClubById(pool, id) {
    const queryString = 
        `select * from pf.club where club_id = '${id}'`
    const dbResponse = await pool.query(queryString)
    const dbRow = dbResponse.rows[0]
    const decodedResponse = {
        clubId: dbRow.club_id,
        clubName: base64Decode(dbRow.club_name),
        clubDesc: base64Decode(dbRow.club_desc),
        iconUrl: base64Decode(dbRow.club_icon_url)
    }
    return decodedResponse
}

/**
 * Returns a collection of clubs a user is a member of
 * @param {Pool} pool database connection pool
 * @param {string} userId ID of a user
 */
async function getClubsByUserId(pool, userId) {
    const queryString = 
        `select c.club_id, c.club_name, c.club_desc, c.club_icon_url, m.user_id, m.club_role from pf.club as c ` +
        `inner join pf.club_member as m on c.club_id=m.club_id where m.user_id = '${userId}'`
    const dbResponse = await pool.query(queryString)
    const clubs = dbResponse.rows
    return decodeClubsByUserIdResp(clubs)
}

function decodeClubsByUserIdResp(clubs) {
    clubs.forEach(club => {
        club.club_name = base64Decode(club.club_name)
        club.club_desc = base64Decode(club.club_desc)
        club.club_icon_url = base64Decode(club.club_icon_url)
    });
    return clubs
}

/**
 * Saves a club to the database
 * @param {Pool} pool database connection pool
 * @param {object} clubDetails 
 * @returns {string} ID of the created club
 */
async function saveClub(pool, clubDetails) {
    const club_id = nanoid.nanoid()
    const encodedClubName = base64Encode(clubDetails.club_name)
    const encodedClubDesc = base64Encode(clubDetails.club_desc)
    const encodedClubIconUrl = base64Encode(clubDetails.club_icon_url)
    const queryString = 
        `insert into pf.club (club_id, club_name, club_desc, club_icon_url) ` + 
        `values ('${club_id}', '${encodedClubName}', '${encodedClubDesc}', '${encodedClubIconUrl}')`
    await pool.query(queryString)
    return club_id
}

async function saveClubMember(pool, club_id, user_id, club_role) {
    const queryString = 
        `insert into pf.club_member (club_id, user_id, club_role) ` + 
        `values ('${club_id}', '${user_id}', '${club_role}')`
    await pool.query(queryString)
}

function base64Encode(data) {
    return Buffer.from(data).toString('base64')
}

function base64Decode(data) {
    return Buffer.from(data, 'base64').toString('ascii')
}

module.exports = {
    getClubById,
    getClubsByUserId,
    saveClub,
    saveClubMember,
}