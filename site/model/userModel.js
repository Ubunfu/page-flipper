const hash = require('../security/hash')
const { Pool } = require('pg')
const nanoid = require('nanoid')
const { encoders } = require('../util')

async function getUserById(pool, user_id) {
    const queryString = `select * from pf.user where user_id = '${user_id}'`
    const dbResp = await pool.query(queryString)
    if (dbResp.rows.length < 1) {
        throw Error('user_not_found')
    }
    return dbResp.rows[0]
}

/**
 * Gets a single user document from the DB
 * @param {Pool} pool database connection pool
 * @param {string} email email address of a user
 * @returns 
 */
async function getUserByEmail(pool, email) {
    const encodedEmail = encoders.base64Encode(email)
    const queryString = `select * from pf.user where email = '${encodedEmail}'`
    const dbResp = await pool.query(queryString)
    if (dbResp.rows.length < 1) {
        throw Error('user_not_found')
    }
    return dbResp.rows[0]
}

/**
 * Saves a single new user to the DB
 * @param {Pool} pool database connection pool
 * @param {object} userDetails A user object
 */
async function saveUser(pool, userDetails) {
    const user_id = nanoid.nanoid()
    const encodedEmail = encoders.base64Encode(userDetails.email)
    const encodedFirstName = encoders.base64Encode(userDetails.firstName)
    const encodedLastName = encoders.base64Encode(userDetails.lastName)
    const passHash = await hash.hashData(userDetails.password)
    const queryString = 
        `insert into pf.user (user_id, email, first_name, last_name, pass_hash) ` + 
        `values ('${user_id}', '${encodedEmail}', '${encodedFirstName}', '${encodedLastName}', '${passHash}')`
    await pool.query(queryString)
    return {
        user_id,
        email: userDetails.email,
        first_name: userDetails.firstName,
        last_name: userDetails.lastName
    }
}

module.exports = {
    getUserById,
    getUserByEmail,
    saveUser,
}