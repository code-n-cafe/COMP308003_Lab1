import express from "express";
import { body } from "express-validator";
import { adminController } from "../controller/admin.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requiredRole.js";

export const adminRouter = () => {
    const router = express.Router();
    
    // Everything below requires login + admin role
    router.use(requireAuth, requireRole("admin"));
    router.post("/students", [
        body('studentNumber').notEmpty().withMessage('Student number is required'),
        body('password').notEmpty().withMessage('Password is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('firstName').notEmpty().withMessage('First name is required'),
        body('lastName').notEmpty().withMessage('Last name is required'),
        body('email').isEmail().withMessage('Valid email is required')
    ], adminController.createStudent);
    router.post("/courses", [
        body('courseCode').notEmpty().withMessage('Course code is required'),
        body('courseName').notEmpty().withMessage('Course name is required')
    ], adminController.createCourse);
    router.get("/students", adminController.listStudents);
    router.get("/courses/:courseCode/students", adminController.listStudentsByCourse);
    router.get("/courses", adminController.listCourses);

    return router;
}