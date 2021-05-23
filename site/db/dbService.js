require('dotenv').config()
const { Pool } = require('pg')
const validator = require('validator')
const { userModel, clubModel } = require('../model')

const pool = new Pool({
    connectionString: process.env.DB_CONNECT_STRING
})

const schemaName = getValidatedSchemaName(process.env.DB_SCHEMA)

function getValidatedSchemaName(configSchemaName) {
    if (configSchemaName == undefined || configSchemaName == "") {
        throw Error('DB schema name must be configured')
    }
    if (!validator.isAlphanumeric(configSchemaName)) {
        throw Error('DB schema name must be alpha-numeric')
    }
    return configSchemaName
}

/*
    User Stuff
*/

async function getUserById(user_id) {
    return await userModel.getUserById(pool, schemaName, user_id)
}

async function getUserByEmail(email) {
    return await userModel.getUserByEmail(pool, schemaName, email)
}

async function saveUser(userDetails) {
    return await userModel.saveUser(pool, schemaName, userDetails)
}

/*
    Club Stuff
*/

async function getClubById(id) {
    return await clubModel.getClubById(pool, schemaName, id)
}

async function getClubsByUserId(id) {
    return await clubModel.getClubsByUserId(pool, schemaName, id)
}

async function saveClub(clubDetails) {
    return await clubModel.saveClub(pool, schemaName, clubDetails)
}

async function saveClubMember(club_id, user_id, club_role) {
    return await clubModel.saveClubMember(pool, schemaName, club_id, user_id, club_role)
}

module.exports = {
    getUserById,
    getUserByEmail,
    saveUser,
    getClubById,
    getClubsByUserId,
    saveClub,
    saveClubMember,
}