const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/User')
const { registerValidation, loginValidation } = require('../validation')

// REGISTER
router.post('/register', async (req, res) => {
    // VALIDATION
    const { error } = registerValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // CHECK IF EMAIL EXISTS
    const emailExist = await User.findOne({ email: req.body.email })
    if (emailExist) return res.status(400).send('Email already exists!')

    // IF NO ERROR

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    // Create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    })
    // SAVE TO MongoDB
    try {
        const savedUser = await user.save()
        res.send(savedUser)
    } catch (error) {
        res.status(400).send(error)
    }
})

// LOGIN
router.post('/login', async (req, res) => {
    // VALIDATION
    const { error } = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // CHECK IF EMAIL EXISTS
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(404).send('User is not found, wrong email!')

    // CHECK PASSWORD
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) return res.status(400).send('Email or password is wrong!')

    // Create JWT token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)

    // IF NO ERROR
    res.header('auth-token', token).send({ token, user })
})

module.exports = router
