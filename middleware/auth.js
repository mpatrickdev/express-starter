import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header('Authorization')

    if(!token){
      return res.status(403).send('Access Denied')
    }

    if(token.startsWith('Bearer ')){
      token = token.slice(7, token.length).trimLeft()
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(verified.id)
    const {password, ...rest} = user._doc

    req.user = rest
    next()
  } catch (err) {
    res.status(500).json({message: err.message})
  }
}

export const isAdmin = (req, res, next) => {
  if(req.user.role != 'admin'){
    res.status(401).json({message: 'You are not admin'})
  }
  next()
}