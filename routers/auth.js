const express = require('express')
const { route } = require('./main')
const router = express.Router()

router.get('/signup', (req, res) => {
    res.render('signup', {})
})

router.get('/login', (req, res) => {
    res.render('login', {})
})

module.exports = router