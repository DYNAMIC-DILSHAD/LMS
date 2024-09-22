import { Express } from "express";
import { registerUser } from "../controllers/user.controller";
import { Router } from "express";

const router = Router();

router.route('/registeration').post(registerUser)

export default router;

