import express from "express";
import { authorizedRoles, isAuthenticated } from "../middleware/auth";
import { getNotifiaction, updateNotification } from "../controllers/notification.controller";
const notificationRouter = express.Router();

notificationRouter.get(
  "/get-all-notifications",
  isAuthenticated,
  authorizedRoles("admin"),
  getNotifiaction
);
notificationRouter.put(
  "/update-notification/:id",
  isAuthenticated,
  authorizedRoles("admin"),
  updateNotification
);


export default notificationRouter