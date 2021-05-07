require('dotenv').config()
const { Pool } = require('pg')
const { userModel, clubModel } = require('../model')

const pool = new Pool({
    connectionString: process.env.DB_CONNECT_STRING
})

/*
    User Stuff
*/

async function getUserById(user_id) {
    return await userModel.getUserById(pool, user_id)
}

async function getUserByEmail(email) {
    return await userModel.getUserByEmail(pool, email)
}

async function saveUser(userDetails) {
    return await userModel.saveUser(pool, userDetails)
}

async function updateUser(userDetails) {
    return await userModel.updateUser(pool, userDetails)
}

/*
    Club Stuff
*/

async function getClubById(id) {
    return await clubModel.getClubById(pool, id)
}

async function getClubsByUserId(id) {
    return await clubModel.getClubsByUserId(pool, id)
}

async function saveClub(clubDetails) {
    return await clubModel.saveClub(pool, clubDetails)
}

async function saveClubMember(club_id, user_id, club_role) {
    return await clubModel.saveClubMember(pool, club_id, user_id, club_role)
}

module.exports = {
    getUserById,
    getUserByEmail,
    saveUser,
    updateUser,
    getClubById,
    getClubsByUserId,
    saveClub,
    saveClubMember,
}