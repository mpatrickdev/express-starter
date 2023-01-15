import mongoose from "mongoose"
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema(
  {    
    username: {
      type: String,
      required: [true, "Please provide a username"],
      unique: [true, "Username already taken"]
    },
    // },
    // firstName: {
    //   type: String,
    //   required: true,
    //   min:2,
    //   max: 50
    // },
    // lastName: {
    //   type: String,
    //   required: true,
    //   min:2,
    //   max: 50
    // },
    email: {
      type: String,
      required: [true, "Please provide a unique email"],
      unique: [true, "Email Address already taken"],
      max: 50
    },
    password: {
      type: String,
      required: true,
      // min:5
    },
    // picturePath: {
    //   type: String,
    //   default: ''
    // },
    // friends: {
    //   type: Array,
    //   default: []
    // },
    firstName: String,
    lastName: String,
    location: String,
    // occupation: String,
    phone: String,
    role: {
      type: String,
      enum: ['user', 'admin', 'superuser'],
      default: 'user'
    },
    isBlocked: {
      type: Boolean,
      default: false
    },
    cart: {
      type: Array,
      default: []
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address"
    },
    wishList: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }

  }, 
  {timestamps: true})

/** HASH PASSWORD */
UserSchema.pre('save', async function(next){
  if(!this.isModified('password')){
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

/** CHECK PASSWORD MATCH */
UserSchema.methods.isPasswordMatched = async function(password) {
  return await bcrypt.compare(password, this.password)
}
const User = mongoose.model("User", UserSchema) 
export default User