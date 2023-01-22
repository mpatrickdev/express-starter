import jwt from 'jsonwebtoken'

import { catchAsyncErrors } from './asyncError.js'
import User from '../models/User.js'
import ErrorHandler from '../utils/errorHandler.js'

/* Authentication */ 
export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const {token} = req.cookies

  if(!token){
    return next(new ErrorHandler("Invaild access token, please login", 401))
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY)

  req.user = await User.findById(decodedData.id)

  next()
})

/* Authorization */ 
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if(!roles.includes(req.user.role)){
      return next(new ErrorHandler(`${req.user.role} can not access this resource`, 401))
    }
    next()
  }
}