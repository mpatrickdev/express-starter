import { Router } from "express";
import { createUser, login } from "../controllers/auth.js";

const router = Router()

/*  POST */
/**
 * /register
 * /registerMail
 * /authenticate
 * /login
 * */  
router.post('/register', createUser)
router.post('/login', login)

/**
 * GET
 * /user/:username
 * /generateOTP
 * /verifyOTP
 * /createResetSession
 *  
 * */ 

/**
 * PUT
 * /updateUser
 * /resetPassword
 */
export default router