import { Express } from "express";
import {
  registerUser,
  activateUser,
  loginUser,
  logoutUser,
  updateAccessToken,
  getUserInfo,
  SocialAuth,
  updateUserInfo,
  updatePassword,
  updateProfiePicture,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "../controllers/user.controller";
import { Router } from "express";
import { authorizedRoles, isAuthenticated } from "../middleware/auth";

const router = Router();

router.route("/registeration").post(registerUser);
router.route("/activate-user").post(activateUser);
router.route("/login").post(loginUser);
router.route("/logout").get(isAuthenticated, logoutUser);
router.route("/refresh").get(updateAccessToken);
router.route("/me").get(isAuthenticated, getUserInfo);
router.route("/social-auth").post(SocialAuth);
router.route("/update-user-inf0").put(isAuthenticated, updateUserInfo);
router.route("/update-user-password").put(isAuthenticated, updatePassword);
router.route("/update-user-avatar").put(isAuthenticated, updateProfiePicture);
router
  .route("/get-all-users")
  .get(isAuthenticated, authorizedRoles("admin"), getAllUsers);
router
  .route("/update-user-role")
  .put(isAuthenticated, authorizedRoles("admin"), updateUserRole);

router
  .route("/delete-user/:id")
  .delete(isAuthenticated, authorizedRoles("admin"), deleteUser);

export default router;
