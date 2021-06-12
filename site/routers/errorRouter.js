const express = require('express')
const router = new express.Router()

router.get('/forbidden', async (req, res) => {
    return res.render('error', {
        errorBanner: 'You shall not pass!',
        errorDescription: 'It looks like you\'re not allowed to do that',
        errorGif: 'https://media4.giphy.com/media/lN9amhr8GZMhG/giphy.gif?cid=ecf05e47mqirp8ok07ntjqrw30z37n8n66b8kfg5h72ldn5b&rid=giphy.gif&ct=g'
    })
})

module.exports = router