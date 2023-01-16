import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'


import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import { errorHandler } from './middleware/error.js'

import User from './models/User.js'
import {users} from './data/index.js'

//  CONFIGURATION
dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}))
app.use(morgan('common'))
app.use(bodyParser.json({limit: '30mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}))
app.use(cors())
app.use('/static', express.static('static'))

/* ROUTES */
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

app.use(errorHandler)

/* MONGO */ 
const PORT = process.env.PORT
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  app.listen(PORT, () => console.log(`ServerPort: ${PORT}`))

  /* ADD DATA ONCE */
  // User.insertMany(users)
  // Post.insertMany(posts)
}).catch((err) => console.log(`${err} did not connect`))


// Unhandled promise rejection
process.on('unhandledRejection', (err) => {
  console.log(`Shutting down server for ${err.message}`)
  console.log(`Shutting down the server due to unhandeled promise rejection`)
  app.close(() => {
    process.exit(1)
  })
})