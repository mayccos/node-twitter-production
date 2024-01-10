const {
    createUser,
    findUserPerUsername,
    searchUsersPerUsername,
    addUserIdToCurrentUserFollowing,
    removeUserIdToCurrentUserFollowing,
    findUserPerId,
} = require('../queries/users.queries')
const path = require('path')
const multer = require('multer')
const { getUserTweetsFormAuthorId } = require('../queries/tweets.queries')

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../public/images/avatars'))
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`)
        },
    }),
})

const emailFactory = require('../emails')

exports.userList = async (req, res, next) => {
    try {
        const search = req.query.search
        const users = await searchUsersPerUsername(search)
        res.render('includes/search-menu', { users })
    } catch (e) {
        next(e)
    }
}
exports.userProfile = async (req, res, next) => {
    try {
        const username = req.params.username
        const user = await findUserPerUsername(username)
        const tweets = await getUserTweetsFormAuthorId(user._id)
        res.render('tweets/tweet', {
            tweets,
            isAuthenticated: req.isAuthenticated(),
            currentUser: req.user,
            user,
            editable: false,
        })
    } catch (e) {
        next(e)
    }
}

exports.signupForm = (req, res, next) => {
    res.render('users/user-form', {
        errors: null,
        isAuthenticated: req.isAuthenticated(),
        currentUser: req.user,
    })
}

exports.signup = async (req, res, next) => {
    const body = req.body
    try {
        // Nous allons créer le token dans cette méthode :
        const user = await createUser(body)
        emailFactory.sendEmailVerification({
            to: user.local.email,
            host: req.headers.host,
            username: user.username,
            userId: user._id,
            token: user.local.emailToken,
        })
        res.redirect('/')
    } catch (e) {
        res.render('users/user-form', {
            errors: [e.message],
            isAuthenticated: req.isAuthenticated(),
            currentUser: req.user,
        })
    }
}

exports.uploadImage = [
    upload.single('avatar'),
    async (req, res, next) => {
        try {
            const user = req.user
            user.avatar = `/images/avatars/${req.file.filename}`
            await user.save()
            res.redirect('/')
        } catch (e) {
            next(e)
        }
    },
]

exports.followUser = async (req, res, next) => {
    try {
        const userId = req.params.userId
        const [, user] = await Promise.all([
            addUserIdToCurrentUserFollowing(req.user, userId),
            findUserPerId(userId),
        ])
        res.redirect(`/users/${user.username}`)
    } catch (e) {
        next(e)
    }
}

exports.unFollowUser = async (req, res, next) => {
    try {
        const userId = req.params.userId
        const [, user] = await Promise.all([
            removeUserIdToCurrentUserFollowing(req.user, userId),
            findUserPerId(userId),
        ])
        res.redirect(`/users/${user.username}`)
    } catch (e) {
        next(e)
    }
}

exports.emailLinkVerification = async (req, res, next) => {
    try {
        // Affectation par décomposition (voir chapitre ES6) :
        const { userId, token } = req.params
        const user = await findUserPerId(userId)

        // Vérification que le token du lien et le token dans la base de données
        // sont bien les mêmes :
        if (user && token && token === user.local.emailToken) {
            user.local.emailVerified = true
            await user.save()
            return res.redirect('/')
        } else {
            return res.status(400).json('Problem during email verification')
        }
    } catch (e) {
        next(e)
    }
}
