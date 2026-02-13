import 'dotenv/config';
import express from "express";
import { studentRouter } from "./route/student.routes.js";
import { adminRouter } from "./route/admin.routes.js";
import { authRouter } from "./route/auth.route.js";
import connectDB from "../config/mongoose.js";

const app = express();

app.use(express.json());

// simple health route for testing
app.get("/health", (req, res) => res.json({ ok: true, env: process.env.NODE_ENV || "development" }));

app.use("/api/auth", authRouter());
app.use("/api/students", studentRouter());
app.use("/api/admin", adminRouter());

// start after DB connection
(async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server running on port ${process.env.PORT || 3000}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();