import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from '../models/User.js'


/** POST http://localhost:5001/api/register
 * @param : {
    "username": "example123",
    "password": "1234",
    "firstName": "bob",
    "lastName": "robert",
 * }
 */

export const createUser = async(req, res) => {
  try {
    const {username, email, password, firstName, lastName} = req.body;

    const existsUsername = await User.findOne({username})
    if(existsUsername) res.status(400).json('Username is already taken')

    const existsEmail = await User.findOne({email})
    if(existsEmail) res.status(400).json('Email is already taken')

    const newUser = await User.create(req.body)
    // delete newUser.password
    res.status(201).json(newUser)
    
  } catch (err) {
    res.status(500).json({error: err.message})
  }
}

/**  */

/** POST http://localhost:5001/api/login
 * @param : {
    "username": "example123",
    "password": "1234",
 * }
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({email: email})

    if(user && await user.isPasswordMatched(password)){
      const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
      res.status(200).json({token, user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }})
    }else{
      res.status(400).json({message: 'Invaild credentials'})
    }
    
  } catch (err) {
    res.send(500).json({error: err.message})
  }
}

