import express from 'express';
import { param } from 'express-validator';
import { studentController } from "../controller/student.controller.js";
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/requiredRole.js';

export const studentRouter = () => {

const router = express.Router();
// Everything below requires login + student role
router.use(requireAuth, requireRole("student"));

router.post("/me/courses/:courseCode", [param('courseCode').notEmpty().withMessage('Course code is required')], studentController.addCourse);
router.get("/me/courses", studentController.listCourseByStudent);
router.put("/me/courses/:courseCode", [param('courseCode').notEmpty().withMessage('Course code is required')], studentController.updateCourse);
router.delete("/me/courses/:courseCode", studentController.dropCourse);

return router;
}