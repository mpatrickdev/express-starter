import mongoose from "mongoose";
// _id: new mongoose.Types.ObjectId(),
export const users = [
  {
    _id: new mongoose.Types.ObjectId(),
    username: "bob",
    email: "bob@work.com",
    password: "aaaaa",
    firstName: "Bob",
    lastName: "Dilan",
  },
  {
    _id: new mongoose.Types.ObjectId(),
    username: "sam",
    email: "sam@work.com",
    password: "aaaaa",
    firstName: "Sam",
    lastName: "Reed",
    isBlocked: true
  },
  {
    _id: new mongoose.Types.ObjectId(),
    username: "admin",
    email: "admin@work.com",
    password: "aaaaa",
    firstName: "Admin",
    lastName: "Istrator",
    isAdmin: true
  }
]