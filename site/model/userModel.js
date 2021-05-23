const hash = require('../security/hash')
const { Pool } = require('pg')
const nanoid = require('nanoid')
const { encoders } = require('../util')

/**
 * Gets a single user from the DB by their user ID
 * @param {Pool} pool database connection pool
 * @param {string} schemaName name of the database schema
 * @param {string} email email address of a user
 * @returns 
 */
async function getUserById(pool, schemaName, user_id) {
    const queryString = `select * from ${schemaName}.user where user_id = '${user_id}'`
    const dbResp = await pool.query(queryString)
    if (dbResp.rows.length < 1) {
        throw Error('user_not_found')
    }
    return decodeUserObject(dbResp.rows[0])
}

/**
 * Gets a single user from the DB by their email address
 * @param {Pool} pool database connection pool
 * @param {string} schemaName name of the database schema
 * @param {string} email email address of a user
 * @returns 
 */
async function getUserByEmail(pool, schemaName, email) {
    const encodedEmail = encoders.base64Encode(email)
    const queryString = `select * from ${schemaName}.user where email = '${encodedEmail}'`
    const dbResp = await pool.query(queryString)
    if (dbResp.rows.length < 1) {
        throw Error('user_not_found')
    }
    return decodeUserObject(dbResp.rows[0])
}

/**
 * Saves a single new user to the DB
 * @param {Pool} pool database connection pool
 * @param {string} schemaName name of the database schema
 * @param {object} userDetails A user object
 */
async function saveUser(pool, schemaName, userDetails) {
    const user_id = nanoid.nanoid()
    const encodedEmail = encoders.base64Encode(userDetails.email)
    const encodedFirstName = encoders.base64Encode(userDetails.firstName)
    const encodedLastName = encoders.base64Encode(userDetails.lastName)
    const passHash = await hash.hashData(userDetails.password)
    const queryString = 
        `insert into ${schemaName}.user (user_id, email, first_name, last_name, pass_hash) ` + 
        `values ('${user_id}', '${encodedEmail}', '${encodedFirstName}', '${encodedLastName}', '${passHash}')`
    await pool.query(queryString)
    return {
        user_id,
        email: userDetails.email,
        first_name: userDetails.firstName,
        last_name: userDetails.lastName
    }
}

function decodeUserObject(user) {
    const decodedUser = user
    decodedUser.email = encoders.base64Decode(user.email)
    decodedUser.first_name = encoders.base64Decode(user.first_name)
    decodedUser.last_name = encoders.base64Decode(user.last_name)
    return decodedUser
}

module.exports = {
    getUserById,
    getUserByEmail,
    saveUser,
}