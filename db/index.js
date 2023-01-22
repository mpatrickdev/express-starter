import mongoose from "mongoose";
// import data here
// import User from '../models/User.js'
// import { users } from "./seed.js";

export const dbConnect = () => {
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then((data) => {
    console.log(`Database connected at ${data.connection.host}`)
  
    /* ADD DATA ONCE */
    // User.insertMany(users)
    // Post.insertMany(posts)
  })
}