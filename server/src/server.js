import express from "express";
import { studentRouter } from "./route/student.routes";
import { adminRouter } from "./route/admin.routes";
import { authRouter } from "./route/auth.route";

const app = express();

app.use(express.json());

app.use("/api/auth", authRouter());
app.use("/api/students", studentRouter());
app.use("/api/admin", adminRouter());

app.listen(3000, () => {
  console.log("Server running on port 3000");
});