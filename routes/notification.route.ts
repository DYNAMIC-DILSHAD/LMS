import express from "express";
import { authorizedRoles, isAuthenticated } from "../middleware/auth";
import { getNotifiaction, updateNotification } from "../controllers/notification.controller";
import { updateAccessToken } from "../controllers/user.controller";
const notificationRouter = express.Router();

notificationRouter.get(
  "/get-all-notifications",
  updateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  getNotifiaction
);
notificationRouter.put(
  "/update-notification/:id",
  updateAccessToken,
  isAuthenticated,
  authorizedRoles("admin"),
  updateNotification
);


export default notificationRouter