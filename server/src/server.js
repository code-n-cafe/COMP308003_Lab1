import express from "express";
import { studentRouter } from "./route/student.routes.js";
import { adminRouter } from "./route/admin.routes.js";
import { authRouter } from "./route/auth.route.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/auth", authRouter());
app.use("/api/students", studentRouter());
app.use("/api/admin", adminRouter());

app.listen(3000, () => {
  console.log("Server running on port 3000");
});