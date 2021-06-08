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
    return dbResponse.rows
}

module.exports = {
    getClubMember
}