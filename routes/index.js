const express = require('express')
const tweets = require('./tweets.routes')
const users = require('./users.routes')
const auth = require('./auth.routes')
const { ensureAuthenticated } = require('../config/guards.config')
const router = express.Router()

router.use('/tweets', ensureAuthenticated, tweets)
router.use('/users', users)
router.use('/auth', auth)

router.get('/', (req, res) => {
    res.redirect('/tweets')
})

module.exports = router
