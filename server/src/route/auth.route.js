import express from "express";
import { body } from "express-validator";
import { validationResult } from "express-validator";
import { login } from "../controller/auth.controller.js";

export const authRouter = () => {
  const router = express.Router();

  router.post(
    "/login",
    [
      // Minimal validation: must include password, and either studentNumber or username
      body("password").notEmpty().withMessage("Password is required"),
      body().custom((value) => {
        if (!value.username && !value.studentNumber) {
          throw new Error("Provide either username (admin) or studentNumber (student)");
        }
        return true;
      })
    ],
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }
      return next();
    },
    login
  );

  return router;
};
