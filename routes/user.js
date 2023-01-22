import { Router } from "express";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";
import {
  createUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  userDetails,
  updatePassword,
  updateProfile,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
} from "../controllers/user.js";

const router = Router();

router.route("/register").post(createUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);

router.route("/me").get(isAuthenticated, userDetails);
router
  .route("/admin/users")
  .get(isAuthenticated, authorizeRoles("admin"), getAllUsers);
router
  .route("/admin/users/:id")
  .get(isAuthenticated, authorizeRoles("admin"), updateProfile)
  .put(isAuthenticated, authorizeRoles("admin"), updateUserRole)
  .delete(isAuthenticated, authorizeRoles("admin"), deleteUser);
router.route("/logout").get(logoutUser);

router.route("/password/reset/:token").put(resetPassword);
router.route("/me/update/profile").put(isAuthenticated, updateProfile);
router.route("/me/update/password").put(isAuthenticated, updatePassword);
// router.route('/admin/users/:id').get(isAuthenticated, authorizeRoles('admin'), updateUserRole)
export default router;
