const router = require('express').Router()
const {
    signup,
    signupForm,
    uploadImage,
    userProfile,
    userList,
} = require('../controllers/users.controller')
const { ensureAuthenticated } = require('../config/guards.config')

router.get('/', userList)
router.get('/:username', userProfile)
router.get('/signup/form', signupForm)
router.post('/signup', signup)
router.post('/update/image', ensureAuthenticated, uploadImage)

module.exports = router
