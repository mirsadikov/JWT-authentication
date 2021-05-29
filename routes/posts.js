const router = require('express').Router()
const protect = require('../middlewares/varifyToken')

router.get('/', protect, (req, res) => {
    const posts = {
        posts: [
            { title: 'Title 1', body: 'Body 1' },
            { title: 'Title 2', body: 'Body 2' },
        ],
    }

    res.json({ user: req.user, posts })
})

module.exports = router
