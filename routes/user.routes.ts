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

router.route("/registration").post(registerUser);
router.route("/activate-user").post(activateUser);
router.route("/login").post(loginUser);
router.route("/logout").get(updateAccessToken, isAuthenticated, logoutUser);
router.route("/refresh").get(updateAccessToken);
router.route("/me").get(updateAccessToken, isAuthenticated, getUserInfo);
router.route("/social-auth").post(SocialAuth);
router
  .route("/update-user-info")
  .put(updateAccessToken, isAuthenticated, updateUserInfo);
router
  .route("/update-user-password")
  .put(updateAccessToken, isAuthenticated, updatePassword);
router
  .route("/update-user-avatar")
  .put(updateAccessToken, isAuthenticated, updateProfiePicture);
router
  .route("/get-all-users")
  .get(
    updateAccessToken,
    isAuthenticated,
    authorizedRoles("admin"),
    getAllUsers
  );
router
  .route("/update-user-role")
  .put(
    updateAccessToken,
    isAuthenticated,
    authorizedRoles("admin"),
    updateUserRole
  );

router
  .route("/delete-user/:id")
  .delete(
    updateAccessToken,
    isAuthenticated,
    authorizedRoles("admin"),
    deleteUser
  );

export default router;
