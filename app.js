const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const usersRouter = require('./controllers/users')
const blogRouter = require('./controllers/blog')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

// eslint-disable-next-line no-undef
const url = config.MONGODB_URI

console.log('connecting to', url);

(async () => {
    try {
        await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
        console.log('connected to MongoDB')
    } catch (error) {
        console.log('error connecting to MongoDB:', error.message)   
    }
})()
app.use(cors())
// app.use(express.static('build'))
app.use(express.json())

app.use(middleware.requestLogger)
// app.use(middleware.tokenExtractor)
app.use('/api/blogs', blogRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

    

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app