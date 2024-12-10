import { Express } from "express";
import {
  registerUser,
  activateUser,
  loginUser,
  logoutUser,
  updateAccessToken,
  getUserInfo,
} from "../controllers/user.controller";
import { Router } from "express";
import { authorizedRoles, isAuthenticated } from "../middleware/auth";

const router = Router();

router.route("/registeration").post(registerUser);
router.route("/activate-user").post(activateUser);
router.route("/login").post(loginUser);
router.route("/logout").get(isAuthenticated,logoutUser);
router.route("/refresh").get(updateAccessToken)
router.route("/me").get(isAuthenticated,getUserInfo)

export default router;
