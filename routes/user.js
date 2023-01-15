import { Router } from "express";
import { deleteUser, getAllUsers, getUser, updateUser, unblockUser, blockUser } from "../controllers/user.js";
// import { updateUser} from "../controllers/user.js";
import {verifyToken, isAdmin } from '../middleware/auth.js'

const router = Router()

/* READ */
router.get('/:id', verifyToken, getUser)
router.get('/', verifyToken, isAdmin, getAllUsers)
// router.get('/:id/friends', verifyToken, getUserFriends)

/* UPDATE */
router.put('/:id', verifyToken, updateUser)

/* PATCH */
router.patch('/:id/block', verifyToken, isAdmin, blockUser)
router.patch('/:id/unblock', verifyToken, isAdmin, unblockUser)

/* DELETE */
router.delete('/:id', verifyToken, isAdmin, deleteUser)
export default router