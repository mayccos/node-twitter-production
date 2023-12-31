const router = require('express').Router()
const {
    tweetsList,
    tweetCreate,
    tweetNew,
    tweetDelete,
    tweetEdit,
    tweetUpdate,
} = require('../controllers/tweets.controller')

router.get('/', tweetsList)
router.get('/new', tweetNew)
router.post('/', tweetCreate)
router.get('/edit/:tweetId', tweetEdit)
router.post('/update/:tweetId', tweetUpdate)
router.delete('/:tweetId', tweetDelete)

module.exports = router
