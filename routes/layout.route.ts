import express from "express";
import { isAuthenticated, authorizedRoles } from "../middleware/auth";
import { createLayout, editLayout, getLayoutByType } from "../controllers/layout.controller";

const layoutRouter = express.Router();

layoutRouter.post(
  "/create-layout",
  isAuthenticated,
  authorizedRoles("admin"),
  createLayout
);
layoutRouter.put(
  "/edit-layout",
  isAuthenticated,
  authorizedRoles("admin"),
  editLayout
);
layoutRouter.get(
  "/get-layout",
  isAuthenticated,
  getLayoutByType
);


export default layoutRouter;
