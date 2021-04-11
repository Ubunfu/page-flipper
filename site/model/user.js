const hash = require('../security/hash')
const session = require('../security/session')
const AWS = require('aws-sdk');
AWS.config.update({
    region: process.env.TABLE_USERS_REGION
})
const docClient = new AWS.DynamoDB.DocumentClient()

/**
 * Gets a single user document from the DB
 * @param {string} email email address of a user
 * @returns 
 */
async function getUserByEmail(email) {
    const config = {
        TableName: process.env.TABLE_USERS,
        Key: { email }
    }
    const user = await docClient.get(config).promise()
    if (!user.Item) {
        console.error(`user with email ${email} not found`);
        throw new Error('user_not_found')
    }
    return user.Item
}

async function getUserByToken(token) {
    const decodedToken = await session.decodeToken(token)
    return await getUserByEmail(decodedToken.subject)
}

/**
 * Saves a single new user to the DB
 * @param {object} userDetails A user object
 */
async function saveNewUser(userDetails) {
    const hashedPassword = await hash.hashData(userDetails.password)
    const config = {
        TableName: process.env.TABLE_USERS,
        Item: {
            email: userDetails.email,
            passHash: hashedPassword,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            clubs: []
        }
    }
    await docClient.put(config).promise()
}

/**
 * Updates a user in the database
 * @param {object} userDetails 
 */
async function updateUser(userDetails) {
    const config = {
        TableName: process.env.TABLE_USERS,
        Item: {
            email: userDetails.email,
            passHash: userDetails.passHash,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            clubs: userDetails.clubs
        }
    }
    await docClient.put(config).promise()
}

/**
 * Associates a club ID to a user's list of active clubs
 * @param {string} userId 
 * @param {string} clubId 
 */
async function addClubToUser(userId, clubId) {
    const foundUser = await getUserByEmail(userId)
    console.log(foundUser);
    foundUser.clubs.push(clubId)
    console.log(foundUser);
    await updateUser(foundUser)
}

module.exports = {
    getUserByEmail,
    getUserByToken,
    saveNewUser,
    addClubToUser,
    updateUser,
}