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
async function getUserById(pool, schemaName, userId) {
    const queryString = `select * from ${schemaName}.user where "userId" = '${userId}'`
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
    const queryString = `select * from ${schemaName}.user where "email" = '${encodedEmail}'`
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
    const userId = nanoid.nanoid()
    const encodedEmail = encoders.base64Encode(userDetails.email)
    const encodedFirstName = encoders.base64Encode(userDetails.firstName)
    const encodedLastName = encoders.base64Encode(userDetails.lastName)
    const passHash = await hash.hashData(userDetails.password)
    const queryString = 
        `insert into ${schemaName}.user ("userId", "email", "firstName", "lastName", "passHash") ` + 
        `values ('${userId}', '${encodedEmail}', '${encodedFirstName}', '${encodedLastName}', '${passHash}')`
    await pool.query(queryString)
    return {
        userId,
        email: userDetails.email,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName
    }
}

function decodeUserObject(user) {
    const decodedUser = user
    decodedUser.email = encoders.base64Decode(user.email)
    decodedUser.firstName = encoders.base64Decode(user.firstName)
    decodedUser.lastName = encoders.base64Decode(user.lastName)
    return decodedUser
}

module.exports = {
    getUserById,
    getUserByEmail,
    saveUser,
}