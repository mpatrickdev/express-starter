import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { dbConnect } from './db/index.js'

import userRoutes from './routes/user.js'
import { errorHandler } from './middleware/error.js'

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
app.use(cookieParser())
app.use('/static', express.static('static'))

/* ROUTES */
app.use('/api', userRoutes)

/* MIDDLEWARE */
app.use(errorHandler)

/* MONGO */ 
dbConnect()

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => console.log(`ServerPort: ${PORT}`))


// Unhandled promise rejection
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`)
  console.log(`Shutting down the server due to unhandeled promise rejection`)
  server.close(() => {
    process.exit(1)
  })
})