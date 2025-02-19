import express from "express";
import {
  editCourse,
  getAllCourses,
  getSingleCourse,
  uploadCourse,
} from "../controllers/courseController";
import { authorizedRoles, isAuthenticated } from "../middleware/auth";
const courseRouter = express.Router();

courseRouter.post(
  "/create-course",
  isAuthenticated,
  authorizedRoles("admin"),
  uploadCourse
);
courseRouter.put(
  "/edit-course/:id",
  isAuthenticated,
  authorizedRoles("admin"),
  editCourse
);
courseRouter.get("/get-course/:id", getSingleCourse);
courseRouter.get("/get-course", getAllCourses);

export default courseRouter;
