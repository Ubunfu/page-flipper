require('dotenv').config()
const { Pool } = require('pg')
const validator = require('validator')
const { userModel, clubModel, clubMemberModel, clubMeetingModel } = require('../model')

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

async function getUserById(userId) {
    return await userModel.getUserById(pool, schemaName, userId)
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

async function updateClub(clubDetails) {
    return await clubModel.updateClub(pool, schemaName, clubDetails)
}

async function saveClubMember(clubId, userId, clubRole) {
    return await clubModel.saveClubMember(pool, schemaName, clubId, userId, clubRole)
}

/*
    Club Member Stuff
*/
async function getClubMember(clubId, userId) {
    return await clubMemberModel.getClubMember(pool, schemaName, clubId, userId)
}

async function getClubMembersWithRole(clubId, clubRole) {
    return await clubMemberModel.getClubMembersWithRole(pool, schemaName, clubId, clubRole)
}

async function getClubMemberCount(clubId) {
    return await clubMemberModel.getClubMemberCount(pool, schemaName, clubId)
}

/*
    Club Meeting Stuff
*/
async function getClubMeetings(clubId) {
    return await clubMeetingModel.getClubMeetings(pool, schemaName, clubId)
}

async function getClubMeetingById(meetingId) {
    return await clubMeetingModel.getClubMeetingById(pool, schemaName, meetingId)
}

async function saveClubMeetingComment(meetingId, userId, comment) {
    return await clubMeetingModel.saveClubMeetingComment(pool, schemaName, meetingId, userId, comment)
}

async function getClubMeetingComments(meetingId) {
    return await clubMeetingModel.getClubMeetingComments(pool, schemaName, meetingId)
}

module.exports = {
    getUserById,
    getUserByEmail,
    saveUser,
    getClubById,
    getClubsByUserId,
    saveClub,
    updateClub,
    saveClubMember,
    getClubMember,
    getClubMembersWithRole,
    getClubMemberCount,
    getClubMeetings,
    saveClubMeetingComment,
    getClubMeetingComments,
    getClubMeetingById
}