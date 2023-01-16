import bcrypt from 'bcrypt'
import User from "../models/User.js";
import ErrorHandler from '../utils/errorHandler.js';
import {catchAsyncErrors} from '../middleware/asyncError.js'

/** GET http://localhost:5001/api/users/example123 */
export const getUser = catchAsyncErrors( async(req, res, next) => {
  // try {
    const user = await User.findById(req.params.id)
    if(!user){
      return next(new ErrorHandler('User not found', 404))
    }
    const {password, ...others} = user._doc
    res.status(200).json(others)
  // } catch (err) {
  //   res.send(404).json({error: err.message})
  // } 
})

/** GET http://localhost:5001/users */
export const getAllUsers = catchAsyncErrors(async(req, res) => {
    const users = await User.find()  
    res.status(200).json(users)
})

/** GET http://localhost:5001/users */
export const deleteUser = catchAsyncErrors(async(req, res, next) => {
  // try {
    const {id} = req.params
    const user = await User.findById(id)
    if(!user){
      return next(new ErrorHandler('User not found', 404))
    }
    const deletedUser = await User.findByIdAndDelete(id)  
    res.status(200).json(deletedUser)
})

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
  export const updateUser = catchAsyncErrors( async(req, res) => {
    const {id} = req.params

    if(req.user._id == id || req.user.role == "admin" || req.user.role == 'superuser'){
        const updatedUser = await User.findByIdAndUpdate(
          id,
          {$set: req.body},
          {new: true}
        )
        const user = await User.findById(id)
        const {password, ...rest} = user._doc
        res.status(200).json(rest)
    }
  })

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
  export const blockUser = catchAsyncErrors(async(req, res) => {
    
    const { id } = req.params
    const user = await User.findById(id)
    if(!user){
      return next(new ErrorHandler('User not found', 404))
    }

    // try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        {$set: {isBlocked: true}},
        {new: true}
      )
      // const user = await User.findById(id) 
      const {password, ...rest} = user._doc
      res.status(200).json(rest)
    // } catch (err) {
    //   res.status(500).json({error: err}) 
    // }
  })

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