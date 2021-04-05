const AWS = require('aws-sdk');
AWS.config.update({
    region: process.env.TABLE_USERS_REGION
})
const docClient = new AWS.DynamoDB.DocumentClient()

/**
 * Returns a club by its ID
 * @param {string} id ID of a club
 * @returns {object} a club record
 */
async function getClubById(id) {
    const config = {
        TableName: process.env.TABLE_CLUBS,
        Key: { id }
    }
    const dbResponse = await docClient.get(config).promise()
    if (!dbResponse.Item) {
        console.error(`club with ID ${id} not found`);
        throw new Error('club_not_found')
    }
    return dbResponse.Item
}

/**
 * Returns a list of club records batch-fetched by their IDs
 * @param {string[]} ids list of club IDs
 * @returns {object[]} a list of club records
 */
async function getClubsByIds(ids){
    let keyList = []
    for(id of ids) {
        keyList.push({ id })
    }
    const config = {
        RequestItems: {
            [process.env.TABLE_CLUBS]: {
                Keys: keyList
            }
        }
    }
    const dbResponse = await docClient.batchGet(config).promise()
    if (!dbResponse.Responses[process.env.TABLE_CLUBS]) {
        console.error(`clubs with IDs: ${ids} not found`);
        throw new Error('clubs_not_found')
    }
    return dbResponse.Responses[process.env.TABLE_CLUBS]
}

module.exports = {
    getClubById,
    getClubsByIds,
}