import { Express } from "express";
import { registerUser,activateUser, loginUser, logoutUser } from "../controllers/user.controller";
import { Router } from "express";

const router = Router();

router.route('/registeration').post(registerUser)
router.route("/activate-user").post(activateUser)
router.route("/login").post(loginUser)
router.route("/logout").get(logoutUser)

export default router;

