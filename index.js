import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import connectDB from './config/db.js'

import users from './routes/users.js'
import auth from './routes/auth.js'
import links from './routes/links.js'
import files from './routes/files.js'

// Create server
const app = express()

// Connect to database
connectDB()

// Cors
const corsOptions = {
    origin: process.env.FRONTEND_URL,
}
app.use(cors(corsOptions))

const PORT = process.env.PORT || 4000
app.use(express.json())

// Public routes
app.use(express.static('uploads'))

// Routes
app.use('/api/users', users)
app.use('/api/auth', auth)
app.use('/api/links', links)
app.use('/api/files', files)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
