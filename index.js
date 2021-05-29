const express = require('express')
const app = express()
const dotenv = require('dotenv')
const connectDB = require('./config/db')

// Import routes
const authRoute = require('./routes/auth')
const postsRoute = require('./routes/posts')

dotenv.config()

// Connect to DB
connectDB()

// Middlewares
app.use(express.json())

// Route middlewares
app.use('/api/user', authRoute)
app.use('/api/posts', postsRoute)

app.listen(3000, () => {
    console.log('Server: http://localhost:3000')
})
