import mongoose from "mongoose"
import bcrypt from 'bcryptjs'
import validator from "validator"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const UserSchema = new mongoose.Schema(
  {    
    username: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true
    },
    email: {
      type: String,
      required: [true, "Please provide a unique email"],
      validate: [validator.isEmail, "Please enter valid email"],
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min:5
    },
    avatar: {
      public_id: String,
      url: String
    },
    firstName: String,
    lastName: String,
    location: String,
    // occupation: String,
    phone: String,
    role: {
      type: String,
      // enum: ['user', 'admin', 'superuser'],
      default: 'user'
    },
    isBlocked: {
      type: Boolean,
      default: false
    }, 
    resetPasswordToken: String,
    resetPasswordTime: Date
  }, 
  {timestamps: true})

/** HASH PASSWORD */
UserSchema.pre('save', async function(next){
  if(!this.isModified('password')){
    next()
  }
  this.password = await bcrypt.hash(this.password, 10)
})


/** CHECK PASSWORD MATCH */
UserSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password)
}

/** JWT TOKEN */
UserSchema.methods.getJwtToken = function(){
  return jwt.sign(
                  {id: this._id},
                  process.env.JWT_SECRET_KEY,
                  {expiresIn: process.env.JWT_EXPIRES}
                 )
}

/* FORGOT PASSWORD */
UserSchema.methods.getResetToken = function(){
  const resetToken = crypto.randomBytes(20).toString('hex')

  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  this.resetPasswordTime = Date.now() + 15 * 60 * 1000

  return resetToken
}

const User = mongoose.model("User", UserSchema) 
export default User