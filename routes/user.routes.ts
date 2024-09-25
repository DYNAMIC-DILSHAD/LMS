import { Express } from "express";
import { registerUser,activateUser } from "../controllers/user.controller";
import { Router } from "express";

const router = Router();

router.route('/registeration').post(registerUser)
router.route("/activate-user").post(activateUser)

export default router;

