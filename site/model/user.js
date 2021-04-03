const AWS = require('aws-sdk');
const hash = require('../security/hash')
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
        Key: {
            HashKey: email
        }
    }
    return await docClient.get(config).promise()
}

/**
 * Saves a single user to the DB
 * @param {object} userRegDetails An object containing the registration
 *  form details of a new user
 */
async function saveUser(userRegDetails) {
    const hashedPassword = await hash.hashData(userRegDetails.password)
    const config = {
        TableName: process.env.TABLE_USERS,
        Item: {
            email: userRegDetails.email,
            passHash: hashedPassword,
            firstName: userRegDetails.firstName,
            lastName: userRegDetails.lastName
        }
    }
    await docClient.put(config).promise()
}

module.exports = {
    getUserByEmail,
    saveUser
}