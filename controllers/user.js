import bcrypt from 'bcrypt'
import User from "../models/User.js";


/** GET http://localhost:5001/api/users/example123 */
export const getUser = async(req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const {password, ...others} = user._doc
    res.status(200).json(others)
  } catch (err) {
    res.send(404).json({error: err.message})
  } 
}

/** GET http://localhost:5001/users */
export const getAllUsers = async(req, res) => {
  try {
    const users = await User.find()  
    res.status(200).json(users)
  } catch (err) {
    res.send(500).json({error: err.message})
  } 
}

/** GET http://localhost:5001/users */
export const deleteUser = async(req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id)  
    res.status(200).json(deletedUser)
  } catch (err) {
    res.send(500).json({error: err.message})
  } 
}

/** PUT http://localhost:5001/api/users/123455
 * @param : {
      "id": "<user_id>"
    }
    body: 
   {
    "userid": "1234567",
    "username": "example123",
    "firstName": "bob",
    "lastName": "robert",
  }
 */
  export const updateUser = async(req, res) => {
    const {id} = req.params
    if(req.user._id == id || req.user.role == "admin" || req.user.role == 'superuser'){
      try {
        const updatedUser = await User.findByIdAndUpdate(
          id,
          {$set: req.body},
          {new: true}
        )
        const user = await User.findById(id)
        const {password, ...rest} = user._doc
        res.status(200).json(rest)
      } catch (err) {
        res.status(500).json({error: err}) 
      }
    }
  }

  /** PATCH http://localhost:5001/api/users/123455/block
 * @param : {
      "id": "<user_id>"
    }
    body: 
   {
    "userid": "1234567",
    "username": "example123",
    "firstName": "bob",
    "lastName": "robert",
  }
 */
  export const blockUser = async(req, res) => {
    
    const { id } = req.params
    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        {$set: {isBlocked: true}},
        {new: true}
      )
      const user = await User.findById(id) 
      const {password, ...rest} = user._doc
      res.status(200).json(rest)
    } catch (err) {
      res.status(500).json({error: err}) 
    }
  }

/** PATCH http://localhost:5001/api/users/123455/unblock
 * @param : {
      "id": "<user_id>"
    }
    body: 
   {
    "userid": "1234567",
    "username": "example123",
    "firstName": "bob",
    "lastName": "robert",
  }
 */
  export const unblockUser = async(req, res) => {
    
    const { id } = req.params
    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        {$set: {isBlocked: false}},
        {new: true}
      )
      const user = await User.findById(id) 
      const {password, ...rest} = user._doc
      res.status(200).json(rest)
    } catch (err) {
      res.status(500).json({error: err}) 
    }
  }